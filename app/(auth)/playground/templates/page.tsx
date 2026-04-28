'use client';

import { useState } from 'react';

interface ColumnaExcel {
  id: string;
  encabezado: string;
  campo: string;
  formato: 'texto' | 'numero' | 'moneda_gs' | 'fecha' | 'porcentaje';
  ancho: number;
  incluir: boolean;
}

const PLANTILLAS_PRESET = [
  {
    id: 'marangatu_compras',
    nombre: 'Marangatu Libro Compras',
    descripcion: 'Columnas exactas según especificación SET',
    columnas: 18,
  },
  {
    id: 'marangatu_ventas',
    nombre: 'Marangatu Libro Ventas',
    descripcion: 'Columnas exactas según especificación SET',
    columnas: 16,
  },
  {
    id: 'resumen_mensual',
    nombre: 'Resumen Mensual IVA',
    descripcion: 'Totales por período con comparativa',
    columnas: 8,
  },
  {
    id: 'irp_rsp',
    nombre: 'IRP-RSP Honorarios',
    descripcion: 'Declaración de ingresos por servicios',
    columnas: 12,
  },
];

const CAMPOS_FACTURA = [
  'rucEmisor', 'razonSocial', 'timbrado', 'numeroFactura', 'fechaEmision',
  'condicionVenta', 'montoTotal', 'gravadas10', 'gravadas5', 'exentas',
  'iva10', 'iva5', 'concepto', 'imputaIva', 'imputaIre', 'imputaIrpRsp',
  'confianza', 'estado',
];

const FORMATOS = [
  { val: 'texto', label: 'Texto' },
  { val: 'numero', label: 'Número' },
  { val: 'moneda_gs', label: 'Moneda ₲' },
  { val: 'fecha', label: 'Fecha' },
  { val: 'porcentaje', label: 'Porcentaje' },
] as const;

const COLUMNAS_INICIALES: ColumnaExcel[] = [
  { id: 'c1', encabezado: 'RUC Emisor', campo: 'rucEmisor', formato: 'texto', ancho: 15, incluir: true },
  { id: 'c2', encabezado: 'Razón Social', campo: 'razonSocial', formato: 'texto', ancho: 30, incluir: true },
  { id: 'c3', encabezado: 'Nro Factura', campo: 'numeroFactura', formato: 'texto', ancho: 18, incluir: true },
  { id: 'c4', encabezado: 'Fecha', campo: 'fechaEmision', formato: 'fecha', ancho: 12, incluir: true },
  { id: 'c5', encabezado: 'Monto Total', campo: 'montoTotal', formato: 'moneda_gs', ancho: 14, incluir: true },
  { id: 'c6', encabezado: 'IVA 10%', campo: 'iva10', formato: 'moneda_gs', ancho: 12, incluir: true },
  { id: 'c7', encabezado: 'IVA 5%', campo: 'iva5', formato: 'moneda_gs', ancho: 12, incluir: true },
  { id: 'c8', encabezado: 'Exentas', campo: 'exentas', formato: 'moneda_gs', ancho: 12, incluir: true },
  { id: 'c9', encabezado: 'Concepto', campo: 'concepto', formato: 'texto', ancho: 35, incluir: true },
  { id: 'c10', encabezado: 'Estado', campo: 'estado', formato: 'texto', ancho: 12, incluir: false },
];

const COLOR_FORMATO: Record<string, string> = {
  texto: 'var(--muted)',
  numero: 'var(--p)',
  moneda_gs: 'var(--ok)',
  fecha: 'var(--a)',
  porcentaje: '#F59E0B',
};

