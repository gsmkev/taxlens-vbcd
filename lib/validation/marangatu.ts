import { validarRUC } from './ruc';

export type TipoLibro = 'VENTAS' | 'COMPRAS' | 'INGRESOS' | 'EGRESOS';

export interface ResultadoValidacion {
  valido: boolean;
  advertencias: string[];
  errores: string[];
}

export function validarCamposFactura(datos: {
  rucEmisor: string;
  timbrado: string;
  numeroFactura: string;
  fechaEmision: string;
  montoTotal: number;
  gravadas5: number;
  gravadas10: number;
  exentas: number;
}): ResultadoValidacion {
  const advertencias: string[] = [];
  const errores: string[] = [];

  // Validar RUC
  const rucCheck = validarRUC(datos.rucEmisor);
  if (!rucCheck.valido) {
    advertencias.push(rucCheck.error ?? 'RUC con formato inválido');
  }

  // Validar timbrado — 8 dígitos
  if (!/^\d{8}$/.test(datos.timbrado)) {
    errores.push('Timbrado debe tener exactamente 8 dígitos numéricos');
  }

  // Validar número de factura — XXX-XXX-XXXXXXX
  if (!/^\d{3}-\d{3}-\d{7}$/.test(datos.numeroFactura)) {
    advertencias.push('Número de factura no tiene el formato estándar XXX-XXX-XXXXXXX');
  }

  // Validar fecha — DD/MM/YYYY
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(datos.fechaEmision)) {
    errores.push('Fecha debe estar en formato DD/MM/YYYY');
  }

  // Validar cuadre matemático: gravadas5 + gravadas10 + exentas ≈ montoTotal
  const sumaGravadas = datos.gravadas5 + datos.gravadas10 + datos.exentas;
  if (Math.abs(sumaGravadas - datos.montoTotal) > 1) {
    errores.push(
      `Cuadre matemático fallido: gravadas (₲ ${sumaGravadas.toLocaleString()}) ≠ total (₲ ${datos.montoTotal.toLocaleString()})`,
    );
  }

  // Alerta para montos grandes que requieren transferencia bancaria
  if (datos.montoTotal > 5_000_000) {
    advertencias.push(
      'Monto superior a ₲ 5.000.000 — verificá que el pago se realizó por transferencia bancaria (requisito DNIT)',
    );
  }

  return {
    valido: errores.length === 0,
    advertencias,
    errores,
  };
}

// Genera nombre de archivo estándar para Marangatu
export function nombreArchivoMarangatu(tipoLibro: TipoLibro, periodo: string): string {
  const mapa: Record<TipoLibro, string> = {
    VENTAS: 'LIBRO_VENTAS',
    COMPRAS: 'LIBRO_COMPRAS',
    INGRESOS: 'LIBRO_INGRESOS',
    EGRESOS: 'LIBRO_EGRESOS',
  };
  // periodo es 'YYYY-MM', lo convertimos a YYYYMM
  const periodoFormato = periodo.replace('-', '');
  return `${mapa[tipoLibro]}_${periodoFormato}`;
}
