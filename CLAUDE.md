# CLAUDE.md — TaxLens PY

> Este archivo es leído automáticamente por Claude Code en cada sesión.
> Contiene el contexto completo del proyecto para que no tengas que repetirlo.

---

## Qué es este proyecto

**TaxLens PY** es un SaaS **local-first** para el mercado tributario paraguayo. Procesa facturas con OCR + IA que corre **en el navegador del usuario** vía WebGPU. Genera archivos para **Marangatu** (DNIT) y permite búsqueda semántica de legislación fiscal — sin servidores de procesamiento, sin que datos fiscales salgan del dispositivo.

**Repositorio:** Next.js 15 (App Router) · TypeScript · Vercel

---

## Stack — no cambiar sin consenso explícito

```
Frontend:    Next.js 15 (App Router) + TypeScript + Tailwind CSS
Hosting:     Vercel (Free Tier)
Auth:        Kinde (@kinde-oss/kinde-auth-nextjs)
DB:          Neon PostgreSQL (Free Tier) + Drizzle ORM
AI Runtime:  Transformers.js v3 (WebGPU en Service Worker)
LLM Output:  Instructor.js (@instructor-ai/instructor) + Zod  ← validación estructurada
OCR:         Florence-2 ONNX (int8, ~270MB)
LLM:         Gemma 4 E2B ONNX (int4, ~2.5GB)
Embeddings:  all-MiniLM-L6-v2 ONNX (25MB)
Vector DB:   Orama (WASM, in-memory desde OPFS)
Storage:     OPFS (modelos + índices) + IndexedDB (datos estructurados)
Excel/CSV:   ExcelJS (100% cliente, sin servidor)
Pagos:       Bancard API / transferencia manual (MVP)
```

---

## Estructura del repositorio

```
/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Rutas protegidas por Kinde
│   │   ├── dashboard/          # Panel principal del usuario
│   │   ├── hub/                # AI Hub — solo modelos e índices del dev
│   │   ├── marangatu/          # Marangatu Generator
│   │   └── playground/         # AI Playground (premium)
│   │       ├── schema/         # Schema Builder
│   │       ├── rules/          # Logic Engine
│   │       ├── templates/      # Template Generator
│   │       └── knowledge/      # Base de conocimiento personalizada ← nuevo
│   ├── (public)/               # Landing, pricing, about
│   ├── api/                    # API Routes mínimas
│   │   ├── auth/[kindeAuth]/   # Handler de Kinde
│   │   ├── esquemas/           # CRUD esquemas del Playground
│   │   ├── suscripciones/      # Estado de suscripción
│   │   └── modelos/            # Registry de modelos (solo lectura, dev-curado)
│   └── layout.tsx              # Root layout + SW registration
│
├── components/
│   ├── ui/                     # Componentes base (Button, Badge, Card...)
│   ├── hub/                    # ModelCard, DownloadProgress, KnowledgeBase
│   ├── marangatu/              # UploadZone, ProcessingPipeline, ReviewTable
│   └── playground/             # SchemaBuilder, LogicEngine, TemplateGenerator
│       └── knowledge/          # DocumentUpload, IndexManager ← nuevo
│
├── lib/
│   ├── db/                     # Drizzle schema + queries
│   │   ├── schema.ts           # Tablas: usuarios, suscripciones, esquemas...
│   │   └── queries.ts          # Queries reutilizables tipadas
│   ├── ai/                     # Wrappers de Transformers.js + Instructor.js
│   │   ├── florence.ts         # OCR pipeline
│   │   ├── gemma.ts            # Clasificación + prompts + Instructor client
│   │   ├── embeddings.ts       # Embeddings para RAG
│   │   └── schemas.ts          # Schemas Zod para validación con Instructor ← nuevo
│   ├── rag/                    # ← nueva carpeta, antes disperso en lib/ai
│   │   ├── dnit.ts             # Búsqueda en índice DNIT (read-only)
│   │   ├── custom.ts           # Búsqueda en índice custom (Playground)
│   │   └── merge.ts            # Fusión de resultados de ambos índices
│   ├── local/                  # Abstracción de storage local
│   │   ├── opfs.ts             # OPFS helpers (read/write modelos e índices)
│   │   └── indexeddb.ts        # IndexedDB helpers (facturas, config, doc metadata)
│   ├── validation/
│   │   ├── ruc.ts              # Validación módulo 11 del RUC
│   │   └── marangatu.ts        # Validación de columnas y cuadres
│   └── excel/
│       └── generator.ts        # ExcelJS — generación de libros Marangatu
│
├── public/
│   └── sw.js                   # Service Worker (Transformers.js runtime)
│
├── drizzle/                    # Migraciones de Drizzle
├── docs/                       # Documentación del proyecto
└── CLAUDE.md                   # Este archivo
```

