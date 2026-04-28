'use client';

import { useState } from 'react';

type TipoCampo = 'string' | 'number' | 'boolean' | 'date' | 'enum';

interface Campo {
  id: string;
  nombre: string;
  tipo: TipoCampo;
  requerido: boolean;
  descripcion: string;
  opciones?: string[];
}

const CAMPO_INICIAL: Campo = {
  id: crypto.randomUUID(),
  nombre: '',
  tipo: 'string',
  requerido: true,
  descripcion: '',
};

const TIPOS: { val: TipoCampo; label: string; icon: string }[] = [
  { val: 'string', label: 'Texto', icon: 'Aa' },
  { val: 'number', label: 'Número', icon: '#' },
  { val: 'boolean', label: 'Booleano', icon: '◉' },
  { val: 'date', label: 'Fecha', icon: '📅' },
  { val: 'enum', label: 'Enum', icon: '≡' },
];

const ESQUEMAS_PREDEFINIDOS = [
  { id: 'marangatu_compras', nombre: 'Marangatu Compras', campos: 18, tipo: 'marangatu_compras' },
  { id: 'marangatu_ventas', nombre: 'Marangatu Ventas', campos: 16, tipo: 'marangatu_ventas' },
  { id: 'irp_rsp', nombre: 'IRP-RSP Honorarios', campos: 12, tipo: 'irp_rsp' },
];

