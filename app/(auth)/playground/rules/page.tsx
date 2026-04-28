'use client';

import { useState } from 'react';

type Operador = 'igual' | 'mayor' | 'menor' | 'contiene' | 'no_contiene' | 'es_verdadero' | 'es_falso';
type Accion = 'marcar_revision' | 'aplicar_etiqueta' | 'imputar_iva' | 'bloquear' | 'alertar';

interface Condicion {
  campo: string;
  operador: Operador;
  valor: string;
}

interface Regla {
  id: string;
  nombre: string;
  activa: boolean;
  condiciones: Condicion[];
  accion: Accion;
  valorAccion: string;
  prioridad: number;
}

const CAMPOS_DISPONIBLES = [
  'montoTotal', 'rucEmisor', 'condicionVenta', 'imputaIva', 'imputaIre',
  'confianza', 'timbrado', 'concepto', 'iva10', 'iva5', 'exentas',
];

const OPERADORES: { val: Operador; label: string }[] = [
  { val: 'igual', label: 'es igual a' },
  { val: 'mayor', label: 'es mayor que' },
  { val: 'menor', label: 'es menor que' },
  { val: 'contiene', label: 'contiene' },
  { val: 'no_contiene', label: 'no contiene' },
  { val: 'es_verdadero', label: 'es verdadero' },
  { val: 'es_falso', label: 'es falso' },
];

const ACCIONES: { val: Accion; label: string; color: string }[] = [
  { val: 'marcar_revision', label: 'Marcar para revisión', color: 'var(--warn)' },
  { val: 'aplicar_etiqueta', label: 'Aplicar etiqueta', color: 'var(--a)' },
  { val: 'imputar_iva', label: 'Imputar IVA', color: 'var(--p)' },
  { val: 'bloquear', label: 'Bloquear factura', color: 'var(--err)' },
  { val: 'alertar', label: 'Mostrar alerta', color: '#F59E0B' },
];

const REGLAS_MOCK: Regla[] = [
  {
    id: 'r1', nombre: 'Monto alto — revisión obligatoria', activa: true, prioridad: 1,
    condiciones: [{ campo: 'montoTotal', operador: 'mayor', valor: '5000000' }],
    accion: 'marcar_revision', valorAccion: 'Monto superior a ₲ 5M',
  },
  {
    id: 'r2', nombre: 'Baja confianza OCR', activa: true, prioridad: 2,
    condiciones: [{ campo: 'confianza', operador: 'menor', valor: '0.75' }],
    accion: 'marcar_revision', valorAccion: 'Confianza OCR < 75%',
  },
  {
    id: 'r3', nombre: 'Etiqueta transporte', activa: true, prioridad: 3,
    condiciones: [{ campo: 'concepto', operador: 'contiene', valor: 'transporte' }],
    accion: 'aplicar_etiqueta', valorAccion: 'TRANSPORTE',
  },
  {
    id: 'r4', nombre: 'Bloquear sin IVA discriminado', activa: false, prioridad: 4,
    condiciones: [
      { campo: 'iva10', operador: 'igual', valor: '0' },
      { campo: 'iva5', operador: 'igual', valor: '0' },
    ],
    accion: 'bloquear', valorAccion: '',
  },
];

