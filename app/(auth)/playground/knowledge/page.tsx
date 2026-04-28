'use client';

import { useState, useRef } from 'react';

interface Documento {
  id: string;
  nombre: string;
  tipo: 'pdf' | 'docx' | 'txt';
  tamanio: string;
  chunks: number;
  estado: 'indexado' | 'indexando' | 'error';
  fecha: string;
}

const DOCS_MOCK: Documento[] = [
  { id: 'd1', nombre: 'Circular_SET_2025_03.pdf', tipo: 'pdf', tamanio: '284 KB', chunks: 42, estado: 'indexado', fecha: '10/06/2025' },
  { id: 'd2', nombre: 'Contrato_Arrendamiento_Local.docx', tipo: 'docx', tamanio: '56 KB', chunks: 18, estado: 'indexado', fecha: '05/06/2025' },
  { id: 'd3', nombre: 'Politica_Gastos_Internos.txt', tipo: 'txt', tamanio: '12 KB', chunks: 8, estado: 'indexado', fecha: '01/06/2025' },
];

const TIPO_ICON: Record<string, string> = { pdf: '📄', docx: '📝', txt: '📃' };
const TIPO_COLOR: Record<string, string> = { pdf: '#EF4444', docx: '#3B82F6', txt: 'var(--muted)' };

const MAX_DOCS = 20;
const MAX_MB = 50;