export default function SchemaBuilderPage() {
  const [campos, setCampos] = useState<Campo[]>([
    { id: '1', nombre: 'rucEmisor', tipo: 'string', requerido: true, descripcion: 'RUC del emisor con dígito verificador' },
    { id: '2', nombre: 'numeroFactura', tipo: 'string', requerido: true, descripcion: 'Formato: 001-001-0000001' },
    { id: '3', nombre: 'montoTotal', tipo: 'number', requerido: true, descripcion: 'Monto total en guaraníes' },
    { id: '4', nombre: 'condicionVenta', tipo: 'enum', requerido: true, descripcion: 'Contado o crédito', opciones: ['CONTADO', 'CREDITO'] },
  ]);
  const [nombreEsquema, setNombreEsquema] = useState('Mi esquema personalizado');
  const [editando, setEditando] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const agregarCampo = () => {
    const nuevo = { ...CAMPO_INICIAL, id: crypto.randomUUID() };
    setCampos(prev => [...prev, nuevo]);
    setEditando(nuevo.id);
  };

  const actualizarCampo = (id: string, partial: Partial<Campo>) => {
    setCampos(prev => prev.map(c => c.id === id ? { ...c, ...partial } : c));
  };

  const eliminarCampo = (id: string) => {
    setCampos(prev => prev.filter(c => c.id !== id));
    if (editando === id) setEditando(null);
  };

  const guardar = async () => {
    setGuardado(false);
    await new Promise(r => setTimeout(r, 600));
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const previewZod = () => {
    const lines = campos.map(c => {
      let def = `z.${c.tipo === 'date' ? 'string()' : c.tipo === 'enum' ? `enum([${(c.opciones ?? []).map(o => `'${o}'`).join(', ')}])` : `${c.tipo}()`}`;
      if (!c.requerido) def += '.optional()';
      return `  ${c.nombre}: ${def},`;
    });
    return `z.object({\n${lines.join('\n')}\n})`;
  };

  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Editor */}
        <div>
          {/* Header */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>
                  Nombre del esquema
                </div>
                <input
                  value={nombreEsquema}
                  onChange={e => setNombreEsquema(e.target.value)}
                  style={{
                    width: '100%', padding: '6px 0', border: 'none', borderBottom: '2px solid var(--a)',
                    fontSize: 14, fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--p)',
                    background: 'transparent', outline: 'none',
                  }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ fontSize: 11, padding: '8px 20px' }}
                onClick={guardar}
              >
                {guardado ? '✓ Guardado' : '💾 Guardar'}
              </button>
            </div>
          </div>

          {/* Fields list */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Campos ({campos.length})
              </span>
              <button
                onClick={agregarCampo}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: '1px dashed var(--a)',
                  background: 'rgba(0,200,150,.06)', color: 'var(--a)', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + Agregar campo
              </button>
            </div>
            <div>
              {campos.map((c, idx) => (
                <div key={c.id}>
                  <div
                    draggable
                    onDragStart={() => setDragIdx(idx)}
                    onDragOver={e => { e.preventDefault(); }}
                    onDrop={() => {
                      if (dragIdx === null || dragIdx === idx) return;
                      const arr = [...campos];
                      const [moved] = arr.splice(dragIdx, 1);
                      arr.splice(idx, 0, moved);
                      setCampos(arr);
                      setDragIdx(null);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 18px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                      background: editando === c.id ? 'rgba(0,200,150,.04)' : undefined,
                      transition: 'background .15s',
                    }}
                    onClick={() => setEditando(editando === c.id ? null : c.id)}
                  >
                    <span style={{ fontSize: 12, color: 'var(--muted)', cursor: 'grab' }}>⠿</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                      padding: '2px 7px', borderRadius: 4,
                      background: 'var(--p)18', color: 'var(--p)',
                      border: '1px solid var(--p)33', minWidth: 40, textAlign: 'center',
                    }}>
                      {TIPOS.find(t => t.val === c.tipo)?.icon}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--p)', flex: 1, fontFamily: 'JetBrains Mono, monospace' }}>
                      {c.nombre || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>sin nombre</span>}
                    </span>
                    {c.requerido && <span className="bdg" style={{ fontSize: 9, color: 'var(--err)', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)' }}>req.</span>}
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{c.descripcion.slice(0, 30)}{c.descripcion.length > 30 ? '…' : ''}</span>
                    <button
                      onClick={e => { e.stopPropagation(); eliminarCampo(c.id); }}
                      style={{ padding: '2px 6px', borderRadius: 4, border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}
                    >
                      ×
                    </button>
                  </div>

                  {editando === c.id && (
                    <div style={{ padding: '14px 18px', background: 'rgba(0,200,150,.03)', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>Nombre</div>
                          <input
                            value={c.nombre}
                            onChange={e => actualizarCampo(c.id, { nombre: e.target.value })}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--p)' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>Tipo</div>
                          <select
                            value={c.tipo}
                            onChange={e => actualizarCampo(c.id, { tipo: e.target.value as TipoCampo })}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, color: 'var(--p)', background: 'white' }}
                          >
                            {TIPOS.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', paddingBottom: 6 }}>
                            <input
                              type="checkbox"
                              checked={c.requerido}
                              onChange={e => actualizarCampo(c.id, { requerido: e.target.checked })}
                            />
                            <span style={{ fontSize: 11, color: 'var(--p)' }}>Requerido</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>Descripción</div>
                        <input
                          value={c.descripcion}
                          onChange={e => actualizarCampo(c.id, { descripcion: e.target.value })}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, color: 'var(--p)' }}
                        />
                      </div>
                      {c.tipo === 'enum' && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>Opciones (separadas por coma)</div>
                          <input
                            value={(c.opciones ?? []).join(', ')}
                            onChange={e => actualizarCampo(c.id, { opciones: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--p)' }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Predefined schemas */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Esquemas predefinidos
              </span>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              {ESQUEMAS_PREDEFINIDOS.map((e, i) => (
                <div key={i} className="stat-row" style={{ cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--p)' }}>{e.nombre}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{e.campos} campos</div>
                  </div>
                  <button style={{ fontSize: 10, color: 'var(--a)', fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    Usar →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Zod preview */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Preview Zod
              </span>
              <span className="bdg" style={{ fontSize: 9, color: 'var(--a)', background: 'rgba(0,200,150,.1)', border: '1px solid rgba(0,200,150,.25)' }}>TypeScript</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <pre style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--muted)',
                background: 'var(--sur2)', borderRadius: 8, padding: '12px', lineHeight: 1.7,
                overflow: 'auto', margin: 0,
                borderLeft: '3px solid var(--a)',
              }}>
                {previewZod()}
              </pre>
            </div>
          </div>

          {/* Usage info */}
          <div className="card">
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>
                El esquema se guarda en Neon y es utilizado por Instructor.js para validar la salida del modelo LLM. Máx. 3 reintentos con corrección automática.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
