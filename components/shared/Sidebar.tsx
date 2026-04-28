'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from './Logo';

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',           icon: '⊞', section: 'modulos',    badge: null },
  { href: '/hub',         label: 'AI Hub',               icon: '⬇', section: 'modulos',    badge: 'free' },
  { href: '/marangatu',   label: 'Marangatu Generator',  icon: '📋', section: 'modulos',    badge: 'free' },
  { href: '/rag',         label: 'Consultar DNIT',       icon: '🔍', section: 'modulos',    badge: 'free' },
  { href: '/playground/schema',    label: 'Schema Builder',    icon: '⚙',  section: 'playground', badge: 'pro' },
  { href: '/playground/rules',     label: 'Logic Engine',      icon: '⚡', section: 'playground', badge: 'pro' },
  { href: '/playground/templates', label: 'Template Generator',icon: '📊', section: 'playground', badge: 'pro' },
  { href: '/playground/knowledge', label: 'Base de Conocimiento', icon: '📚', section: 'playground', badge: 'pro' },
];

const SECTIONS = [
  { id: 'modulos',    label: 'Módulos' },
  { id: 'playground', label: 'AI Playground' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{
          padding: '20px 18px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          textDecoration: 'none',
        }}
      >
        <div style={{
          width: 32, height: 32, background: 'var(--a)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <LogoIcon size={18} />
        </div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: 'white' }}>
          TaxLens <span style={{ color: 'rgba(0,200,150,0.9)' }}>PY</span>
        </span>
      </Link>

      {/* Nav sections */}
      {SECTIONS.map(section => {
        const items = NAV_ITEMS.filter(n => n.section === section.id);
        return (
          <div key={section.id} style={{ padding: '14px 10px 4px' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 600,
              color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0 8px', marginBottom: 4,
            }}>
              {section.label}
            </div>
            {items.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8,
                    textDecoration: 'none', marginBottom: 1,
                    background: isActive ? 'rgba(0,200,150,0.15)' : 'transparent',
                    transition: 'background 0.15s',
                    position: 'relative',
                  }}
                >
                  {isActive && (
                    <span style={{
                      position: 'absolute', left: 0, top: 5, bottom: 5,
                      width: 3, background: 'var(--a)', borderRadius: '0 3px 3px 0',
                    }}/>
                  )}
                  <span style={{ fontSize: 14, flexShrink: 0, opacity: isActive ? 1 : 0.65, width: 18, textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                    flex: 1,
                  }}>
                    {item.label}
                  </span>
                  {item.badge === 'free' && (
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 600,
                      padding: '2px 7px', borderRadius: 100,
                      background: 'rgba(0,200,150,0.2)', color: 'var(--a)',
                    }}>GRATIS</span>
                  )}
                  {item.badge === 'pro' && (
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 600,
                      padding: '2px 7px', borderRadius: 100,
                      background: 'rgba(245,158,11,0.2)', color: '#F59E0B',
                    }}>PRO</span>
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}

      <div style={{ flex: 1 }}/>

      {/* OPFS storage indicator */}
      <div style={{ padding: '0 12px 10px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 5,
        }}>
          <span>Almacenamiento OPFS</span>
          <span>— / 10 GB</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <div style={{ height: '100%', background: 'var(--a)', borderRadius: 2, width: '28%' }}/>
        </div>
      </div>

      {/* User */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--a), var(--p2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            TX
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Mi cuenta
            </div>
            <div style={{ fontSize: 10, color: 'var(--a)', fontFamily: 'JetBrains Mono, monospace' }}>
              ✦ Plan Free
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
