'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':              { title: 'Dashboard',            subtitle: 'Junio 2025' },
  '/hub':                    { title: 'AI Hub',               subtitle: 'Gestión de modelos e inteligencia' },
  '/marangatu':              { title: 'Marangatu Generator',  subtitle: 'Libros de IVA · IRE · IRP-RSP' },
  '/rag':                    { title: 'Consultar DNIT',       subtitle: 'Base de conocimiento legal' },
  '/playground/schema':      { title: 'Schema Builder',       subtitle: 'AI Playground' },
  '/playground/rules':       { title: 'Logic Engine',         subtitle: 'AI Playground' },
  '/playground/templates':   { title: 'Template Generator',   subtitle: 'AI Playground' },
  '/playground/knowledge':   { title: 'Base de Conocimiento', subtitle: 'AI Playground' },
};

export function Topbar() {
  const pathname = usePathname();
  const meta = PAGE_META[pathname] ?? { title: 'TaxLens PY', subtitle: '' };

  return (
    <div style={{
      height: 54, flexShrink: 0,
      background: 'white', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--p)' }}>
          {meta.title}
        </span>
        {meta.subtitle && (
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 2 }}>
            {' · '}{meta.subtitle}
          </span>
        )}
      </div>

      <div style={{ flex: 1 }}/>

      {/* Período activo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 12px', background: 'var(--sur2)', border: '1px solid var(--border)',
        borderRadius: 8, fontSize: 12, fontWeight: 500, color: 'var(--muted)', cursor: 'pointer',
      }}>
        Período: <span style={{ color: 'var(--p)', fontWeight: 600 }}>Jun 2025</span> ▾
      </div>

      {/* Acciones contextuales por página */}
      {pathname === '/marangatu' && (
        <>
          <button className="btn btn-ghost" style={{ fontSize: 11, padding: '6px 12px' }}>
            ↓ CSV Marangatu
          </button>
          <button className="btn btn-accent" style={{ fontSize: 11, padding: '6px 12px' }}>
            ↓ Excel
          </button>
        </>
      )}
      {pathname === '/dashboard' && (
        <Link href="/marangatu">
          <button className="btn btn-primary" style={{ fontSize: 11, padding: '6px 12px' }}>
            + Nueva sesión
          </button>
        </Link>
      )}
      {pathname === '/hub' && (
        <button className="btn btn-ghost" style={{ fontSize: 11, padding: '6px 12px' }}>
          ↻ Buscar actualizaciones
        </button>
      )}

      {/* Notificaciones */}
      <div style={{ position: 'relative', cursor: 'pointer' }}>
        <span style={{ fontSize: 17, color: 'var(--muted)' }}>🔔</span>
        <div style={{
          position: 'absolute', top: -1, right: -1,
          width: 7, height: 7, background: 'var(--err)',
          borderRadius: '50%', border: '1.5px solid white',
        }}/>
      </div>
    </div>
  );
}
