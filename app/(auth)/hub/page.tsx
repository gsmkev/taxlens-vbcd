'use client';

import { useState } from 'react';

const MODELOS = [
  {
    id: 'fl2t', name: 'Florence-2 Tiny', type: 'OCR · VISIÓN', size: '80 MB',
    desc: 'OCR básico para facturas claras. Ideal para CPU sin GPU dedicada.',
    state: 'ready', perf: 62, tags: ['CPU', '80MB', 'Básico'],
  },
  {
    id: 'fl2b', name: 'Florence-2 Base', type: 'OCR · VISIÓN', size: '270 MB',
    desc: 'OCR de alta precisión. Recomendado para la mayoría de usuarios.',
    state: 'active', perf: 95, tags: ['WebGPU', '270MB', 'Recomendado'],
  },
  {
    id: 'gm4s', name: 'Gemma 4 250M', type: 'LLM · CLASIFICACIÓN', size: '450 MB',
    desc: 'Clasificación básica de gastos. Funciona en CPU moderno.',
    state: 'ready', perf: 71, tags: ['CPU', '450MB'],
  },
  {
    id: 'gm4e', name: 'Gemma 4 E2B int4', type: 'LLM · CLASIFICACIÓN', size: '2,5 GB',
    desc: 'Análisis completo y clasificación fiscal avanzada con RAG.',
    state: 'active', perf: 98, tags: ['WebGPU', '4GB VRAM', '2.5GB'],
  },
  {
    id: 'minilm', name: 'all-MiniLM-L6-v2', type: 'EMBEDDINGS · RAG', size: '25 MB',
    desc: 'Necesario para búsqueda semántica en la base DNIT.',
    state: 'active', perf: 88, tags: ['CPU', '25MB', 'Requerido'],
  },
  {
    id: 'dnit', name: 'DNIT Knowledge v2025-Q1', type: 'ÍNDICE VECTORIAL', size: '28 MB',
    desc: 'Ley 6380, Decretos 3107/3182/3184 y resoluciones hasta Q1 2025.',
    state: 'active', perf: null, tags: ['28MB', 'Q1-2025'],
  },
];

const STATE_COLOR: Record<string, string> = {
  active: 'var(--ok)', ready: 'var(--a)', downloading: 'var(--warn)', none: 'var(--muted)',
};
const STATE_LABEL: Record<string, string> = {
  active: 'EN USO', ready: 'LISTO', downloading: 'DESCARGANDO', none: 'NO INSTALADO',
};

export default function HubPage() {
  const [progreso, setProgreso] = useState<Record<string, number>>({});

  const simularDescarga = (id: string) => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) { p = 100; clearInterval(interval); }
      setProgreso(prev => ({ ...prev, [id]: Math.min(Math.round(p), 100) }));
    }, 400);
  };

  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      {/* Hardware profile */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <span style={{ fontSize: 15 }}>🖥</span>
          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
            Perfil de hardware detectado
          </span>
          <span className="bdg bdg-ok">WebGPU disponible</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { label: 'GPU', val: 'NVIDIA RTX 3060' },
              { label: 'VRAM', val: '12 GB' },
              { label: 'RAM', val: '16 GB' },
              { label: 'OPFS libre', val: '7,2 GB' },
            ].map((h, i) => (
              <div key={i} style={{ background: 'var(--sur2)', borderRadius: 10, padding: '11px 14px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>
                  {h.label}
                </div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)' }}>{h.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modelos grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {MODELOS.map(m => {
          const dl = progreso[m.id];
          const isDownloading = typeof dl === 'number' && dl < 100;
          const estadoActual = isDownloading ? 'downloading' : (dl === 100 ? 'active' : m.state);

          return (
            <div key={m.id} style={{
              background: 'white', border: `1px solid ${estadoActual === 'active' ? 'var(--a)' : 'var(--border)'}`,
              borderRadius: 16, padding: 18, transition: 'all .2s', position: 'relative', overflow: 'hidden',
            }}>
              {estadoActual === 'active' && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--a),var(--p))' }}/>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)' }}>{m.name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{m.type}</div>
                </div>
                <span className="bdg" style={{
                  color: STATE_COLOR[estadoActual] ?? 'var(--muted)',
                  background: `${STATE_COLOR[estadoActual] ?? '#999'}18`,
                  border: `1px solid ${STATE_COLOR[estadoActual] ?? '#999'}33`,
                }}>
                  {STATE_LABEL[estadoActual] ?? estadoActual.toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}>{m.desc}</div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {m.tags.map((t, i) => (
                  <span key={i} className="tag tag-muted">{t}</span>
                ))}
              </div>

              {m.perf !== null && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>
                    <span>Precisión OCR estimada</span>
                    <span style={{ fontWeight: 700, color: 'var(--p)' }}>{m.perf}%</span>
                  </div>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{
                      width: `${m.perf}%`,
                      background: m.perf > 90 ? 'var(--ok)' : m.perf > 75 ? 'var(--a)' : 'var(--warn)',
                    }}/>
                  </div>
                </div>
              )}

              {isDownloading && (
                <div style={{ marginBottom: 10 }}>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{ width: `${dl}%` }}/>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                    <span>Descargando... {m.size}</span>
                    <span style={{ color: 'var(--a)', fontWeight: 700 }}>{dl}%</span>
                  </div>
                </div>
              )}

              <button
                style={{
                  width: '100%', padding: 8, borderRadius: 8,
                  fontSize: 11, fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif',
                  cursor: estadoActual === 'active' ? 'default' : 'pointer', border: 'none',
                  background: estadoActual === 'ready' ? 'var(--p)' : estadoActual === 'active' ? 'rgba(16,185,129,.1)' : isDownloading ? 'var(--sur2)' : 'var(--p)',
                  color: estadoActual === 'active' ? 'var(--ok)' : isDownloading ? 'var(--muted)' : 'white',
                  ...(estadoActual === 'active' ? { border: '1px solid rgba(16,185,129,.25)' } : {}),
                }}
                onClick={() => estadoActual === 'ready' && simularDescarga(m.id)}
                disabled={isDownloading || estadoActual === 'active'}
              >
                {estadoActual === 'ready' ? '⬇ Descargar' : estadoActual === 'active' ? '✓ Instalado y activo' : isDownloading ? 'Descargando...' : '⬇ Descargar'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
