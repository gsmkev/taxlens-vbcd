# 02 — Especificación Funcional de Módulos: TaxLens PY

---

## Módulo 0 — Onboarding & Dashboard Principal

### Objetivo
Guiar al usuario nuevo desde el registro hasta su primera factura procesada en menos de 10 minutos.

### Flujo de Onboarding
```
Registro (Kinde)
    ↓
Detección de capacidades del dispositivo
    (WebGPU? OPFS? Memoria disponible?)
    ↓
Recomendación de modelos según hardware
    ↓
Descarga del primer modelo (Florence-2 mínimo)
    ↓
Tutorial interactivo: procesar 1 factura de ejemplo
    ↓
Dashboard listo
```

### Dashboard Principal
Componentes:
- **Estado de Modelos:** Chips visuales indicando qué modelos están descargados y listos
- **Resumen del Período:** Totales de IVA Compras / IVA Ventas del mes en curso
- **Acceso Rápido:** Botones directos a Marangatu Generator y AI Playground
- **Capacidad OPFS:** Barra de uso del almacenamiento local
- **Noticias DNIT:** Feed simple de últimas resoluciones (scrapeadas semanalmente, sin tracker)

---

## Módulo 1 — AI Hub (Centro de Recursos)

### 1.1 Gestor de Modelos

**Propósito:** Permitir al usuario controlar qué modelos de IA tiene instalados.

**Modelos disponibles para descarga:**

| Modelo | Tamaño | Capacidad | Hardware Mínimo |
|---|---|---|---|
| Florence-2 Tiny | 80MB | OCR básico | CPU (cualquiera) |
| Florence-2 Base | 270MB | OCR preciso | CPU moderno o GPU |
| Gemma 4 250M | 450MB | Clasificación simple | CPU moderno |
| Gemma 4 E2B int4 | ~2.5GB | Análisis completo | WebGPU, 4GB VRAM |
| Embeddings (MiniLM) | 25MB | RAG / Búsqueda | CPU (requerido) |

**Estados de un modelo:**
- `NO_DESCARGADO` — Botón "Descargar"
- `DESCARGANDO` — Barra de progreso con velocidad y ETA
- `DISPONIBLE` — Chip verde "Listo"
- `ACTIVO` — Chip azul "En uso"
- `ACTUALIZACIÓN_DISPONIBLE` — Botón "Actualizar"

**Lógica de descarga:**
```javascript
// Pseudo-código del flujo
const downloadModel = async (modelId) => {
  const url = MODEL_REGISTRY[modelId].url; // Google Drive / HuggingFace
  const stream = await fetch(url);
  const opfsRoot = await navigator.storage.getDirectory();
  const fileHandle = await opfsRoot.getFileHandle(`${modelId}.onnx`, { create: true });
  const writable = await fileHandle.createWritable();
  // Stream chunks con reporte de progreso al UI
  await stream.body.pipeTo(writable);
};
```

### 1.2 Base de Conocimiento DNIT

**Propósito:** Permitir al usuario descargar y actualizar el índice vectorial de legislación tributaria paraguaya. **Este índice es curado, validado y publicado exclusivamente por el desarrollador.** Los usuarios no pueden modificarlo ni agregar documentos propios aquí.

**Contenido del Knowledge Base DNIT v1.0:**
- Ley 6380/2019 (Modernización y Simplificación del Sistema Tributario)
- Decreto 3107/2019 (Reglamentación del IVA)
- Decreto 3182/2019 (Reglamentación del IRE)
- Decreto 3184/2019 (Reglamentación del IRP-RSP)
- Resoluciones DNIT 2020-2024 (clasificación de bienes y servicios)
- Guías de uso de Marangatu (versión vigente)

**Proceso de actualización:** El desarrollador regenera el índice cuando salen nuevas resoluciones, lo valida manualmente y publica la nueva versión en Google Drive. El usuario recibe una notificación en el AI Hub y puede actualizar con un clic.

**Política de contenido del AI Hub:**
> El AI Hub es un canal de distribución controlado. Solo aparecen modelos e índices que el desarrollador ha probado, validado y firmado con hash SHA-256. Los usuarios no pueden subir ni modificar nada en este módulo. Esto garantiza que todos los recursos del Hub sean seguros, correctos y consistentes entre usuarios.

---

## Módulo 2 — Marangatu Generator (GRATUITO)

### 2.1 Descripción General

Módulo especializado en generar los archivos de adjunto para la declaración jurada en Marangatu. Soporta los cuatro tipos de libro:

1. **Libro de Ventas** (IVA)
2. **Libro de Compras** (IVA)
3. **Libro de Ingresos** (IRE / IRP-RSP)
4. **Libro de Egresos** (IRE / IRP-RSP)

### 2.2 Pipeline de Procesamiento

