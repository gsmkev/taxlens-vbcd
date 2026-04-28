'use client';

import { useState } from 'react';

interface ResultadoRag {
  id: string;
  titulo: string;
  fuente: string;
  articulo: string;
  texto: string;
  score: number;
  tipo: 'ley' | 'decreto' | 'resolucion';
}

const SUGERENCIAS = [
  '¿Qué documentos respaldatorios exige la SET para crédito fiscal IVA?',
  '¿Cuál es la tasa de IVA para servicios de transporte de pasajeros?',
  '¿Cómo se calculan los anticipos del IRP-RSP?',
  '¿Qué plazo tiene la SET para notificar una fiscalización?',
  'Requisitos del timbrado electrónico (SIFEN)',
  '¿Cuáles son las tasas del IRP para personas físicas?',
];

const RESULTADOS_MOCK: ResultadoRag[] = [
  {
    id: 'r1',
    titulo: 'Crédito fiscal IVA — Condiciones de cómputo',
    fuente: 'Ley 6380/2019',
    articulo: 'Art. 88',
    texto: 'Darán derecho al crédito fiscal los impuestos que les hubieren sido facturados por sus adquisiciones de bienes, servicios o importaciones, siempre que correspondan a operaciones necesarias para el desarrollo de actividades gravadas. El crédito fiscal solo puede computarse si la factura cumple con los requisitos formales establecidos por la Administración Tributaria.',
    score: 0.94,
    tipo: 'ley',
  },
  {
    id: 'r2',
    titulo: 'Documentos respaldatorios — Requisitos mínimos',
    fuente: 'RG SET 65/2005',
    articulo: 'Art. 4 y 5',
    texto: 'Las facturas deben contener: RUC del emisor y receptor, número de timbrado vigente, número correlativo de factura, fecha de emisión, descripción de la operación, monto gravado por tasa, IVA discriminado y monto total. La omisión de cualquiera de estos elementos inhabilita el cómputo del crédito fiscal.',
    score: 0.89,
    tipo: 'resolucion',
  },
  {
    id: 'r3',
    titulo: 'Vigencia del timbrado — Plazos y renovación',
    fuente: 'SET Res. 56/2020',
    articulo: 'Art. 8',
    texto: 'El timbrado tiene una vigencia de 1 año desde su otorgamiento. El contribuyente deberá solicitar la renovación con no menos de 30 días de anticipación al vencimiento. Las facturas emitidas con timbrado vencido no generan crédito fiscal para el adquirente.',
    score: 0.82,
    tipo: 'resolucion',
  },
  {
    id: 'r4',
    titulo: 'Base imponible IVA — Determinación',
    fuente: 'Decreto 3107/2019',
    articulo: 'Art. 14',
    texto: 'La base imponible del IVA está constituida por el precio de venta neto del bien o del servicio, sin incluir el propio impuesto. Cuando el precio incluye el impuesto, la base se obtiene dividiendo el precio total por 1,10 para la tasa del 10% o por 1,05 para la tasa del 5%.',
    score: 0.76,
    tipo: 'decreto',
  },
];

const BASE_CONOCIMIENTO = [
  { nombre: 'Ley 6380/2019 — Modernización Tributaria', estado: 'activo', chunks: 284, fecha: 'Q1 2025' },
  { nombre: 'Decreto 3107/2019 — Reg. IVA', estado: 'activo', chunks: 156, fecha: 'Q1 2025' },
  { nombre: 'Decreto 3182/2019 — Reg. IRE', estado: 'activo', chunks: 198, fecha: 'Q1 2025' },
  { nombre: 'Decreto 3184/2019 — Reg. IRP', estado: 'activo', chunks: 142, fecha: 'Q1 2025' },
  { nombre: 'RG SET 65/2005 — Documentos', estado: 'activo', chunks: 88, fecha: 'Q1 2025' },
  { nombre: 'SET Res. 56/2020 — Timbrado', estado: 'activo', chunks: 34, fecha: 'Q1 2025' },
];

const COLOR_TIPO: Record<string, string> = {
  ley: 'var(--p)',
  decreto: 'var(--a)',
  resolucion: '#F59E0B',
};

