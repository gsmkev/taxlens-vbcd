'use client';

import { useState, useRef } from 'react';

type EstadoFactura = 'PROCESANDO' | 'PROCESADO' | 'REVISION_PENDIENTE' | 'ERROR';

interface FacturaMock {
  id: string;
  archivo: string;
  rucEmisor: string;
  razonSocial: string;
  timbrado: string;
  numeroFactura: string;
  fechaEmision: string;
  condicion: 'CONTADO' | 'CREDITO';
  montoTotal: number;
  iva10: number;
  iva5: number;
  exentas: number;
  concepto: string;
  confianza: number;
  estado: EstadoFactura;
  dudas: string[];
}

const MOCK_FACTURAS: FacturaMock[] = [
  {
    id: 'f1', archivo: 'factura_supermercado.jpg',
    rucEmisor: '80012345-6', razonSocial: 'SUPERMERCADO STOCK S.A.',
    timbrado: '15230001', numeroFactura: '001-001-0003421',
    fechaEmision: '10/06/2025', condicion: 'CONTADO',
    montoTotal: 320000, iva10: 29091, iva5: 0, exentas: 0,
    concepto: 'Compra de insumos de oficina',
    confianza: 0.97, estado: 'PROCESADO', dudas: [],
  },
  {
    id: 'f2', archivo: 'factura_telefonia.pdf',
    rucEmisor: '80054321-1', razonSocial: 'TIGO NEGOCIOS S.A.',
    timbrado: '18900002', numeroFactura: '001-002-0001234',
    fechaEmision: '12/06/2025', condicion: 'CREDITO',
    montoTotal: 450000, iva10: 40909, iva5: 0, exentas: 0,
    concepto: 'Servicio de telefonía e internet',
    confianza: 0.91, estado: 'PROCESADO', dudas: [],
  },
  {
    id: 'f3', archivo: 'factura_alquiler.jpg',
    rucEmisor: '12345678-9', razonSocial: 'INMOBILIARIA DEL ESTE S.R.L.',
    timbrado: '12300003', numeroFactura: '002-001-0000892',
    fechaEmision: '01/06/2025', condicion: 'CREDITO',
    montoTotal: 1200000, iva10: 0, iva5: 57143, exentas: 0,
    concepto: 'Alquiler de local comercial junio 2025',
    confianza: 0.74, estado: 'REVISION_PENDIENTE',
    dudas: ['RUC no verificado en padrón', 'Timbrado próximo a vencer'],
  },
  {
    id: 'f4', archivo: 'recibo_ilegible.jpg',
    rucEmisor: '', razonSocial: '',
    timbrado: '', numeroFactura: '',
    fechaEmision: '', condicion: 'CONTADO',
    montoTotal: 0, iva10: 0, iva5: 0, exentas: 0,
    concepto: '',
    confianza: 0.12, estado: 'ERROR',
    dudas: ['Imagen ilegible', 'No se detectaron campos fiscales'],
  },
];

const PASOS = [
  { id: 'upload', label: 'Carga', icon: '📁' },
  { id: 'ocr', label: 'OCR', icon: '👁' },
  { id: 'classify', label: 'Clasificación', icon: '🧠' },
  { id: 'validate', label: 'Validación', icon: '✓' },
  { id: 'review', label: 'Revisión', icon: '📋' },
];

type TipoLibro = 'COMPRAS' | 'VENTAS';
type PasoId = typeof PASOS[number]['id'];

