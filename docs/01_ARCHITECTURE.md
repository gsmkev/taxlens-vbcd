# 01 — Arquitectura Técnica: TaxLens PY

## Principio Rector: Local-First

La arquitectura de TaxLens PY sigue el paradigma **local-first**: todos los datos sensibles del usuario (facturas, extractos, RUCs, montos) **jamás abandonan el dispositivo**. El servidor centralizado solo existe para gestionar identidades, configuraciones de esquemas y pagos.

```
┌──────────────────────────────────────────────────────────────────┐
│                        DISPOSITIVO DEL USUARIO                    │
│                                                                    │
│  ┌──────────────┐   ┌─────────────────┐   ┌───────────────────┐  │
│  │  Next.js App │   │ Transformers.js  │   │  Voy / Orama RAG  │  │
│  │  (Vercel CDN)│──▶│ Florence-2 (OCR) │   │  (WASM en memoria)│  │
│  │              │   │ Gemma 4 (LLM)   │   │                   │  │
│  └──────┬───────┘   └────────┬────────┘   └────────┬──────────┘  │
│         │                   │                      │             │
│         ▼                   ▼                      ▼             │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              OPFS (Origin Private File System)            │    │
│  │  • Imágenes de facturas originales                       │    │
│  │  • Vectores personalizados del usuario                   │    │
│  │  • Modelos ONNX descargados                              │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                              │ Solo metadatos
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                         INFRAESTRUCTURA CLOUD                     │
│                                                                    │
│   Vercel (Next.js)    Kinde (Auth)    Neon (PostgreSQL)           │
│   • UI estática       • JWT tokens   • Perfiles de usuario        │
│   • Service Workers   • Sessions     • Esquemas del Playground    │
│   • API Routes (min)  • Free tier    • Config de plantillas       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Capas de la Arquitectura

### Capa 1 — Presentación (Frontend)

**Tecnología:** Next.js 15 con App Router  
**Hosting:** Vercel (Free Tier — 100GB bandwidth/mes)

Responsabilidades:
- Renderizar la UI principal con Server Components para carga rápida
- Registrar y gestionar el **Service Worker** que orquesta las tareas de AI
- Proveer feedback de progreso en tiempo real (streaming de tokens desde modelos locales)
- Generar y descargar archivos Excel/CSV directamente en el cliente con ExcelJS

**Consideraciones de Performance:**
- Code splitting agresivo: los módulos de AI solo se cargan cuando el usuario los activa
- El primer pintado significativo debe ocurrir en < 1.5s (sin modelos cargados)
- Uso de `React.Suspense` + skeleton loaders para estados de carga de modelos (pueden tardar 30-90s en la primera descarga)

---

### Capa 2 — Inferencia de AI (En el Navegador)

**Tecnología:** Transformers.js v3 + WebGPU API

#### Modelo A: Florence-2 (OCR y Detección Visual)
- **Tamaño:** ~270MB (versión base quantizada a int8)
- **Tarea:** Extracción de texto de imágenes de facturas
- **Input:** Imagen JPEG/PNG de factura
- **Output:** Texto estructurado con coordenadas de bounding boxes
- **Latencia estimada:** 2-5 segundos por imagen (WebGPU) / 10-20s (CPU fallback)

#### Modelo B: Gemma 4 E2B (Análisis y Clasificación)
- **Tamaño:** ~2.5GB (quantizado a int4 via GPTQ)
- **Tarea:** Mapear texto extraído a columnas de Marangatu, aplicar reglas del Playground
- **Input:** Texto de factura + contexto del esquema del usuario
- **Output:** JSON estructurado con campos mapeados → validado por Instructor.js antes de usarse
- **Latencia estimada:** 5-15 segundos por factura (WebGPU)

#### Fallback Strategy:
```
WebGPU disponible? 
  → Usar Florence-2 + Gemma 4 completos
  → GPU VRAM > 4GB? → Gemma 4 int4
  → GPU VRAM < 4GB? → Gemma 4 int8 reducido

WebGPU NO disponible (CPU fallback):
  → Florence-2 tiny (80MB)
  → Gemma 4 250M (versión extra-pequeña)
  → Advertir al usuario sobre velocidad reducida
```

---

### Capa 2b — Validación Estructurada de Output LLM (Instructor.js)

**Tecnología:** `instructor` (port de Instructor para JS/TS) + Zod

**Propósito:** Los LLMs locales como Gemma 4 no garantizan que su output sea JSON válido ni que respete el schema esperado. Instructor.js envuelve cada llamada al LLM con un contrato de tipos Zod y maneja automáticamente los reintentos cuando el output no es válido.

**Por qué es crítico para TaxLens PY:**  
Un campo mal tipado en el output de clasificación (`imputa_iva: "si"` en lugar de `true`, o `monto_total: "350.000"` en lugar de `350000`) puede generar un archivo Marangatu inválido que la DNIT rechace. La validación no es opcional.

#### Schema Zod de clasificación de factura:
```typescript
// lib/ai/schemas.ts
import { z } from 'zod';