---

## Reglas de arquitectura — SIEMPRE respetar

### 1. Privacidad por diseño
```
✅ Datos de configuración (esquemas, plantillas) → Neon
✅ Modelos ONNX, índice DNIT → OPFS
✅ Facturas procesadas, RUCs, montos → IndexedDB (local)
✅ Índice custom del usuario → OPFS /knowledge/custom-user-index.json
❌ NUNCA imágenes de facturas a Neon
❌ NUNCA datos fiscales del cliente a ningún servidor
❌ NUNCA llamadas a APIs de AI externas para procesar facturas
```

### 2. Todo output de LLM pasa por Instructor.js + Zod
Ningún JSON producido por Gemma 4 se usa directamente en el pipeline. **Siempre** se valida con el schema Zod correspondiente vía Instructor.js antes de procesarlo.

```typescript
// ✅ CORRECTO — siempre así
const resultado = await clasificarFactura(textoOcr); // devuelve FacturaClasificada validado

// ❌ INCORRECTO — nunca parsear JSON del LLM directamente
const resultado = JSON.parse(await gemma.generate(prompt));
```

Los schemas Zod viven en `lib/ai/schemas.ts`. Si se agrega un nuevo caso de uso que llama al LLM, se debe crear el schema correspondiente antes de escribir la llamada.

### 3. AI Hub es solo lectura para el usuario
El AI Hub solo muestra modelos e índices publicados por el desarrollador. **No hay upload de ningún tipo en el Hub.** La carga de documentos personalizados es exclusiva de `playground/knowledge`.

```typescript
// Regla de oro para el Hub:
// Si el recurso no viene de MODEL_REGISTRY o DNIT_KNOWLEDGE_VERSIONS en Neon → no aparece en el Hub
```

### 4. RAG: dos índices, dos contextos
```typescript
// Marangatu Generator (free): SOLO índice DNIT
const chunks = await searchDnit(query);

// AI Playground (premium): índice DNIT + índice custom fusionados
const chunks = await mergeResults(
  await searchDnit(query),
  await searchCustom(query)
);
```
Nunca usar `searchCustom` en rutas del Marangatu Generator. Nunca usar `searchDnit` sin considerar si el usuario tiene Playground activo y hay índice custom disponible para fusionar.

### 5. AI corre en el cliente
Todo el procesamiento de IA (OCR, clasificación, embeddings, validación Instructor) ocurre en un **Service Worker** con Transformers.js. La UI se comunica con el worker via `postMessage`.

```typescript
// Patrón correcto de comunicación UI ↔ Worker
worker.postMessage({ type: 'PROCESS_INVOICE', payload: { imageData, schema } });
worker.onmessage = ({ data }) => {
  if (data.type === 'PROGRESS') updateProgress(data.progress);
  if (data.type === 'RESULT') handleResult(data.result);
  if (data.type === 'VALIDATION_ERROR') handleRetry(data.attempt, data.zodError);
};
```

### 6. Neon solo para metadatos
Las API Routes de Next.js solo hacen queries a Neon para verificar plan/suscripción, CRUD de esquemas/plantillas del Playground, y registry de modelos. Nunca reciben ni procesan datos de facturas ni documentos del usuario.

### 4. Excel y CSV se generan 100% en el cliente
```typescript
// ExcelJS en el cliente — NUNCA en una API Route
import ExcelJS from 'exceljs';
// Todo en memoria del navegador, descarga directa
```

---

## Schemas de base de datos (Drizzle)

```typescript
// lib/db/schema.ts

import { pgTable, uuid, varchar, text, integer, 
         boolean, date, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  kindeId: varchar('kinde_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  nombre: varchar('nombre', { length: 255 }),
  plan: varchar('plan', { length: 50 }).notNull().default('free'),
  creadoEn: timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
});

export const suscripciones = pgTable('suscripciones', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }),
  estado: varchar('estado', { length: 50 }).notNull().default('trial'),
  // 'trial' | 'activo' | 'vencido' | 'cancelado'
  fechaInicio: date('fecha_inicio').notNull(),
  fechaVencimiento: date('fecha_vencimiento').notNull(),
  montoGs: integer('monto_gs').notNull().default(50000),
  metodoPago: varchar('metodo_pago', { length: 100 }),
  referenciaPago: varchar('referencia_pago', { length: 255 }),
  creadoEn: timestamp('creado_en').defaultNow(),
});

export const esquemasPlayground = pgTable('esquemas_playground', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  version: integer('version').notNull().default(1),
  definicion: jsonb('definicion').notNull(), // Ver 03_DATA_MODELS.md
  activo: boolean('activo').default(true),
  tipo: varchar('tipo', { length: 50 }).default('custom'),
  creadoEn: timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
});

export const plantillasPlayground = pgTable('plantillas_playground', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }),
  esquemaId: uuid('esquema_id').references(() => esquemasPlayground.id, { onDelete: 'set null' }),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  configExcel: jsonb('config_excel').notNull(),
  creadoEn: timestamp('creado_en').defaultNow(),
});
```