export default function TemplatesPage() {
  const [columnas, setColumnas] = useState<ColumnaExcel[]>(COLUMNAS_INICIALES);
  const [nombrePlantilla, setNombrePlantilla] = useState('Mi plantilla Excel');
  const [filaEncabezadoCongelada, setFilaEncabezadoCongelada] = useState(true);
  const [colorEstado, setColorEstado] = useState(true);
  const [hojaResumen, setHojaResumen] = useState(true);
  const [previewActivo, setPreviewActivo] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const toggleColumna = (id: string) => {
    setColumnas(prev => prev.map(c => c.id === id ? { ...c, incluir: !c.incluir } : c));
  };

  const guardar = async () => {
    setGuardando(true);
    await new Promise(r => setTimeout(r, 700));
    setGuardando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const colsActivas = columnas.filter(c => c.incluir);

  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Main editor */}
        <div>
          {/* Name + save */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>
                  Nombre de la plantilla
                </div>
                <input
                  value={nombrePlantilla}
                  onChange={e => setNombrePlantilla(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 0', border: 'none', borderBottom: '2px solid var(--a)',
                    fontSize: 14, fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--p)',
                    background: 'transparent', outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn"
                  style={{ fontSize: 11, padding: '7px 14px', background: 'var(--sur2)', color: 'var(--p)', border: '1px solid var(--border)' }}
                  onClick={() => setPreviewActivo(!previewActivo)}
                >
                  {previewActivo ? 'Ocultar preview' : 'Mostrar preview'}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: 11, padding: '7px 18px' }}
                  onClick={guardar}
                  disabled={guardando}
                >
                  {guardando ? '...' : guardado ? '✓ Guardado' : '💾 Guardar'}
                </button>
              </div>
            </div>
          </div>

          {/* Columns config */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Columnas ({colsActivas.length} activas)
              </span>
            </div>
            <div style={{ overflow: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>Inc.</th>
                    <th>Encabezado</th>
                    <th>Campo</th>
                    <th>Formato</th>
                    <th style={{ width: 80 }}>Ancho</th>
                  </tr>
                </thead>
                <tbody>
                  {columnas.map(col => (
                    <tr key={col.id} style={{ opacity: col.incluir ? 1 : 0.45 }}>
                      <td>
                        <input type="checkbox" checked={col.incluir} onChange={() => toggleColumna(col.id)} style={{ cursor: 'pointer' }} />
                      </td>
                      <td>
                        <input
                          value={col.encabezado}
                          onChange={e => setColumnas(prev => prev.map(c => c.id === col.id ? { ...c, encabezado: e.target.value } : c))}
                          style={{ padding: '4px 6px', borderRadius: 5, border: '1px solid var(--border)', fontSize: 11, color: 'var(--p)', width: '100%' }}
                        />
                      </td>
                      <td>
                        <select
                          value={col.campo}
                          onChange={e => setColumnas(prev => prev.map(c => c.id === col.id ? { ...c, campo: e.target.value } : c))}
                          style={{ padding: '4px 6px', borderRadius: 5, border: '1px solid var(--border)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--p)', background: 'white', width: '100%' }}
                        >
                          {CAMPOS_FACTURA.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </td>
                      <td>
                        <select
                          value={col.formato}
                          onChange={e => setColumnas(prev => prev.map(c => c.id === col.id ? { ...c, formato: e.target.value as ColumnaExcel['formato'] } : c))}
                          style={{
                            padding: '4px 6px', borderRadius: 5, border: `1px solid ${COLOR_FORMATO[col.formato]}44`,
                            fontSize: 10, color: COLOR_FORMATO[col.formato], background: `${COLOR_FORMATO[col.formato]}0d`,
                          }}
                        >
                          {FORMATOS.map(f => <option key={f.val} value={f.val}>{f.label}</option>)}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={col.ancho}
                          onChange={e => setColumnas(prev => prev.map(c => c.id === col.id ? { ...c, ancho: Number(e.target.value) } : c))}
                          min={8} max={60}
                          style={{ padding: '4px 6px', borderRadius: 5, border: '1px solid var(--border)', fontSize: 11, width: '100%', color: 'var(--p)' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Excel preview */}
          {previewActivo && (
            <div className="card">
              <div className="card-head">
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                  Vista previa Excel
                </span>
                <span className="bdg" style={{ fontSize: 9, color: 'var(--ok)', background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)' }}>
                  .xlsx · cliente
                </span>
              </div>
              <div style={{ overflow: 'auto', padding: '10px 14px' }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, minWidth: 'max-content',
                  borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)',
                }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', background: 'var(--p)', color: 'white' }}>
                    {colsActivas.map((col, i) => (
                      <div key={i} style={{
                        padding: '7px 10px', fontSize: 9, fontWeight: 700,
                        minWidth: col.ancho * 6, borderRight: '1px solid rgba(255,255,255,.15)',
                        whiteSpace: 'nowrap',
                      }}>
                        {col.encabezado}
                      </div>
                    ))}
                  </div>
                  {/* Sample rows */}
                  {[
                    { rucEmisor: '80012345-6', razonSocial: 'SUPERMERCADO S.A.', numeroFactura: '001-001-0003421', fechaEmision: '10/06/2025', montoTotal: '320.000', iva10: '29.091', iva5: '0', exentas: '0', concepto: 'Insumos oficina', estado: 'PROCESADO' },
                    { rucEmisor: '80054321-1', razonSocial: 'TIGO NEGOCIOS S.A.', numeroFactura: '001-002-0001234', fechaEmision: '12/06/2025', montoTotal: '450.000', iva10: '40.909', iva5: '0', exentas: '0', concepto: 'Telefonía', estado: 'PROCESADO' },
                  ].map((row, ri) => (
                    <div key={ri} style={{ display: 'flex', background: ri % 2 === 0 ? 'white' : 'var(--sur2)' }}>
                      {colsActivas.map((col, ci) => (
                        <div key={ci} style={{
                          padding: '6px 10px', fontSize: 9, color: 'var(--p)',
                          minWidth: col.ancho * 6, borderRight: '1px solid var(--border)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          textAlign: col.formato === 'moneda_gs' || col.formato === 'numero' ? 'right' : 'left',
                        }}>
                          {col.formato === 'moneda_gs' ? `₲ ${(row as Record<string, string>)[col.campo] ?? '—'}` : (row as Record<string, string>)[col.campo] ?? '—'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Preset templates */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Plantillas predefinidas
              </span>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              {PLANTILLAS_PRESET.map((p, i) => (
                <div key={i} style={{ marginBottom: 10, padding: '10px 12px', background: 'var(--sur2)', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p)', marginBottom: 2 }}>{p.nombre}</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 6 }}>{p.descripcion}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted)' }}>{p.columnas} cols</span>
                    <button style={{ fontSize: 9, color: 'var(--a)', fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      Usar →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Opciones Excel
              </span>
            </div>
            <div className="card-body" style={{ paddingTop: 10 }}>
              {[
                { label: 'Fila encabezado congelada', val: filaEncabezadoCongelada, set: setFilaEncabezadoCongelada },
                { label: 'Color por estado', val: colorEstado, set: setColorEstado },
                { label: 'Hoja de resumen', val: hojaResumen, set: setHojaResumen },
              ].map((opt, i) => (
                <div key={i} className="stat-row">
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{opt.label}</span>
                  <div
                    onClick={() => opt.set(!opt.val)}
                    style={{
                      width: 32, height: 18, borderRadius: 9, cursor: 'pointer',
                      background: opt.val ? 'var(--a)' : 'var(--border)',
                      position: 'relative', transition: 'background .2s', flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 2, left: opt.val ? 16 : 2,
                      width: 14, height: 14, borderRadius: '50%', background: 'white',
                      transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>
                El archivo Excel se genera 100% en el navegador con ExcelJS. Ningún dato fiscal sale de tu dispositivo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