export default function RulesPage() {
  const [reglas, setReglas] = useState<Regla[]>(REGLAS_MOCK);
  const [expandida, setExpandida] = useState<string | null>(null);
  const [simulando, setSimulando] = useState(false);
  const [resultadoSim, setResultadoSim] = useState<string | null>(null);

  const toggleActiva = (id: string) => {
    setReglas(prev => prev.map(r => r.id === id ? { ...r, activa: !r.activa } : r));
  };

  const simular = () => {
    setSimulando(true);
    setTimeout(() => {
      setSimulando(false);
      setResultadoSim('3 facturas afectadas: 1 bloqueada, 1 marcada para revisión, 1 etiquetada como TRANSPORTE');
    }, 800);
  };

  const nuevaRegla = () => {
    const nueva: Regla = {
      id: crypto.randomUUID(),
      nombre: 'Nueva regla',
      activa: true,
      prioridad: reglas.length + 1,
      condiciones: [{ campo: 'montoTotal', operador: 'mayor', valor: '' }],
      accion: 'marcar_revision',
      valorAccion: '',
    };
    setReglas(prev => [...prev, nueva]);
    setExpandida(nueva.id);
  };

  return (
    <div style={{ padding: '22px 26px' }} className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* Rules list */}
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--p)', flex: 1 }}>
                Reglas lógicas ({reglas.filter(r => r.activa).length} activas)
              </span>
              <button
                onClick={nuevaRegla}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: '1px dashed var(--a)',
                  background: 'rgba(0,200,150,.06)', color: 'var(--a)', fontSize: 11, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + Nueva regla
              </button>
            </div>

            {reglas.map((regla, idx) => {
              const accionInfo = ACCIONES.find(a => a.val === regla.accion)!;
              return (
                <div key={regla.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
                      cursor: 'pointer', opacity: regla.activa ? 1 : 0.5,
                      background: expandida === regla.id ? 'rgba(0,200,150,.03)' : undefined,
                    }}
                    onClick={() => setExpandida(expandida === regla.id ? null : regla.id)}
                  >
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                      color: 'var(--muted)', width: 16, textAlign: 'center',
                    }}>
                      {regla.prioridad}
                    </span>
                    <div
                      onClick={e => { e.stopPropagation(); toggleActiva(regla.id); }}
                      style={{
                        width: 32, height: 18, borderRadius: 9, cursor: 'pointer',
                        background: regla.activa ? 'var(--a)' : 'var(--border)',
                        position: 'relative', transition: 'background .2s', flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2, left: regla.activa ? 16 : 2,
                        width: 14, height: 14, borderRadius: '50%', background: 'white',
                        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                      }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--p)' }}>{regla.nombre}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                        {regla.condiciones.length} condición{regla.condiciones.length !== 1 ? 'es' : ''} →{' '}
                        <span style={{ color: accionInfo?.color }}>{accionInfo?.label}</span>
                        {regla.valorAccion && <span> · "{regla.valorAccion}"</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)', transform: expandida === regla.id ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }}>
                      ▾
                    </span>
                  </div>

                  {expandida === regla.id && (
                    <div style={{ padding: '12px 18px 16px 48px', background: 'rgba(0,200,150,.02)', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'JetBrains Mono, monospace' }}>
                        Condiciones (todas deben cumplirse — AND)
                      </div>
                      {regla.condiciones.map((cond, ci) => (
                        <div key={ci} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                          <select
                            value={cond.campo}
                            onChange={e => setReglas(prev => prev.map(r => r.id === regla.id ? {
                              ...r, condiciones: r.condiciones.map((c, i) => i === ci ? { ...c, campo: e.target.value } : c)
                            } : r))}
                            style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--p)', background: 'white' }}
                          >
                            {CAMPOS_DISPONIBLES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                          <select
                            value={cond.operador}
                            onChange={e => setReglas(prev => prev.map(r => r.id === regla.id ? {
                              ...r, condiciones: r.condiciones.map((c, i) => i === ci ? { ...c, operador: e.target.value as Operador } : c)
                            } : r))}
                            style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 10, color: 'var(--p)', background: 'white' }}
                          >
                            {OPERADORES.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
                          </select>
                          {!['es_verdadero', 'es_falso'].includes(cond.operador) && (
                            <input
                              value={cond.valor}
                              onChange={e => setReglas(prev => prev.map(r => r.id === regla.id ? {
                                ...r, condiciones: r.condiciones.map((c, i) => i === ci ? { ...c, valor: e.target.value } : c)
                              } : r))}
                              style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--p)' }}
                            />
                          )}
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: 'var(--muted)', marginRight: 4 }}>Acción:</span>
                        <select
                          value={regla.accion}
                          onChange={e => setReglas(prev => prev.map(r => r.id === regla.id ? { ...r, accion: e.target.value as Accion } : r))}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 10, color: 'var(--p)', background: 'white' }}
                        >
                          {ACCIONES.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
                        </select>
                        <input
                          value={regla.valorAccion}
                          onChange={e => setReglas(prev => prev.map(r => r.id === regla.id ? { ...r, valorAccion: e.target.value } : r))}
                          placeholder="Valor / etiqueta..."
                          style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 10, color: 'var(--p)' }}
                        />
                        <button
                          onClick={() => setReglas(prev => prev.filter(r => r.id !== regla.id))}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.08)', color: 'var(--err)', fontSize: 10, cursor: 'pointer' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Simulator */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Simulador
              </span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>
                Ejecuta las reglas activas contra las facturas de la sesión actual para ver el impacto antes de aplicar.
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', fontSize: 11, padding: '8px' }}
                onClick={simular}
                disabled={simulando}
              >
                {simulando ? '⏳ Simulando...' : '▶ Simular ahora'}
              </button>
              {resultadoSim && (
                <div style={{
                  marginTop: 10, padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(0,200,150,.08)', border: '1px solid rgba(0,200,150,.25)',
                  fontSize: 11, color: 'var(--p)', lineHeight: 1.5,
                }}>
                  {resultadoSim}
                </div>
              )}
            </div>
          </div>

          {/* Order note */}
          <div className="card">
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 700, color: 'var(--p)', marginBottom: 6 }}>
                Orden de evaluación
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.6 }}>
                Las reglas se evalúan en orden de prioridad. Si una regla de tipo "bloquear" se cumple, las reglas siguientes no se aplican a esa factura.
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <div className="card-head">
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 700, color: 'var(--p)' }}>
                Resumen
              </span>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              {ACCIONES.map(a => {
                const count = reglas.filter(r => r.activa && r.accion === a.val).length;
                if (!count) return null;
                return (
                  <div key={a.val} className="stat-row">
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{a.label}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700,
                      color: a.color,
                    }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