export default function MarangaituPage() {
  const [tipoLibro, setTipoLibro] = useState<TipoLibro>('COMPRAS');
  const [periodo, setPeriodo] = useState('2025-06');
  const [pasoActivo, setPasoActivo] = useState<PasoId>('review');
  const [facturas, setFacturas] = useState<FacturaMock[]>(MOCK_FACTURAS);
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set(['f1', 'f2']));
  const [editando, setEditando] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSeleccion = (id: string) => {
    setSeleccionadas(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const procesadas = facturas.filter(f => f.estado === 'PROCESADO').length;
  const revision = facturas.filter(f => f.estado === 'REVISION_PENDIENTE').length;
  const errores = facturas.filter(f => f.estado === 'ERROR').length;

  const confianzaMedia = facturas.length
    ? Math.round((facturas.reduce((acc, f) => acc + f.confianza, 0) / facturas.length) * 100)
    : 0;

  const colorConfianza = (c: number) =>
    c >= 0.9 ? 'var(--ok)' : c >= 0.7 ? 'var(--warn)' : 'var(--err)';

  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      {/* Header controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', background: 'var(--sur2)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
          {(['COMPRAS', 'VENTAS'] as TipoLibro[]).map(t => (
            <button key={t} onClick={() => setTipoLibro(t)} style={{
              padding: '6px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
              background: tipoLibro === t ? 'var(--p)' : 'transparent',
              color: tipoLibro === t ? 'white' : 'var(--muted)',
              transition: 'all .2s',
            }}>{t}</button>
          ))}
        </div>
        <input
          type="month" value={periodo} onChange={e => setPeriodo(e.target.value)}
          style={{
            padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border)',
            fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--p)',
            background: 'white',
          }}
        />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="bdg bdg-ok">✓ {procesadas} procesadas</span>
          {revision > 0 && <span className="bdg bdg-warn">⚠ {revision} revisión</span>}
          {errores > 0 && <span className="bdg" style={{ color: 'var(--err)', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)' }}>✗ {errores} errores</span>}
        </div>
      </div>

      {/* Pipeline steps */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', gap: 0 }}>
          {PASOS.map((paso, i) => {
            const isActive = paso.id === pasoActivo;
            const isDone = PASOS.findIndex(p => p.id === pasoActivo) > i;
            return (
              <div key={paso.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div
                  className={`pipe-step${isActive ? ' pipe-step-active' : isDone ? ' pipe-step-done' : ''}`}
                  onClick={() => setPasoActivo(paso.id)}
                  style={{ cursor: 'pointer', flex: 1 }}
                >
                  <span style={{ fontSize: 14 }}>{paso.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{paso.label}</span>
                  {isDone && <span style={{ fontSize: 10, color: 'var(--ok)' }}>✓</span>}
                </div>
                {i < PASOS.length - 1 && (
                  <div style={{ width: 24, height: 1, background: isDone ? 'var(--a)' : 'var(--border)', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {pasoActivo === 'upload' && (
        <div
          className={`upload-zone${dragOver ? ' upload-zone-drag' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); setPasoActivo('ocr'); }}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{ display: 'none' }} onChange={() => setPasoActivo('ocr')} />
          <div style={{ fontSize: 32, marginBottom: 12 }}>📁</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--p)', marginBottom: 6 }}>
            Arrastrá tus facturas aquí
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
            JPG, PNG, PDF — hasta 20 archivos por sesión
          </div>
          <button className="btn btn-primary" style={{ pointerEvents: 'none' }}>
            Seleccionar archivos
          </button>
        </div>
      )}

      {pasoActivo !== 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
          {/* Main review table */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Facturas — {tipoLibro} {periodo}
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                Confianza media: <strong style={{ color: colorConfianza(confianzaMedia / 100) }}>{confianzaMedia}%</strong>
              </span>
            </div>
            <div style={{ overflow: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th>Archivo</th>
                    <th>RUC / Razón Social</th>
                    <th>Nro Factura</th>
                    <th>Fecha</th>
                    <th style={{ textAlign: 'right' }}>Total ₲</th>
                    <th style={{ textAlign: 'right' }}>IVA</th>
                    <th>Confianza</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map(f => (
                    <tr
                      key={f.id}
                      style={{
                        cursor: 'pointer',
                        background: editando === f.id ? 'rgba(0,200,150,.04)' : undefined,
                        outline: f.estado === 'REVISION_PENDIENTE' ? '1px solid rgba(245,158,11,.3)' : f.estado === 'ERROR' ? '1px solid rgba(239,68,68,.3)' : undefined,
                      }}
                      onClick={() => setEditando(editando === f.id ? null : f.id)}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={seleccionadas.has(f.id)}
                          onChange={e => { e.stopPropagation(); toggleSeleccion(f.id); }}
                          disabled={f.estado === 'ERROR'}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {f.archivo}
                        </span>
                      </td>
                      <td>
                        {f.rucEmisor ? (
                          <>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--p)' }}>{f.rucEmisor}</div>
                            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{f.razonSocial}</div>
                          </>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--err)' }}>— no detectado</span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                          {f.numeroFactura || '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
                          {f.fechaEmision || '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                          {f.montoTotal > 0 ? f.montoTotal.toLocaleString('es-PY') : '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
                          {f.iva10 + f.iva5 > 0 ? (f.iva10 + f.iva5).toLocaleString('es-PY') : '—'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 40, height: 4, background: 'var(--sur2)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${f.confianza * 100}%`, background: colorConfianza(f.confianza), borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: colorConfianza(f.confianza) }}>
                            {Math.round(f.confianza * 100)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`bdg ${f.estado === 'PROCESADO' ? 'bdg-ok' : f.estado === 'REVISION_PENDIENTE' ? 'bdg-warn' : 'bdg-err'}`}>
                          {f.estado === 'PROCESADO' ? '✓ OK' : f.estado === 'REVISION_PENDIENTE' ? '⚠ REV.' : '✗ ERROR'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inline editor */}
            {editando && (() => {
              const f = facturas.find(x => x.id === editando)!;
              return (
                <div style={{ borderTop: '1px solid var(--border)', padding: '16px 18px', background: 'rgba(0,200,150,.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                      Editar: {f.archivo}
                    </span>
                    {f.dudas.length > 0 && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {f.dudas.map((d, i) => (
                          <span key={i} className="bdg bdg-warn" style={{ fontSize: 9 }}>⚠ {d}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {[
                      { label: 'RUC Emisor', val: f.rucEmisor },
                      { label: 'Razón Social', val: f.razonSocial },
                      { label: 'Timbrado', val: f.timbrado },
                      { label: 'Nro Factura', val: f.numeroFactura },
                      { label: 'Fecha Emisión', val: f.fechaEmision },
                      { label: 'Monto Total', val: f.montoTotal.toString() },
                      { label: 'IVA 10%', val: f.iva10.toString() },
                      { label: 'Concepto', val: f.concepto },
                    ].map((field, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>
                          {field.label}
                        </div>
                        <input
                          defaultValue={field.val}
                          style={{
                            width: '100%', padding: '6px 8px', borderRadius: 6, fontSize: 11,
                            border: '1px solid var(--border)', background: 'white',
                            fontFamily: field.label.includes('Nro') || field.label.includes('RUC') || field.label.includes('Monto') || field.label.includes('IVA') ? 'JetBrains Mono, monospace' : 'inherit',
                            color: 'var(--p)',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn btn-primary" style={{ fontSize: 11, padding: '6px 16px' }}
                      onClick={() => { setFacturas(prev => prev.map(x => x.id === f.id ? { ...x, estado: 'PROCESADO' as const, dudas: [] } : x)); setEditando(null); }}>
                      Guardar y aprobar
                    </button>
                    <button className="btn" style={{ fontSize: 11, padding: '6px 16px', background: 'var(--sur2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                      onClick={() => setEditando(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Footer actions */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', flex: 1 }}>
                {seleccionadas.size} seleccionadas de {facturas.filter(f => f.estado !== 'ERROR').length} válidas
              </span>
              <button className="btn" style={{ fontSize: 11, padding: '7px 14px', background: 'var(--sur2)', color: 'var(--p)', border: '1px solid var(--border)' }}>
                📥 CSV Marangatu
              </button>
              <button className="btn btn-primary" style={{ fontSize: 11, padding: '7px 14px' }}>
                📊 Excel exportar
              </button>
            </div>
          </div>

          {/* Right panel: RAG suggestions + stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Stats */}
            <div className="card">
              <div className="card-head">
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                  Resumen fiscal
                </span>
              </div>
              <div className="card-body" style={{ paddingTop: 8 }}>
                {[
                  { label: 'Total compras', val: `₲ ${facturas.filter(f => f.estado === 'PROCESADO').reduce((a, f) => a + f.montoTotal, 0).toLocaleString('es-PY')}` },
                  { label: 'IVA 10% total', val: `₲ ${facturas.filter(f => f.estado === 'PROCESADO').reduce((a, f) => a + f.iva10, 0).toLocaleString('es-PY')}` },
                  { label: 'IVA 5% total', val: `₲ ${facturas.filter(f => f.estado === 'PROCESADO').reduce((a, f) => a + f.iva5, 0).toLocaleString('es-PY')}` },
                  { label: 'Facturas OK', val: `${procesadas} / ${facturas.length}` },
                ].map((s, i) => (
                  <div className="stat-row" key={i}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.label}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RAG suggestions */}
            <div className="card" style={{ flex: 1 }}>
              <div className="card-head">
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                  Sugerencias DNIT
                </span>
                <span className="bdg bdg-active" style={{ fontSize: 9 }}>RAG</span>
              </div>
              <div className="card-body" style={{ paddingTop: 8 }}>
                {[
                  {
                    titulo: 'Timbrado próximo a vencer',
                    ref: 'SET Res. 56/2020 Art. 8',
                    texto: 'El timbrado de la factura nro 3 vence en menos de 30 días. Verificar vigencia en la página de la SET antes de computar el crédito fiscal.',
                    tipo: 'warn',
                  },
                  {
                    titulo: 'Alquiler — IVA 5% correcto',
                    ref: 'Ley 6380/2019 Art. 91',
                    texto: 'Los servicios de arrendamiento de inmuebles tributan IVA 5%. El monto imputado es consistente con la normativa vigente.',
                    tipo: 'ok',
                  },
                  {
                    titulo: 'Límite crédito fiscal IVA',
                    ref: 'Decreto 3107/2019 Art. 23',
                    texto: 'El crédito fiscal computable no puede exceder el débito fiscal del período. Verificar en la declaración mensual.',
                    tipo: 'info',
                  },
                ].map((s, i) => (
                  <div key={i} className="rag-result" style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.tipo === 'ok' ? 'var(--ok)' : s.tipo === 'warn' ? 'var(--warn)' : 'var(--a)' }}>
                        {s.tipo === 'ok' ? '✓' : s.tipo === 'warn' ? '⚠' : 'ℹ'} {s.titulo}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 4 }}>{s.texto}</div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--a)', fontWeight: 600 }}>{s.ref}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing log */}
            <div className="card">
              <div className="card-head">
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                  Log de procesamiento
                </span>
              </div>
              <div style={{ padding: '8px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted)', lineHeight: 1.8 }}>
                <div><span style={{ color: 'var(--ok)' }}>[OK]</span> Florence-2 OCR — 3/4 archivos</div>
                <div><span style={{ color: 'var(--ok)' }}>[OK]</span> Gemma 4 clasificación — 2/3</div>
                <div><span style={{ color: 'var(--warn)' }}>[WARN]</span> RUC 12345678-9 — padrón</div>
                <div><span style={{ color: 'var(--err)' }}>[ERR]</span> recibo_ilegible.jpg — conf 12%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