export const FacturaClasificadaSchema = z.object({
  rucEmisor:       z.string().regex(/^\d+-\d{1,2}$/, 'Formato RUC inválido'),
  timbrado:        z.string().length(8, 'Timbrado debe tener 8 dígitos'),
  numeroFactura:   z.string().regex(/^\d{3}-\d{3}-\d{7}$/, 'Formato factura inválido'),
  fechaEmision:    z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato fecha DD/MM/YYYY'),
  condicionVenta:  z.enum(['CONTADO', 'CREDITO']),
  montoTotal:      z.number().positive(),
  gravadas5:       z.number().min(0),
  gravadas10:      z.number().min(0),
  exentas:         z.number().min(0),
  iva5:            z.number().min(0),
  iva10:           z.number().min(0),
  concepto:        z.string().min(1),
  imputaIva:       z.boolean(),
  imputaIre:       z.boolean(),
  imputaIrpRsp:    z.boolean(),
  confianza:       z.number().min(0).max(1),
  dudas:           z.array(z.string()),
}).refine(
  // Invariante de negocio: cuadre matemático
  data => Math.abs((data.gravadas5 + data.gravadas10 + data.exentas) - data.montoTotal) < 1,
  { message: 'Cuadre matemático fallido: gravadas + exentas ≠ total' }
);

export type FacturaClasificada = z.infer<typeof FacturaClasificadaSchema>;
```

#### Flujo de validación con reintentos:
```typescript
// lib/ai/gemma.ts
import Instructor from '@instructor-ai/instructor';
import { FacturaClasificadaSchema } from './schemas';

// Instructor wrappea el cliente del LLM local
const client = Instructor({
  client: gemmaLocalClient,   // adaptador del Service Worker
  mode: 'JSON',               // fuerza output JSON en el prompt
});

export async function clasificarFactura(textoOcr: string): Promise<FacturaClasificada> {
  return client.chat.completions.create({
    model: 'gemma4-e2b-local',
    response_model: {
      schema: FacturaClasificadaSchema,
      name: 'FacturaClasificada',
    },
    max_retries: 3,             // reintentos automáticos si Zod falla
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_CLASIFICACION },
      { role: 'user',   content: textoOcr },
    ],
  });
}
```

#### Comportamiento ante fallos:
```
Intento 1: Gemma 4 genera JSON → Zod valida
  ✅ Válido → continuar pipeline
  ❌ Inválido → Instructor construye prompt de corrección con el error Zod

Intento 2: Gemma 4 recibe error + JSON anterior → corrige
  ✅ Válido → continuar pipeline
  ❌ Inválido → nuevo intento de corrección

Intento 3: Último intento
  ✅ Válido → continuar pipeline
  ❌ Inválido → marcar factura como REVISIÓN_PENDIENTE
              → guardar el último JSON parcial para revisión manual
              → loguear el error en IndexedDB para diagnóstico
```

**Schemas adicionales validados por Instructor.js:**
- `RespuestaRagSchema` — respuesta del RAG de la DNIT
- `ReglaLogicaSchema` — reglas del Logic Engine del Playground
- `EsquemaCamposSchema` — output del Schema Builder al guardar

---

### Capa 3 — RAG Local (Búsqueda Semántica)

**Tecnología:** Orama (motor de búsqueda en WASM) + embeddings pre-computados

#### Dos índices, dos propietarios:

| Índice | Archivo OPFS | Quién lo controla | Disponible en |
|---|---|---|---|
| DNIT Knowledge | `dnit-index-2025-Q1.json` | Solo el desarrollador | Free + Playground |
| Custom User | `custom-user-index.json` | El usuario (Playground) | Solo Playground |

El índice DNIT es de **solo lectura** para el usuario. No puede modificarse ni complementarse desde el módulo free. El índice custom solo existe si el usuario tiene Playground activo y ha subido documentos.

#### Base de Conocimiento DNIT (solo dev):
El desarrollador pre-procesa los documentos de la DNIT:
1. Segmentar resoluciones y leyes en chunks de ~500 tokens
2. Generar vectores con un modelo de embeddings liviano (all-MiniLM-L6-v2, ~25MB)
3. Serializar el índice vectorial a un archivo `.json` (~15-30MB según documentos incluidos)
4. Verificar hash SHA-256 y publicar en Google Drive con link de descarga directa

El usuario descarga este índice una sola vez y lo almacena en OPFS. Las búsquedas posteriores son instantáneas y offline.

#### Flujo de Búsqueda RAG (Marangatu Generator — Free):
```
Pregunta del usuario / Duda de clasificación
    ↓
Embedding local de la consulta (all-MiniLM vía Transformers.js)
    ↓
Búsqueda vectorial en Orama — SOLO índice DNIT (< 50ms)
    ↓
Top-K chunks relevantes de legislación DNIT
    ↓
Prompt enriquecido enviado a Gemma 4 local
    ↓
Respuesta validada por Instructor.js (RespuestaRagSchema)
    ↓
Respuesta con cita de artículo/resolución específica
```

#### Flujo de Búsqueda RAG (AI Playground — Premium):
```
Pregunta del usuario / Duda de clasificación
    ↓