---

## Schemas Zod de referencia (Instructor.js)

```typescript
// lib/ai/schemas.ts — referencia rápida

// 1. Output de clasificación de factura (Gemma 4 → Marangatu Generator)
export const FacturaClasificadaSchema = z.object({
  rucEmisor:      z.string().regex(/^\d+-\d{1,2}$/),
  timbrado:       z.string().length(8),
  numeroFactura:  z.string().regex(/^\d{3}-\d{3}-\d{7}$/),
  fechaEmision:   z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  condicionVenta: z.enum(['CONTADO', 'CREDITO']),
  montoTotal:     z.number().positive(),
  gravadas5:      z.number().min(0),
  gravadas10:     z.number().min(0),
  exentas:        z.number().min(0),
  iva5:           z.number().min(0),
  iva10:          z.number().min(0),
  concepto:       z.string().min(1),
  imputaIva:      z.boolean(),
  imputaIre:      z.boolean(),
  imputaIrpRsp:   z.boolean(),
  confianza:      z.number().min(0).max(1),
  dudas:          z.array(z.string()),
}).refine(
  d => Math.abs((d.gravadas5 + d.gravadas10 + d.exentas) - d.montoTotal) < 1,
  { message: 'Cuadre matemático fallido' }
);

// 2. Output RAG de consulta DNIT
export const RespuestaRagSchema = z.object({
  respuesta:       z.string().min(1),
  citasLegales:    z.array(z.object({
    fuente:        z.string(), // "Ley 6380/2019 Art. 14"
    fragmento:     z.string(),
    relevancia:    z.number().min(0).max(1),
  })),
  confianza:       z.number().min(0).max(1),
  requiereRevision: z.boolean(),
});

// 3. Regla del Logic Engine (Playground)
export const ReglaLogicaOutputSchema = z.object({
  camposAfectados: z.array(z.string()),
  valoresAplicados: z.record(z.unknown()),
  reglaActivada:   z.string(),
});
```

```typescript
// types/factura.ts

export interface FacturaProcesada {
  id: string;
  periodo: string;                    // 'YYYY-MM'
  tipoLibro: 'VENTAS' | 'COMPRAS' | 'INGRESOS' | 'EGRESOS';
  
  // Datos OCR — SOLO en IndexedDB local
  rucEmisor: string;                  // '80012345-6'
  nombreEmisor?: string;
  timbrado: string;                   // 8 dígitos
  numeroFactura: string;              // 'XXX-XXX-XXXXXXX'
  fechaEmision: string;               // 'YYYY-MM-DD'
  condicionVenta: 'CONTADO' | 'CREDITO';
  montoTotal: number;
  gravadas5: number;
  gravadas10: number;
  exentas: number;
  iva5: number;
  iva10: number;
  
  // Clasificación IA
  imputaIva: boolean;
  imputaIre: boolean;
  imputaIrpRsp: boolean;
  concepto: string;
  categoriaDnit?: string;
  
  // Metadata
  confianzaOcr: number;               // 0.0 - 1.0
  revisadoManualmente: boolean;
  advertencias: string[];
  estado: 'PROCESADO' | 'REVISION_PENDIENTE' | 'ERROR' | 'EXPORTADO';
  creadoEn: string;
  actualizadoEn: string;
}

export interface CampoEsquema {
  id: string;
  nombre: string;
  tipo: 'TEXTO' | 'NUMERO' | 'MONTO_PYG' | 'FECHA' | 'RUC' | 'TIMBRADO' | 'SELECCION' | 'BOOLEANO';
  requerido: boolean;
  orden: number;
  opciones?: string[];                // Para tipo SELECCION
  default?: unknown;
}

export interface ReglaLogica {
  id: string;
  nombre: string;
  condicion: {
    campo: string;
    operador: 'CONTIENE' | 'IGUAL_A' | 'MAYOR_QUE' | 'MENOR_QUE' | 'ES_NULO';
    valor: unknown;
  };
  accion: {
    campo: string;
    valor: unknown;
  };
}
```