export default function RagPage() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<ResultadoRag[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const buscar = (q: string) => {
    const texto = q.trim();
    if (!texto) return;
    setQuery(texto);
    setBuscando(true);
    setBuscado(false);
    setTimeout(() => {
      setResultados(RESULTADOS_MOCK);
      setBuscando(false);
      setBuscado(true);
    }, 900);
  };

  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      {/* Search bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', marginBottom: 12 }}>
            Consulta la base normativa DNIT
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar(query)}
              placeholder="Ej: ¿Qué documentos exige la SET para el crédito fiscal IVA?"
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                fontSize: 13, color: 'var(--p)', background: 'var(--sur2)', outline: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            />
            <button
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: 12, borderRadius: 10, minWidth: 90 }}
              onClick={() => buscar(query)}
              disabled={buscando || !query.trim()}
            >
              {buscando ? '...' : '🔍 Buscar'}
            </button>
          </div>
        </div>
        {/* Quick suggestions */}
        <div style={{ padding: '0 18px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUGERENCIAS.map((s, i) => (
            <button key={i} onClick={() => buscar(s)} style={{
              padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)',
              background: 'white', fontSize: 10, color: 'var(--muted)', cursor: 'pointer',
              transition: 'all .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--a)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
        {/* Results */}
        <div>
          {!buscado && !buscando && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p)', marginBottom: 6 }}>Base DNIT Knowledge v2025-Q1</div>
              <div style={{ fontSize: 11 }}>Ley 6380, Decretos 3107/3182/3184 y resoluciones vigentes</div>
            </div>
          )}

          {buscando && (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: 11, color: 'var(--a)', fontFamily: 'JetBrains Mono, monospace' }}>
                Buscando en {BASE_CONOCIMIENTO.reduce((a, b) => a + b.chunks, 0).toLocaleString('es-PY')} chunks...
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="prog-bar" style={{ maxWidth: 300, margin: '0 auto' }}>
                  <div className="prog-fill" style={{ width: '60%', animation: 'pulse 1s infinite' }} />
                </div>
              </div>
            </div>
          )}

          {buscado && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
                {resultados.length} resultados para "<strong style={{ color: 'var(--p)' }}>{query}</strong>"
              </div>
              {resultados.map(r => (
                <div key={r.id} className="rag-result" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', marginBottom: 4 }}>
                        {r.titulo}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                          padding: '2px 7px', borderRadius: 4,
                          background: `${COLOR_TIPO[r.tipo]}18`,
                          color: COLOR_TIPO[r.tipo],
                          border: `1px solid ${COLOR_TIPO[r.tipo]}33`,
                        }}>
                          {r.fuente}
                        </span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--muted)', padding: '2px 7px', borderRadius: 4, background: 'var(--sur2)', border: '1px solid var(--border)' }}>
                          {r.articulo}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>relevancia</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 48, height: 4, background: 'var(--sur2)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 2,
                            width: `${r.score * 100}%`,
                            background: r.score >= 0.9 ? 'var(--ok)' : r.score >= 0.75 ? 'var(--a)' : 'var(--warn)',
                          }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--p)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {Math.round(r.score * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                    {r.texto}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Knowledge base panel */}
        <div>
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Base de conocimiento
              </span>
              <span className="bdg bdg-ok" style={{ fontSize: 9 }}>v2025-Q1</span>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              {BASE_CONOCIMIENTO.map((doc, i) => (
                <div key={i} className="stat-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--p)', lineHeight: 1.3 }}>{doc.nombre}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                      {doc.chunks} chunks · {doc.fecha}
                    </div>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)', flexShrink: 0 }} />
                </div>
              ))}
              <div className="stat-row" style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 10 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>Total chunks</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, color: 'var(--p)' }}>
                  {BASE_CONOCIMIENTO.reduce((a, b) => a + b.chunks, 0).toLocaleString('es-PY')}
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Base personalizada
              </span>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div className="paywall" style={{ padding: '16px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--p)', marginBottom: 4 }}>
                  AI Playground
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 10 }}>
                  Agregá tus propios documentos (circulares, contratos, resoluciones internas) al índice RAG.
                </div>
                <button className="btn btn-primary" style={{ fontSize: 10, padding: '6px 14px' }}>
                  Activar Playground
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
