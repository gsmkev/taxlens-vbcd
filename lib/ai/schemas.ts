import { z } from 'zod';

// 1. Output de clasificación de factura (Gemma 4 → Marangatu Generator)
export const FacturaClasificadaSchema = z.object({
  rucEmisor: z.string().regex(/^\d+-\d{1,2}$/, 'Formato RUC inválido (esperado: XXXXXXXX-D)'),
  timbrado: z.string().length(8, 'Timbrado debe tener exactamente 8 dígitos'),
  numeroFactura: z.string().regex(/^\d{3}-\d{3}-\d{7}$/, 'Formato factura inválido (esperado: XXX-XXX-XXXXXXX)'),
  fechaEmision: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato fecha inválido (esperado: DD/MM/YYYY)'),
  condicionVenta: z.enum(['CONTADO', 'CREDITO']),
  montoTotal: z.number().positive('Monto total debe ser positivo'),
  gravadas5: z.number().min(0),
  gravadas10: z.number().min(0),
  exentas: z.number().min(0),
  iva5: z.number().min(0),
  iva10: z.number().min(0),
  concepto: z.string().min(1, 'Concepto no puede estar vacío'),
  imputaIva: z.boolean(),
  imputaIre: z.boolean(),
  imputaIrpRsp: z.boolean(),
  confianza: z.number().min(0).max(1),
  dudas: z.array(z.string()),
}).refine(
  // Invariante de negocio: cuadre matemático
  data => Math.abs((data.gravadas5 + data.gravadas10 + data.exentas) - data.montoTotal) < 1,
  { message: 'Cuadre matemático fallido: gravadas + exentas ≠ total' },
);

export type FacturaClasificada = z.infer<typeof FacturaClasificadaSchema>;

// 2. Output RAG de consulta DNIT
export const RespuestaRagSchema = z.object({
  respuesta: z.string().min(1),
  citasLegales: z.array(z.object({
    fuente: z.string(),    // "Ley 6380/2019 Art. 14"
    fragmento: z.string(),
    relevancia: z.number().min(0).max(1),
  })),
  confianza: z.number().min(0).max(1),
  requiereRevision: z.boolean(),
});

export type RespuestaRag = z.infer<typeof RespuestaRagSchema>;

// 3. Regla del Logic Engine (Playground)
export const ReglaLogicaOutputSchema = z.object({
  camposAfectados: z.array(z.string()),
  valoresAplicados: z.record(z.unknown()),
  reglaActivada: z.string(),
});

export type ReglaLogicaOutput = z.infer<typeof ReglaLogicaOutputSchema>;

// 4. Schema Builder — validación del esquema guardado
export const CampoEsquemaSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  tipo: z.enum(['TEXTO', 'NUMERO', 'MONTO_PYG', 'FECHA', 'RUC', 'TIMBRADO', 'SELECCION', 'BOOLEANO']),
  requerido: z.boolean(),
  orden: z.number().int().min(0),
  opciones: z.array(z.string()).optional(),
  default: z.unknown().optional(),
});

export const EsquemaCamposSchema = z.object({
  version: z.string(),
  campos: z.array(CampoEsquemaSchema),
  reglas: z.array(z.object({
    id: z.string(),
    nombre: z.string(),
    condicion: z.object({
      campo: z.string(),
      operador: z.enum(['CONTIENE', 'IGUAL_A', 'MAYOR_QUE', 'MENOR_QUE', 'ES_NULO']),
      valor: z.unknown(),
    }),
    accion: z.object({
      campo: z.string(),
      valor: z.unknown(),
    }),
  })).optional().default([]),
});

export type EsquemaCampos = z.infer<typeof EsquemaCamposSchema>;