export default function KnowledgePage() {
  const [docs, setDocs] = useState<Documento[]>(DOCS_MOCK);
  const [dragOver, setDragOver] = useState(false);
  const [indexando, setIndexando] = useState<Record<string, number>>({});
  const [queryTest, setQueryTest] = useState('');
  const [testeando, setTesteando] = useState(false);
  const [resultadoTest, setResultadoTest] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalChunks = docs.filter(d => d.estado === 'indexado').reduce((a, d) => a + d.chunks, 0);
  const usadoMB = docs.length * 1.8;

  const simularIndexado = (nombre: string, tipo: string) => {
    const id = crypto.randomUUID();
    setDocs(prev => [...prev, {
      id, nombre, tipo: tipo as Documento['tipo'],
      tamanio: `${Math.round(Math.random() * 200 + 20)} KB`,
      chunks: 0, estado: 'indexando', fecha: new Date().toLocaleDateString('es-PY'),
    }]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        clearInterval(interval);
        const chunks = Math.round(Math.random() * 50 + 10);
        setDocs(prev => prev.map(d => d.id === id ? { ...d, estado: 'indexado', chunks } : d));
        setIndexando(prev => { const s = { ...prev }; delete s[id]; return s; });
      } else {
        setIndexando(prev => ({ ...prev, [id]: Math.round(progress) }));
      }
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'txt';
      simularIndexado(file.name, ['pdf', 'docx', 'txt'].includes(ext) ? ext : 'txt');
    });
  };

  const eliminar = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const testear = () => {
    if (!queryTest.trim()) return;
    setTesteando(true);
    setResultadoTest(null);
    setTimeout(() => {
      setTesteando(false);
      setResultadoTest(`Se encontraron 3 fragmentos relevantes en tu base personalizada con similitud coseno ≥ 0.78. Los resultados se fusionan con la base DNIT en proporción 40%/60%.`);
    }, 900);
  };

  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* Main */}
        <div>
          {/* Usage bar */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>Almacenamiento OPFS utilizado</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--p)' }}>
                    {usadoMB.toFixed(1)} MB / {MAX_MB} MB
                  </span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{
                    width: `${(usadoMB / MAX_MB) * 100}%`,
                    background: usadoMB / MAX_MB > 0.8 ? 'var(--warn)' : 'var(--a)',
                  }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>Documentos</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: 'var(--p)' }}>
                  {docs.length} / {MAX_DOCS}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>Chunks</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: 'var(--a)' }}>
                  {totalChunks}
                </div>
              </div>
            </div>
          </div>

          {/* Upload zone */}
          <div
            className={`upload-zone${dragOver ? ' upload-zone-drag' : ''}`}
            style={{ marginBottom: 14, padding: '22px 24px' }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef} type="file" multiple accept=".pdf,.docx,.txt" style={{ display: 'none' }}
              onChange={e => { Array.from(e.target.files ?? []).forEach(f => { const ext = f.name.split('.').pop()?.toLowerCase() ?? 'txt'; simularIndexado(f.name, ext); }); }}
            />
            <div style={{ fontSize: 24, marginBottom: 8 }}>📂</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', marginBottom: 4 }}>
              Arrastrá tus documentos aquí
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              PDF, DOCX, TXT · máx. {MAX_MB} MB total · {MAX_DOCS} documentos
            </div>
          </div>

          {/* Document list */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Documentos indexados
              </span>
            </div>
            {docs.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: 11 }}>
                Aún no hay documentos. Subí tu primer archivo arriba.
              </div>
            )}
            {docs.map(doc => (
              <div key={doc.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 18 }}>{TIPO_ICON[doc.tipo]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--p)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.nombre}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, display: 'flex', gap: 10 }}>
                    <span>{doc.tamanio}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{doc.fecha}</span>
                    {doc.estado === 'indexado' && (
                      <span style={{ color: 'var(--ok)' }}>✓ {doc.chunks} chunks</span>
                    )}
                  </div>
                  {doc.estado === 'indexando' && indexando[doc.id] !== undefined && (
                    <div style={{ marginTop: 6 }}>
                      <div className="prog-bar">
                        <div className="prog-fill" style={{ width: `${indexando[doc.id]}%` }} />
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--a)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                        Indexando... {indexando[doc.id]}%
                      </div>
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase',
                  background: TIPO_COLOR[doc.tipo] + '18',
                  color: TIPO_COLOR[doc.tipo],
                  border: `1px solid ${TIPO_COLOR[doc.tipo]}33`,
                  flexShrink: 0,
                }}>
                  {doc.tipo}
                </span>
                <button
                  onClick={() => eliminar(doc.id)}
                  style={{
                    padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,.3)',
                    background: 'rgba(239,68,68,.08)', color: 'var(--err)', fontSize: 10, cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  disabled={doc.estado === 'indexando'}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Test search */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Probar búsqueda
              </span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <input
                value={queryTest}
                onChange={e => setQueryTest(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && testear()}
                placeholder="Consultá tu base personalizada..."
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)',
                  fontSize: 11, color: 'var(--p)', marginBottom: 8,
                }}
              />
              <button
                className="btn btn-primary"
                style={{ width: '100%', fontSize: 11, padding: '7px' }}
                onClick={testear}
                disabled={testeando || !queryTest.trim()}
              >
                {testeando ? '🔍 Buscando...' : '🔍 Probar'}
              </button>
              {resultadoTest && (
                <div style={{
                  marginTop: 10, padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(0,200,150,.08)', border: '1px solid rgba(0,200,150,.25)',
                  fontSize: 10, color: 'var(--p)', lineHeight: 1.6,
                }}>
                  {resultadoTest}
                </div>
              )}
            </div>
          </div>

          {/* RAG fusion info */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Fusión RAG dual
              </span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ flex: 3, background: 'var(--p)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,.7)', marginBottom: 2 }}>DNIT</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: 'white' }}>60%</div>
                </div>
                <div style={{ flex: 2, background: 'var(--a)', borderRadius: 6, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'rgba(0,0,0,.6)', marginBottom: 2 }}>Custom</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,.8)' }}>40%</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>
                Los resultados de tu base se fusionan con la base DNIT por similitud coseno. Top 8 chunks al modelo LLM.
              </div>
            </div>
          </div>

          {/* Formats supported */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Formatos soportados
              </span>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              {[
                { ext: 'PDF', desc: 'Texto extraído (no escaneos)', color: '#EF4444' },
                { ext: 'DOCX', desc: 'Word 2007+', color: '#3B82F6' },
                { ext: 'TXT', desc: 'Texto plano UTF-8', color: 'var(--muted)' },
              ].map((f, i) => (
                <div key={i} className="stat-row">
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 4, background: f.color + '18',
                    color: f.color, border: `1px solid ${f.color}33`,
                  }}>
                    {f.ext}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--muted)', flex: 1, textAlign: 'right' }}>{f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
