'use client';

import Link from 'next/link';

const KPIS = [
  { icon: '🧾', val: '187', label: 'Facturas procesadas', delta: '+23 este mes', up: true },
  { icon: '💰', val: '₲ 12,4M', label: 'Total IVA Compras', delta: '+8% vs mayo', up: true },
  { icon: '📈', val: '₲ 8,1M', label: 'Total IVA Ventas', delta: '-3% vs mayo', up: false },
  { icon: '⚠', val: '4', label: 'Requieren revisión', delta: '2 errores críticos', up: false },
];

const SESIONES = [
  { nombre: 'Compras Junio 2025', facturas: 80, ok: 78, warn: 2, err: 0, estado: 'COMPLETADO', fecha: '15/06/2025' },
  { nombre: 'Ventas Junio 2025', facturas: 45, ok: 43, warn: 1, err: 1, estado: 'REVISIÓN', fecha: '14/06/2025' },
  { nombre: 'Egresos Mayo 2025', facturas: 62, ok: 62, warn: 0, err: 0, estado: 'EXPORTADO', fecha: '31/05/2025' },
];

const MODELOS = [
  { name: 'Florence-2 Base', state: 'ACTIVO', size: '270 MB' },
  { name: 'Gemma 4 E2B int4', state: 'ACTIVO', size: '2,5 GB' },
  { name: 'MiniLM Embeddings', state: 'ACTIVO', size: '25 MB' },
  { name: 'DNIT Knowledge', state: 'v2025-Q1', size: '28 MB' },
];

const BARRAS = [
  { label: 'IVA Compras', val: 12.4, max: 20, color: 'var(--p)' },
  { label: 'IVA Ventas', val: 8.1, max: 20, color: 'var(--a)' },
  { label: 'IRP-RSP Base', val: 5.6, max: 20, color: '#F59E0B' },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {KPIS.map((k, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: 16, border: '1px solid var(--border)',
            padding: '16px 18px', position: 'relative', overflow: 'hidden',
          }}>
            <span style={{ fontSize: 18, display: 'block', marginBottom: 10 }}>{k.icon}</span>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--p)' }}>{k.val}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{k.label}</div>
            <span style={{
              fontSize: 10, fontWeight: 600, marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 7px', borderRadius: 4,
              background: k.up ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)',
              color: k.up ? 'var(--ok)' : 'var(--err)',
            }}>
              {k.up ? '↑' : '↓'} {k.delta}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Sesiones recientes */}
        <div className="card">
          <div className="card-head">
            <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
              Sesiones recientes
            </span>
            <Link href="/marangatu">
              <span className="tag tag-blue" style={{ cursor: 'pointer' }}>+ Nueva</span>
            </Link>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr><th>Sesión</th><th>Facturas</th><th>Estado</th><th>Fecha</th></tr>
              </thead>
              <tbody>
                {SESIONES.map((r, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--p)' }}>{r.nombre}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                        <span style={{ color: 'var(--ok)' }}>✓{r.ok}</span>
                        {r.warn > 0 && <span style={{ color: 'var(--warn)', marginLeft: 6 }}>⚠{r.warn}</span>}
                        {r.err > 0 && <span style={{ color: 'var(--err)', marginLeft: 6 }}>✗{r.err}</span>}
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700 }}>{r.facturas}</span></td>
                    <td>
                      <span className={`bdg ${r.estado === 'COMPLETADO' ? 'bdg-ok' : r.estado === 'EXPORTADO' ? 'bdg-primary' : 'bdg-warn'}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>{r.fecha}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Estado de modelos */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Estado de modelos
              </span>
              <Link href="/hub">
                <span style={{ fontSize: 11, color: 'var(--a)', cursor: 'pointer', fontWeight: 600 }}>Gestionar →</span>
              </Link>
            </div>
            <div className="card-body" style={{ paddingTop: 10 }}>
              {MODELOS.map((m, i) => (
                <div className="stat-row" key={i}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--p)' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{m.size}</div>
                  </div>
                  <span className="bdg bdg-active">{m.state}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totales IVA */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)' }}>
                IVA Compras vs Ventas
              </span>
            </div>
            <div className="card-body" style={{ paddingTop: 10 }}>
              {BARRAS.map((item, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--muted)' }}>{item.label}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--p)' }}>
                      ₲ {item.val}M
                    </span>
                  </div>
                  <div className="mini-bar">
                    <div className="mini-bar-fill" style={{ width: `${(item.val / item.max) * 100}%`, background: item.color }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
