export interface FacturaProcesada {
  id: string;
  periodo: string;                       // 'YYYY-MM'
  tipoLibro: 'VENTAS' | 'COMPRAS' | 'INGRESOS' | 'EGRESOS';

  // Datos OCR — SOLO en IndexedDB local, NUNCA en Neon
  rucEmisor: string;                     // '80012345-6'
  nombreEmisor?: string;
  timbrado: string;                      // 8 dígitos
  numeroFactura: string;                 // 'XXX-XXX-XXXXXXX'
  fechaEmision: string;                  // 'YYYY-MM-DD'
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

  // Metadata de procesamiento
  confianzaOcr: number;                  // 0.0 - 1.0
  revisadoManualmente: boolean;
  advertencias: string[];
  estado: 'PROCESADO' | 'REVISION_PENDIENTE' | 'ERROR' | 'EXPORTADO';
  creadoEn: string;                      // ISO 8601
  actualizadoEn: string;
}

export interface SesionProcesamiento {
  id: string;
  nombre?: string;                       // 'Compras Junio 2025'
  tipoLibro: 'VENTAS' | 'COMPRAS' | 'INGRESOS' | 'EGRESOS';
  periodo: string;
  totalFacturas: number;
  facturasProcesadas: number;
  facturasConError: number;
  estado: 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  idsFacturas: string[];
  creadoEn: string;
  completadoEn?: string;
}

export interface ConfigLocal {
  key: string;
  value: unknown;
  actualizadoEn: string;
}

export interface CampoEsquema {
  id: string;
  nombre: string;
  tipo: 'TEXTO' | 'NUMERO' | 'MONTO_PYG' | 'FECHA' | 'RUC' | 'TIMBRADO' | 'SELECCION' | 'BOOLEANO';
  requerido: boolean;
  orden: number;
  opciones?: string[];                   // Para tipo SELECCION
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

// Resultado de procesamiento con tipo discriminado
export type ResultadoProcesamiento =
  | { ok: true; datos: FacturaProcesada }
  | { ok: false; error: string; codigo: 'RUC_INVALIDO' | 'ILEGIBLE' | 'CUADRE_INCORRECTO' | 'LLM_FALLO' };