---

## Validación de RUC paraguayo

```typescript
// lib/validation/ruc.ts

/**
 * Valida el dígito verificador de un RUC paraguayo usando módulo 11.
 * Formato esperado: "XXXXXXXX-D" o "XXXXXXXX-DD"
 */
export function validarRUC(ruc: string): { valido: boolean; error?: string } {
  const limpio = ruc.replace(/[\s.-]/g, '');
  const match = limpio.match(/^(\d+)-?(\d{1,2})$/);
  
  if (!match) return { valido: false, error: 'Formato inválido. Esperado: XXXXXXXX-D' };
  
  const [, numero, digitoStr] = match;
  const digito = parseInt(digitoStr, 10);
  
  // Algoritmo módulo 11
  const digits = numero.split('').reverse().map(Number);
  const sum = digits.reduce((acc, d, i) => acc + d * (2 + (i % 7)), 0);
  const resto = sum % 11;
  const calculado = resto < 2 ? 0 : 11 - resto;
  
  if (calculado !== digito) {
    return { 
      valido: false, 
      error: `Dígito verificador inválido. Calculado: ${calculado}, recibido: ${digito}` 
    };
  }
  
  return { valido: true };
}

/**
 * Formatea un RUC a su forma canónica: XXXXXXXX-D
 */
export function formatearRUC(ruc: string): string {
  const limpio = ruc.replace(/[\s.-]/g, '');
  const match = limpio.match(/^(\d+)(\d{1,2})$/);
  if (!match) return ruc;
  return `${match[1]}-${match[2]}`;
}
```

---

## Prompts de Gemma 4 para clasificación

```typescript
// lib/ai/prompts.ts

export const PROMPT_CLASIFICAR_COMPRA = (textoOcr: string) => `
Eres un experto en tributación paraguaya. Analiza el siguiente texto extraído de una factura de compra y devuelve ÚNICAMENTE un JSON válido sin markdown.

Texto de la factura:
${textoOcr}

Devuelve este JSON exacto:
{
  "rucEmisor": "string (formato XXXXXXXX-D)",
  "timbrado": "string (8 dígitos)",
  "numeroFactura": "string (formato XXX-XXX-XXXXXXX)",
  "fechaEmision": "string (DD/MM/YYYY)",
  "condicionVenta": "CONTADO o CREDITO",
  "montoTotal": number,
  "gravadas5": number,
  "gravadas10": number,
  "exentas": number,
  "iva5": number,
  "iva10": number,
  "concepto": "string (descripción del bien/servicio)",
  "imputaIva": boolean,
  "imputaIre": boolean,
  "imputaIrpRsp": boolean,
  "confianza": number (0.0 a 1.0),
  "dudas": ["lista de campos con baja confianza"]
}

Reglas de imputación:
- imputaIva: true si es un gasto con IVA deducible para el contribuyente IVA
- imputaIre: true si es un gasto deducible para el IRE
- imputaIrpRsp: true si es un gasto deducible para el IRP-RSP
- Si el concepto contiene "software", "licencia", "suscripción": imputaIre=true, imputaIva=false generalmente
- Si hay ambigüedad, marcá confianza < 0.75 y agregá el campo a "dudas"
`;

export const PROMPT_CONSULTAR_DNIT = (query: string, chunks: string[]) => `
Eres un experto en la legislación tributaria paraguaya de la DNIT.
Responde la siguiente consulta basándote ÚNICAMENTE en los fragmentos de legislación provistos.

Consulta: ${query}

Legislación relevante:
${chunks.map((c, i) => `[${i + 1}] ${c}`).join('\n\n')}

Responde de forma concisa y cita el número de artículo o resolución específica cuando sea posible.
`;
```

---

## Gate de suscripción — middleware

```typescript
// lib/auth/subscription.ts

import { db } from '@/lib/db';
import { suscripciones } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function tieneAccesoPlayground(usuarioId: string): Promise<boolean> {
  const hoy = new Date().toISOString().split('T')[0];
  
  const resultado = await db
    .select()
    .from(suscripciones)
    .where(
      and(
        eq(suscripciones.usuarioId, usuarioId),
        eq(suscripciones.estado, 'activo'),
        gte(suscripciones.fechaVencimiento, hoy)
      )
    )
    .limit(1);
  
  return resultado.length > 0;
}
```

---

## Convenciones de código

