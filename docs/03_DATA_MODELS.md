# 03 — Modelos de Datos: TaxLens PY

## Principio de Privacidad en el Diseño

**Regla de oro:** Si el dato puede identificar al contribuyente o a su actividad fiscal, NO va a Neon. Va a OPFS local o IndexedDB del usuario.

Este documento separa explícitamente los datos que residen en la nube vs. los que residen en el dispositivo del usuario.

---

## Sección A — Base de Datos Cloud (Neon PostgreSQL)

Solo metadatos operativos, configuraciones y estados de suscripción.

### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kinde_id      VARCHAR(255) UNIQUE NOT NULL,  -- ID del proveedor de auth
  email         VARCHAR(255) UNIQUE NOT NULL,
  nombre        VARCHAR(255),
  plan          VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free' | 'playground'
  dispositivos  INTEGER DEFAULT 1,              -- Para futuro multi-device
  creado_en     TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_kinde_id ON usuarios(kinde_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

**Notas:**
- `kinde_id` es el identificador del usuario en Kinde Auth
- No se almacena: nombre completo de la empresa, RUC propio, ni ningún dato fiscal

---

### Tabla: `suscripciones`

```sql
CREATE TABLE suscripciones (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id         UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  estado             VARCHAR(50) NOT NULL DEFAULT 'trial',
  -- 'trial' | 'activo' | 'vencido' | 'cancelado'
  fecha_inicio       DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento  DATE NOT NULL,
  monto_gs           INTEGER NOT NULL DEFAULT 50000,
  metodo_pago        VARCHAR(100), -- 'bancard' | 'transferencia' | null
  referencia_pago    VARCHAR(255), -- ID de transacción Bancard u otro
  notas              TEXT,        -- Para pagos manuales verificados por el admin
  creado_en          TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suscripciones_usuario ON suscripciones(usuario_id);
CREATE INDEX idx_suscripciones_estado ON suscripciones(estado);
CREATE INDEX idx_suscripciones_vencimiento ON suscripciones(fecha_vencimiento);
```

**Lógica de validación de acceso:**
```sql
-- Query para verificar si el usuario tiene acceso al Playground
SELECT EXISTS (
  SELECT 1 FROM suscripciones
  WHERE usuario_id = $1
    AND estado = 'activo'
    AND fecha_vencimiento >= CURRENT_DATE
) AS tiene_acceso;
```

---

### Tabla: `esquemas_playground`

```sql
CREATE TABLE esquemas_playground (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre          VARCHAR(255) NOT NULL,
  descripcion     TEXT,
  version         INTEGER NOT NULL DEFAULT 1,
  definicion      JSONB NOT NULL,  -- El esquema de campos completo
  activo          BOOLEAN DEFAULT TRUE,
  tipo            VARCHAR(50) DEFAULT 'custom',
  -- 'custom' | 'marangatu_ventas' | 'marangatu_compras' | 'ire' | 'irp_rsp'
  creado_en       TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_esquemas_usuario ON esquemas_playground(usuario_id);
CREATE INDEX idx_esquemas_activo ON esquemas_playground(activo);
```

**Ejemplo de `definicion` JSONB:**
```json
{
  "version": "1.0",
  "campos": [
    {
      "id": "f_fecha",
      "nombre": "Fecha de Emisión",
      "tipo": "FECHA",
      "formato": "DD/MM/YYYY",
      "requerido": true,
      "orden": 1
    },
    {
      "id": "f_ruc",
      "nombre": "RUC Emisor",
      "tipo": "RUC",
      "requerido": true,
      "orden": 2
    },
    {
      "id": "f_monto",
      "nombre": "Monto Total",
      "tipo": "MONTO_PYG",
      "requerido": true,
      "orden": 3
    },
    {
      "id": "f_imputa",
      "nombre": "Imputa a",
      "tipo": "SELECCIÓN",
      "opciones": ["IVA", "IRE", "IRP-RSP", "Ninguno"],
      "requerido": true,
      "orden": 4
    }
  ],
  "reglas": [
    {
      "id": "r1",
      "nombre": "Software a IRE",
      "condicion": {
        "campo": "concepto",
        "operador": "CONTIENE",
        "valor": "software"
      },
      "accion": {
        "campo": "f_imputa",
        "valor": "IRE"
      }
    }
  ]
}
```

---

### Tabla: `plantillas_playground`

```sql
CREATE TABLE plantillas_playground (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  esquema_id      UUID REFERENCES esquemas_playground(id) ON DELETE SET NULL,
  nombre          VARCHAR(255) NOT NULL,
  config_excel    JSONB NOT NULL,  -- Configuración de columnas, colores, fórmulas
  creado_en       TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Tabla: `modelos_registry` (solo lectura para usuarios)

```sql
CREATE TABLE modelos_registry (
  id              VARCHAR(100) PRIMARY KEY,  -- 'florence2-base', 'gemma4-e2b-int4'
  nombre          VARCHAR(255) NOT NULL,
  descripcion     TEXT,
  version         VARCHAR(50) NOT NULL,
  url_descarga    TEXT NOT NULL,             -- Google Drive / HuggingFace
  tamano_bytes    BIGINT NOT NULL,
  hash_sha256     VARCHAR(64) NOT NULL,      -- Para verificar integridad
  hardware_minimo VARCHAR(100),
  tipo            VARCHAR(50),               -- 'ocr' | 'llm' | 'embedding'
  activo          BOOLEAN DEFAULT TRUE,
  creado_en       TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Tabla: `dnit_knowledge_versions`

```sql
CREATE TABLE dnit_knowledge_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version         VARCHAR(50) NOT NULL,     -- '2025-Q1', '2025-Q2', etc.
  descripcion     TEXT,
  url_indice      TEXT NOT NULL,             -- Google Drive
  tamano_bytes    BIGINT NOT NULL,
  hash_sha256     VARCHAR(64) NOT NULL,
  leyes_incluidas TEXT[],                    -- Array de leyes/resoluciones incluidas
  es_actual       BOOLEAN DEFAULT FALSE,
  publicado_en    DATE NOT NULL,
  creado_en       TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Sección B — Almacenamiento Local del Usuario (OPFS + IndexedDB)

### B.1 OPFS — Archivos Grandes

```
/opfs-root/
  /models/
    florence2-tiny.onnx          # 80MB
    florence2-base.onnx          # 270MB
    gemma4-e2b-int4.onnx        # 2.5GB
    all-minilm-l6-v2.onnx       # 25MB
  /knowledge/
    dnit-index-2025-Q1.json     # 15-30MB (vectores DNIT)
    custom-user-index.json       # Variable (documentos propios)
  /originals/                    # Solo si el usuario activa "guardar originales"
    2025-06/
      factura_001.jpg
      factura_002.jpg
```

### B.2 IndexedDB — Datos Estructurados del Cliente

**Base de datos:** `taxlens_local` (versión 1)

#### Object Store: `facturas_procesadas`

```typescript
interface FacturaProcesada {
  id: string;                      // UUID generado localmente
  periodo: string;                 // '2025-06'
  tipo_libro: 'VENTAS' | 'COMPRAS' | 'INGRESOS' | 'EGRESOS';
  
  // Datos extraídos por OCR (NO se sincronizan a la nube)
  ruc_emisor: string;
  nombre_emisor?: string;
  timbrado: string;
  numero_factura: string;
  fecha_emision: string;           // ISO 8601
  condicion_venta: 'CONTADO' | 'CREDITO';
  monto_total: number;
  gravadas_5: number;
  gravadas_10: number;
  exentas: number;
  iva_5: number;
  iva_10: number;
  
  // Clasificación por AI
  imputa_iva: boolean;
  imputa_ire: boolean;
  imputa_irp_rsp: boolean;
  concepto: string;
  categoria_dnit?: string;
  
  // Metadata de procesamiento
  confianza_ocr: number;           // 0.0 - 1.0
  revisado_manualmente: boolean;
  advertencias: string[];
  
  // Estado
  estado: 'PROCESADO' | 'REVISIÓN_PENDIENTE' | 'ERROR' | 'EXPORTADO';
  creado_en: string;               // ISO 8601
  actualizado_en: string;
}
```

#### Object Store: `sesiones_procesamiento`

```typescript
interface SesionProcesamiento {
  id: string;
  nombre?: string;                  // Ej: "Compras Junio 2025"
  tipo_libro: string;
  total_facturas: number;
  facturas_procesadas: number;
  facturas_con_error: number;
  estado: 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  ids_facturas: string[];           // Referencias a facturas_procesadas
  creado_en: string;
  completado_en?: string;
}
```

#### Object Store: `config_local`

```typescript
interface ConfigLocal {
  key: string;                      // Clave única
  value: any;                       // Valor de configuración
  actualizado_en: string;
}

// Entradas predefinidas:
// 'hardware_profile': { webgpu: boolean, vram_gb: number, cpu_cores: number }
// 'modelos_instalados': string[]   // IDs de modelos en OPFS
// 'ui_preferences': { tema: 'light'|'dark', idioma: 'es' }
// 'periodo_activo': '2025-06'
```

---

## Sección C — Flujos de Datos

### C.1 Flujo de Autenticación
```
[Usuario] → Kinde (OAuth) → JWT Token → Vercel Edge Function
                                              ↓
                                     Verificar token válido
                                              ↓
                                     Query Neon (plan, suscripción)
                                              ↓
                                     Response al cliente con permisos
```

### C.2 Flujo de Sincronización de Esquemas
```
[Usuario crea esquema en Playground]
    ↓
Guardado inmediato en IndexedDB (optimistic update)
    ↓
API Route Next.js recibe esquema sanitizado (sin datos fiscales)
    ↓
Verificación JWT + plan activo
    ↓
UPSERT en Neon esquemas_playground
    ↓
Confirmación al cliente
```

### C.3 Flujo de Generación de Excel (100% Local)
```
[Facturas en IndexedDB]
    ↓
Aplicar reglas del Logic Engine (en memoria)
    ↓
Aplicar esquema de plantilla (desde Neon o IndexedDB)
    ↓
ExcelJS genera workbook en memoria
    ↓
Buffer → Blob → FileSaver.js → Descarga en navegador
[NINGÚN DATO SALE DEL DISPOSITIVO]
```

---

## Sección D — Estimaciones de Almacenamiento

### Por usuario promedio (Neon):
| Tabla | Registros estimados/año | Tamaño estimado |
|---|---|---|
| usuarios | 1 | ~200 bytes |
| suscripciones | 12 | ~2KB |
| esquemas_playground | 5-20 | ~50KB |
| plantillas_playground | 3-10 | ~20KB |
| **TOTAL POR USUARIO** | — | **~75KB/año** |

**Capacidad Neon Free:** 500MB → Soporta aproximadamente **6.600 usuarios activos** antes de necesitar upgrade.

### Por usuario promedio (OPFS/IndexedDB):
| Dato | Tamaño estimado |
|---|---|
| Modelos descargados | 300MB - 3GB |
| Índice DNIT | ~25MB |
| Facturas procesadas (100/mes) | ~5MB/año (solo JSON) |
| Imágenes originales (opcional) | ~50MB/mes |

---

*TaxLens PY · Modelos de Datos v1.0 · 2025*