```
┌─────────────────────────────────────────────────────────────────┐
│  ENTRADA                                                         │
│  • Fotos de facturas (JPG/PNG/HEIC)                             │
│  • Máximo recomendado: 200 facturas por sesión                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: PRE-PROCESAMIENTO DE IMAGEN                            │
│  • Redimensionado a 1024px max (para velocidad)                 │
│  • Corrección de perspectiva (deskew básico)                    │
│  • Normalización de brillo/contraste                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: OCR con Florence-2                                     │
│  • Detección de regiones de texto                               │
│  • Extracción de: RUC, Timbrado, Fecha, Monto Total,           │
│    IVA 5%, IVA 10%, Exentas, Concepto                          │
│  • Confianza score por campo (umbral: 0.85)                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: CLASIFICACIÓN con Gemma 4 + Instructor.js              │
│  • Determina tipo de gasto/ingreso                              │
│  • Imputa a: IVA / IRE / IRP-RSP                               │
│  • Identifica si es deducible                                   │
│  • Consulta RAG si hay ambigüedad (ej: concepto "servicios")   │
│  • Output validado con Instructor.js contra schema Zod          │
│    → Si el JSON es inválido: reintento automático con corrección│
│    → Máximo 3 intentos antes de marcar REVISIÓN_PENDIENTE      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4: VALIDACIÓN                                             │
│  • Formato de RUC (ej: 80012345-6)                             │
│  • Dígito verificador del RUC (algoritmo módulo 11)             │
│  • Vigencia del timbrado (consulta local de lista negra)        │
│  • Cuadre matemático: Gravadas + Exentas = Total Factura        │
│  • Alerta si monto > ₲ 5.000.000 (requiere transferencia)      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 5: REVISIÓN MANUAL (UI)                                   │
│  • Tabla editable con todos los campos extraídos                │
│  • Campos con baja confianza resaltados en amarillo             │
│  • Campos con error resaltados en rojo                          │
│  • El usuario puede corregir inline                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  SALIDA                                                         │
│  • CSV con formato exacto de Marangatu                          │
│  • Excel con formato de previsualización humana                 │
│  • Reporte de anomalías detectadas (PDF simple)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Columnas de Salida (Libro de Compras)

Alineadas con el formato oficial de Marangatu:

| # | Columna | Fuente | Validación |
|---|---|---|---|
| 1 | CÓDIGO TIPO REGISTRO | Constante "CM" | — |
| 2 | RUC EMISOR | OCR | Módulo 11 |
| 3 | NOMBRE/RAZÓN SOCIAL | OCR + DNIT RAG | — |
| 4 | TIMBRADO | OCR | 8 dígitos |
| 5 | NÚMERO FACTURA | OCR | Formato XXX-XXX-XXXXXXX |
| 6 | FECHA EMISIÓN | OCR | DD/MM/YYYY |
| 7 | CONDICIÓN VENTA | OCR/Inferencia | Contado/Crédito |
| 8 | MONTO TOTAL | OCR | Suma cuadre |
| 9 | IVA 5% INCLUIDO | OCR/Cálculo | Auto-calculable |
| 10 | IVA 10% INCLUIDO | OCR/Cálculo | Auto-calculable |
| 11 | MONTO EXENTO | OCR | Suma cuadre |
| 12 | IMPUTA AL IVA | Gemma 4 + Instructor.js | S/N |
| 13 | IMPUTA AL IRE | Gemma 4 + Instructor.js | S/N |
| 14 | IMPUTA AL IRP-RSP | Gemma 4 + Instructor.js | S/N |

### 2.4 Gestión de Errores Frecuentes

- **Factura ilegible:** El sistema informa al usuario y la coloca al final con flag `REQUIERE_REVISIÓN_MANUAL`
- **RUC inválido:** Alerta pero permite continuar (puede ser error del proveedor)
- **Timbrado vencido:** Marca como `TIMBRADO_VENCIDO` en el reporte (la factura puede aún ser válida)
- **Conceptos ambiguos:** El RAG ofrece hasta 3 sugerencias de clasificación con cita legal
- **JSON inválido de Gemma 4:** Instructor.js captura el error de validación Zod, construye un prompt de corrección con el error específico y reintenta hasta 3 veces. Si los 3 intentos fallan, la factura queda en `REVISIÓN_PENDIENTE` con el error registrado.

---

## Módulo 3 — AI Playground (PREMIUM — ₲ 50.000/mes)

### 3.1 Schema Builder

**Propósito:** Permitir al usuario definir estructuras de datos personalizadas sin código.

**Tipos de campo disponibles:**
- `TEXTO` — Cadena libre
- `NÚMERO` — Entero o decimal con validación de rango
- `MONTO_PYG` — Número con separador de miles guaraníes
- `FECHA` — Con selector de formato
- `RUC` — Con validación automática de dígito verificador
- `TIMBRADO` — 8 dígitos
- `SELECCIÓN` — Lista desplegable de valores predefinidos
- `BOOLEANO` — Sí/No

**Ejemplo de esquema guardado:**
```json
{
  "nombre": "Gastos de Viaje Corporativos",
  "version": "1.0",
  "campos": [
    { "id": "f1", "nombre": "Fecha", "tipo": "FECHA", "requerido": true },
    { "id": "f2", "nombre": "Destino", "tipo": "TEXTO", "requerido": true },
    { "id": "f3", "nombre": "Monto Viáticos", "tipo": "MONTO_PYG" },
    { "id": "f4", "nombre": "RUC Hotel", "tipo": "RUC" },
    { "id": "f5", "nombre": "Es Deducible IRE", "tipo": "BOOLEANO", "default": true }
  ]
}
```

### 3.2 Logic Engine

**Propósito:** Reglas de clasificación automática sin código.

**Sintaxis de reglas (interfaz visual, lógica JSON):**
```json
{
  "reglas": [
    {
      "nombre": "Software es IRE no IVA",
      "condicion": "concepto CONTIENE 'software' O concepto CONTIENE 'licencia'",
      "accion": "SET imputa_ire = true, SET imputa_iva = false"
    },
    {
      "nombre": "Alimentos exentos",
      "condicion": "categoria_dnit IGUAL_A 'ALIMENTOS_BASICOS'",
      "accion": "SET tasa_iva = 0, SET monto_exento = monto_total"
    }
  ]
}
```

El Logic Engine se ejecuta **después** de la clasificación de Gemma 4 (ya validada por Instructor.js), permitiendo sobrescribir las inferencias del modelo con reglas de negocio específicas del usuario. Las reglas también producen JSON que pasa por validación Zod antes de aplicarse.

### 3.3 Template Generator

**Propósito:** Generar plantillas de Excel personalizadas basadas en el esquema del usuario.

**Características:**
- Columnas auto-generadas desde el Schema Builder
- Fórmulas de totales automáticas (SUM, subtotales por categoría)
- Formato condicional (resaltar montos > umbral definido por usuario)
- Hoja de resumen ejecutivo auto-generada
- Exportación directa desde el navegador (sin servidor)

**Implementación:**
```javascript
// ExcelJS corriendo en el cliente
import ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('Datos');

