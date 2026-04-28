'use client';

import ExcelJS from 'exceljs';
import type { FacturaProcesada } from '@/types/factura';
import { nombreArchivoMarangatu, type TipoLibro } from '@/lib/validation/marangatu';

const COLORES = {
  primary: '0F2B5B',
  accent: '00C896',
  header: 'E2E8F0',
  warning: 'FEF3C7',
  error: 'FEE2E2',
};

// Genera CSV con formato exacto de Marangatu — NUNCA en servidor
export function generarCSVMarangatu(
  facturas: FacturaProcesada[],
  tipoLibro: TipoLibro,
): string {
  const codigoTipo = tipoLibro === 'COMPRAS' ? 'CM' : tipoLibro === 'VENTAS' ? 'VT' : tipoLibro === 'INGRESOS' ? 'IN' : 'EG';

  const cabecera = [
    'CÓDIGO TIPO REGISTRO',
    'RUC EMISOR',
    'NOMBRE/RAZÓN SOCIAL',
    'TIMBRADO',
    'NÚMERO FACTURA',
    'FECHA EMISIÓN',
    'CONDICIÓN VENTA',
    'MONTO TOTAL',
    'IVA 5% INCLUIDO',
    'IVA 10% INCLUIDO',
    'MONTO EXENTO',
    'IMPUTA AL IVA',
    'IMPUTA AL IRE',
    'IMPUTA AL IRP-RSP',
  ].join(';');

  const filas = facturas.map(f => [
    codigoTipo,
    f.rucEmisor,
    (f.nombreEmisor ?? '').replace(/;/g, ','),
    f.timbrado,
    f.numeroFactura,
    f.fechaEmision,
    f.condicionVenta,
    f.montoTotal.toFixed(0),
    f.iva5.toFixed(0),
    f.iva10.toFixed(0),
    f.exentas.toFixed(0),
    f.imputaIva ? 'S' : 'N',
    f.imputaIre ? 'S' : 'N',
    f.imputaIrpRsp ? 'S' : 'N',
  ].join(';'));

  return [cabecera, ...filas].join('\n');
}

// Genera Excel con formato humano — 100% en el cliente
export async function generarExcelMarangatu(
  facturas: FacturaProcesada[],
  tipoLibro: TipoLibro,
  periodo: string,
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TaxLens PY';
  workbook.created = new Date();

  const nombreHoja = nombreArchivoMarangatu(tipoLibro, periodo);
  const hojaDatos = workbook.addWorksheet(nombreHoja, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // Definir columnas
  hojaDatos.columns = [
    { header: '#', key: 'num', width: 5 },
    { header: 'RUC Emisor', key: 'rucEmisor', width: 16 },
    { header: 'Nombre/Razón Social', key: 'nombreEmisor', width: 30 },
    { header: 'Timbrado', key: 'timbrado', width: 12 },
    { header: 'Nº Factura', key: 'numeroFactura', width: 20 },
    { header: 'Fecha', key: 'fechaEmision', width: 12 },
    { header: 'Condición', key: 'condicionVenta', width: 10 },
    { header: 'Total (₲)', key: 'montoTotal', width: 16 },
    { header: 'IVA 5%', key: 'iva5', width: 12 },
    { header: 'IVA 10%', key: 'iva10', width: 12 },
    { header: 'Exentas', key: 'exentas', width: 12 },
    { header: 'Imputa IVA', key: 'imputaIva', width: 11 },
    { header: 'Imputa IRE', key: 'imputaIre', width: 11 },
    { header: 'Imputa IRP', key: 'imputaIrpRsp', width: 11 },
    { header: 'Concepto', key: 'concepto', width: 30 },
    { header: 'Estado', key: 'estado', width: 16 },
  ];

  // Estilo de cabecera
  const cabeceraRow = hojaDatos.getRow(1);
  cabeceraRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Calibri', size: 10 };
  cabeceraRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF' + COLORES.primary },
  };
  cabeceraRow.height = 22;
  cabeceraRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // Filas de datos
  facturas.forEach((f, i) => {
    const fila = hojaDatos.addRow({
      num: i + 1,
      rucEmisor: f.rucEmisor,
      nombreEmisor: f.nombreEmisor ?? '',
      timbrado: f.timbrado,
      numeroFactura: f.numeroFactura,
      fechaEmision: f.fechaEmision,
      condicionVenta: f.condicionVenta,
      montoTotal: f.montoTotal,
      iva5: f.iva5,
      iva10: f.iva10,
      exentas: f.exentas,
      imputaIva: f.imputaIva ? 'S' : 'N',
      imputaIre: f.imputaIre ? 'S' : 'N',
      imputaIrpRsp: f.imputaIrpRsp ? 'S' : 'N',
      concepto: f.concepto,
      estado: f.estado,
    });

    // Formato de montos
    ['montoTotal', 'iva5', 'iva10', 'exentas'].forEach(col => {
      const cell = fila.getCell(col);
      cell.numFmt = '#,##0';
    });

    // Color por estado
    if (f.estado === 'REVISION_PENDIENTE' || f.advertencias.length > 0) {
      fila.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF' + COLORES.warning },
      };
    } else if (f.estado === 'ERROR') {
      fila.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF' + COLORES.error },
      };
    }

    // Bordes
    fila.eachCell({ includeEmpty: true }, cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };
    });
  });

  // Hoja de resumen
  const hojaResumen = workbook.addWorksheet('Resumen');
  hojaResumen.columns = [
    { header: 'Concepto', key: 'concepto', width: 30 },
    { header: 'Monto (₲)', key: 'monto', width: 18 },
  ];

  const totalMonto = facturas.reduce((s, f) => s + f.montoTotal, 0);
  const totalIva5 = facturas.reduce((s, f) => s + f.iva5, 0);
  const totalIva10 = facturas.reduce((s, f) => s + f.iva10, 0);
  const totalExentas = facturas.reduce((s, f) => s + f.exentas, 0);

  [
    { concepto: 'Total Monto', monto: totalMonto },
    { concepto: 'Total IVA 5%', monto: totalIva5 },
    { concepto: 'Total IVA 10%', monto: totalIva10 },
    { concepto: 'Total Exentas', monto: totalExentas },
    { concepto: 'Cantidad de facturas', monto: facturas.length },
  ].forEach(row => {
    const fila = hojaResumen.addRow(row);
    fila.getCell('monto').numFmt = '#,##0';
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function descargarBlob(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