Embedding local de la consulta
    ↓
Búsqueda paralela en AMBOS índices (DNIT + Custom User)
    ↓
Fusión de resultados por score (normalizado 0-1)
    ↓
Top-K chunks fusionados (con fuente indicada: DNIT o CUSTOM)
    ↓
Prompt enriquecido con contexto mixto enviado a Gemma 4
    ↓
Respuesta validada por Instructor.js
```

---

### Capa 4 — Almacenamiento Local

#### OPFS (Origin Private File System)
Propósito: Almacenamiento persistente de archivos grandes
- Modelos ONNX descargados (Florence-2, Gemma 4)
- Índice vectorial DNIT (solo lectura, distribuido por el dev)
- Índice vectorial custom del usuario (solo si tiene Playground activo)
- Imágenes de facturas originales (solo si el usuario activa la opción)

```
/opfs-root/
  /models/          ← modelos ONNX (dev los distribuye, user los descarga)
  /knowledge/
    dnit-index-2025-Q1.json      ← SOLO LECTURA para el usuario
    custom-user-index.json       ← SOLO Playground, creado por el usuario
  /originals/       ← imágenes de facturas (opcional, activado por usuario)
```

**Límite práctico:** ~10GB en Chrome/Edge, sin límite declarado en Firefox

#### IndexedDB
Propósito: Almacenamiento de datos estructurados en el cliente
- Historial de facturas procesadas (texto extraído, JSON resultante)
- Cache de resultados de OCR para evitar reprocesar
- Preferencias de UI y configuraciones locales
- Metadata de documentos custom (nombre, tamaño, chunk count, estado de indexación)

---

### Capa 5 — Infraestructura Cloud (Mínima)

#### Vercel
- **Costo:** $0 (Free Tier)
- **Uso:** Hosting del frontend Next.js, Edge Functions para validación de tokens Kinde
- **Ancho de banda:** 100GB/mes (suficiente para una app local-first)

#### Kinde Auth
- **Costo:** $0 hasta 10.500 usuarios activos/mes
- **Uso:** Registro, login, gestión de sesiones JWT
- **Integración:** `@kinde-oss/kinde-auth-nextjs`

#### Neon PostgreSQL
- **Costo:** $0 (Free Tier: 0.5GB storage, 190hs compute/mes)
- **Uso EXCLUSIVO:** Metadatos no sensibles

```sql
-- Lo que SÍ guardamos en Neon:
usuarios (id, email, plan, created_at)
esquemas (id, user_id, nombre, definicion_json, created_at)
plantillas (id, user_id, nombre, mapeo_columnas_json)
suscripciones (id, user_id, estado, proximo_cobro)

-- Lo que NUNCA guardamos en Neon:
-- • Imágenes de facturas
-- • Datos extraídos de documentos
-- • RUCs o información fiscal del cliente
```

---

## Decisiones de Arquitectura Clave

### ¿Por qué NO usar una API de AI en la nube?

| Criterio | API Cloud (OpenAI/Gemini) | Local (WebGPU) |
|---|---|---|
| Privacidad | ❌ Datos salen del dispositivo | ✅ Todo local |
| Costo variable | ❌ $X por 1000 tokens | ✅ $0 marginal |
| Latencia primera vez | ✅ < 1s | ❌ Descarga de modelos |
| Disponibilidad offline | ❌ Requiere internet | ✅ Funciona sin red |
| Escalabilidad de costo | ❌ Crece con usuarios | ✅ Costo fijo |

**Conclusión:** Para el mercado paraguayo, donde la **privacidad fiscal** es crítica y muchos contadores trabajan en zonas con conectividad intermitente, el modelo local-first es una ventaja competitiva, no una limitación.

### ¿Por qué OPFS y no localStorage?

localStorage tiene un límite de ~5MB, es síncrono y bloquea el hilo principal. OPFS ofrece acceso asíncrono, persistencia real y gigabytes de almacenamiento, permitiendo guardar modelos completos de IA.

### ¿Por qué Next.js y no Vite/SvelteKit?

El ecosistema de Next.js en Vercel ofrece Edge Functions gratuitas para manejar webhooks de pago y callbacks de auth. El App Router permite optimizar el bundle: los componentes de AI solo se hidratan cuando el usuario los activa.

---

## Consideraciones de Seguridad

1. **Content Security Policy (CSP):** Configurar headers estrictos que permitan WebAssembly y WebGPU pero bloqueen scripts externos no controlados.
2. **Validación de JWT:** Cada request a la API de Neon pasa por verificación de token Kinde en Edge Function.
3. **No PII en logs:** Vercel logs configurados para no registrar parámetros de request que puedan contener datos fiscales.
4. **OPFS Sandboxing:** Por diseño del navegador, OPFS está aislado por origen. Un usuario jamás puede acceder a los datos de otro.

---

*TaxLens PY · Arquitectura v1.1 · 2025*
*Cambios v1.1: Agregada Capa 2b (Instructor.js + Zod). RAG actualizado a sistema dual de índices (DNIT read-only + Custom user Playground-only). OPFS documentado con estructura de directorios.*