// Columnas dinámicas desde el esquema
sheet.columns = schema.campos.map(campo => ({
  header: campo.nombre,
  key: campo.id,
  width: 20,
  style: getStyleForType(campo.tipo)
}));

// Aplicar datos extraídos por AI
sheet.addRows(datosExtraidos);

// Descargar en el navegador
const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
saveAs(blob, `${schema.nombre}_${periodo}.xlsx`);
```

### 3.4 Base de Conocimiento Personalizada

**Propósito:** El usuario puede subir sus propios documentos (contratos marco, manuales internos, listados de proveedores recurrentes) para enriquecer el contexto de análisis del RAG. Esta funcionalidad es **exclusiva del AI Playground** porque requiere procesamiento persistente de documentos privados que va más allá del uso básico del Marangatu Generator.

**Tipos de archivo soportados:** PDF, DOCX, TXT

**Límites por plan:**
- Trial (7 días): hasta 5 documentos / 10MB
- Playground activo: hasta 20 documentos / 50MB

**Flujo completo:**
```
Usuario sube PDF/DOCX/TXT (desde playground/knowledge)
    ↓
Validación de tipo y tamaño en cliente
    ↓
Chunking en el cliente (500 tokens / chunk, overlap 50 tokens)
    ↓
Embeddings locales (all-MiniLM-L6-v2 cargado en memoria)
    ↓
Almacenamiento en OPFS /knowledge/custom-user-index.json
    (índice SEPARADO del índice DNIT — nunca se mezclan en disco)
    ↓
Metadata del documento → IndexedDB (nombre, fecha, chunk count)
    ↓
En consultas RAG: ambos índices se buscan en paralelo y los
resultados se fusionan por score antes de enviarse a Gemma 4
```

**Separación de índices:**
```
OPFS /knowledge/
  dnit-index-2025-Q1.json      ← Solo dev puede modificar (solo lectura)
  custom-user-index.json       ← Solo usuario puede modificar (Playground)
```

El RAG del **Marangatu Generator (free)** consulta únicamente el índice DNIT. El RAG del **AI Playground** fusiona ambos índices para dar contexto enriquecido con la realidad del negocio del usuario.

**UI del gestor de documentos (dentro de `/playground/knowledge`):**
- Lista de documentos subidos con nombre, tamaño, fecha y cantidad de chunks generados
- Botón de eliminación por documento (libera espacio en OPFS)
- Indicador de uso: `X MB / 50 MB`
- Estado de indexación: `INDEXANDO` → `LISTO` → `ERROR`

### 3.5 Gestión de Suscripción

**Acceso:**
- El módulo completo está bloqueado para usuarios sin suscripción activa
- Se muestra un preview del Schema Builder con datos ficticios y un CTA de suscripción
- Al suscribirse: unlock inmediato sin necesidad de recargar la página

**Estado de la suscripción (guardado en Neon):**
```
estado: 'activo' | 'vencido' | 'cancelado' | 'trial_7_dias'
```

**Trial gratuito:** 7 días sin tarjeta requerida al registrarse.

---

*TaxLens PY · Especificación de Módulos v1.1 · 2025*
*Cambios v1.1: AI Hub es solo lectura (dev-curado). Carga de documentos propios movida a AI Playground (sección 3.4). Instructor.js agregado al pipeline de validación de LLM output.*