### Nombrado
- **Archivos:** kebab-case (`invoice-processor.ts`, `ruc-validator.ts`)
- **Componentes React:** PascalCase (`ModelCard.tsx`, `ReviewTable.tsx`)
- **Variables/funciones:** camelCase en inglés (`processInvoice`, `validateRUC`)
- **Constantes globales:** SCREAMING_SNAKE_CASE (`MAX_BATCH_SIZE`, `OPFS_MODELS_DIR`)
- **Tipos/Interfaces:** PascalCase (`FacturaProcesada`, `CampoEsquema`)
- **UI copy:** siempre en español (voseo rioplatense paraguayo)

### Comentarios
- Comentarios en español para lógica de negocio tributaria
- Comentarios en inglés para lógica técnica general
- Todo lo relacionado con validaciones DNIT debe tener referencia al artículo de ley

```typescript
// Algoritmo módulo 11 — requerido por DNIT para validar RUC (Ley 6380/2019, Art. 35)
// Module 11 algorithm — required by DNIT to validate RUC numbers
```

### Manejo de errores
- Errores de negocio (RUC inválido, timbrado vencido): mensajes en español, accionables
- Errores técnicos (OPFS no disponible, WebGPU no soportado): mensajes claros con fallback

```typescript
// Patrón de error tipado
type ResultadoProcesamiento = 
  | { ok: true; datos: FacturaProcesada }
  | { ok: false; error: string; codigo: 'RUC_INVALIDO' | 'ILEGIBLE' | 'CUADRE_INCORRECTO' };
```

### Server vs Client Components
```typescript
// API Routes: SOLO verificación de auth + queries a Neon
// NUNCA procesamiento de datos de facturas en el servidor

// Componentes con 'use client': todo lo que usa hooks, OPFS, IndexedDB, WebGPU
// Componentes sin directiva: layouts, páginas estáticas, wrappers de auth
```

---

## Comandos frecuentes

```bash
# Desarrollo
npm run dev

# Generar migración de Drizzle
npm run db:generate

# Aplicar migración
npm run db:migrate

# Abrir Drizzle Studio
npm run db:studio

# Build
npm run build

# Type check
npm run type-check
```

---

## Variables de entorno requeridas

```env
# .env.local

# Kinde Auth
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# Neon DB
DATABASE_URL=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Comportamientos esperados de Claude Code

### Al escribir código nuevo:
1. Verificar que no hay datos fiscales fluyendo a APIs o servidores
2. Si es lógica de AI, va en el Service Worker (`public/sw.js`) o en helpers de `lib/ai/`
3. Si es storage, usar las abstracciones en `lib/local/` (no acceder OPFS/IndexedDB directamente en componentes)
4. Si es una query a Neon, usar Drizzle con tipos; nunca SQL raw en API Routes

### Al debuggear:
- Los errores de WebGPU son silenciosos en algunos navegadores; siempre verificar soporte primero
- IndexedDB es asíncrono; nunca bloquear el hilo principal esperando lecturas
- OPFS requiere que el código corra en un contexto secure (HTTPS o localhost)
- Transformers.js en Service Worker: la primera carga del modelo puede tardar 30-90s; siempre dar feedback visual
- **Instructor.js**: si los 3 reintentos fallan, revisar el prompt — el error Zod se loguea en IndexedDB en la tabla `errores_validacion` con el JSON parcial y el ZodError serializado. Esto permite diagnosticar qué campo está generando el modelo incorrectamente
- El índice custom de OPFS puede corromperse si la pestaña se cierra durante la indexación; `lib/local/opfs.ts` debe verificar integridad con un checksum al cargar

### Al refactorizar:
- Mantener la separación local/cloud sin excepciones
- No agregar dependencias de servidor sin justificación explícita
- Cualquier nueva feature del Playground requiere verificación de `tieneAccesoPlayground()`

---

## Documentación de referencia del proyecto

```
docs/
  00_PROJECT_OVERVIEW.md   — visión, módulos, stack resumido
  01_ARCHITECTURE.md       — diagramas, capas, decisiones técnicas
  02_MODULES.md            — pipelines detallados, columnas Marangatu, pseudo-código
  03_DATA_MODELS.md        — schemas SQL completos, IndexedDB interfaces
  04_ROADMAP.md            — sprints, estimaciones, riesgos, KPIs
  05_BRANDING.md           — paleta, tipografía, tono, componentes UI
  06_BUSINESS_MODEL.md     — precios, proyecciones, competencia
```

---

*TaxLens PY · CLAUDE.md v1.0 · Leer este archivo antes de cada sesión de desarrollo*
