import Link from 'next/link';
import { LogoIconDark } from '@/components/shared/Logo';

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --primary:#0F2B5B;--primary-light:#1a3f7a;--accent:#00C896;--accent-dark:#009E78;
          --bg:#F5F7FA;--surface:#FFFFFF;--text:#1E293B;--text-muted:#64748B;
          --border:#E2E8F0;--warning:#F59E0B;--error:#EF4444;--success:#10B981;
          --font-display:'Sora',sans-serif;--font-body:'Plus Jakarta Sans',sans-serif;
          --font-mono:'JetBrains Mono',monospace;
        }
        body{font-family:var(--font-body);background:var(--bg);color:var(--text);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}}
        @keyframes scan{0%{top:0%}100%{top:100%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        .fade-up{animation:fadeUp .7s ease both}
        .delay-1{animation-delay:.1s}.delay-2{animation-delay:.2s}.delay-3{animation-delay:.3s}.delay-4{animation-delay:.4s}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 40px;display:flex;align-items:center;justify-content:space-between;background:rgba(245,247,250,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(226,232,240,.6)}
        .logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:700;font-size:20px;color:var(--primary);text-decoration:none}
        .logo-icon{width:36px;height:36px;background:var(--primary);border-radius:10px;display:flex;align-items:center;justify-content:center}
        .logo-py{color:var(--accent)}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-link{font-size:14px;font-weight:500;color:var(--text-muted);text-decoration:none;transition:color .2s;cursor:pointer}
        .nav-link:hover{color:var(--primary)}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;font-family:var(--font-body);cursor:pointer;border:none;transition:all .2s;text-decoration:none}
        .btn-primary{background:var(--primary);color:white}
        .btn-primary:hover{background:var(--primary-light);transform:translateY(-1px);box-shadow:0 4px 12px rgba(15,43,91,.25)}
        .btn-accent{background:var(--accent);color:white}
        .btn-accent:hover{background:var(--accent-dark);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,200,150,.3)}
        .btn-ghost{background:transparent;color:var(--primary);border:1.5px solid var(--border)}
        .btn-ghost:hover{border-color:var(--primary);background:rgba(15,43,91,.04)}
        .btn-lg{padding:14px 28px;font-size:15px;border-radius:10px}
        .hero{min-height:100vh;display:flex;align-items:center;padding:120px 40px 80px;position:relative;overflow:hidden}
        .hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#EBF5FF 0%,#F5F7FA 50%,#E8FDF5 100%);z-index:0}
        .hero-grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(15,43,91,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(15,43,91,.04) 1px,transparent 1px);background-size:48px 48px}
        .hero-content{max-width:1200px;margin:0 auto;width:100%;position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:100px;background:rgba(0,200,150,.1);border:1px solid rgba(0,200,150,.3);font-size:12px;font-weight:600;color:var(--accent-dark);margin-bottom:24px;font-family:var(--font-mono)}
        .badge-dot{width:6px;height:6px;background:var(--accent);border-radius:50%;animation:pulse-dot 2s infinite}
        .hero-title{font-family:var(--font-display);font-size:52px;font-weight:800;line-height:1.1;color:var(--primary);margin-bottom:20px}
        .hero-title-accent{color:var(--accent)}
        .hero-sub{font-size:18px;line-height:1.6;color:var(--text-muted);margin-bottom:36px;max-width:480px}
        .hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:40px}
        .hero-trust{display:flex;align-items:center;gap:16px}
        .trust-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted)}
        .trust-icon{color:var(--accent)}
        .hero-visual{position:relative;animation:float 6s ease-in-out infinite}
        .invoice-mockup{background:white;border-radius:16px;padding:20px;box-shadow:0 20px 60px rgba(15,43,91,.12),0 4px 16px rgba(0,0,0,.06);position:relative;overflow:hidden}
        .scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--accent),transparent);animation:scan 3s ease-in-out infinite;opacity:.8}
        .mockup-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .mockup-title{font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--primary)}
        .mockup-badge{font-size:10px;padding:3px 8px;border-radius:4px;background:rgba(0,200,150,.1);color:var(--accent-dark);font-weight:600;font-family:var(--font-mono)}
        .mockup-row{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)}
        .mockup-row:last-child{border-bottom:none}
        .mockup-label{font-size:11px;color:var(--text-muted);width:90px;flex-shrink:0}
        .mockup-value{font-size:11px;font-family:var(--font-mono);color:var(--text);font-weight:500;flex:1}
        .mockup-conf{font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600}
        .conf-high{background:rgba(16,185,129,.1);color:var(--success)}
        .conf-mid{background:rgba(245,158,11,.1);color:var(--warning)}
        .floating-card{position:absolute;background:white;border-radius:12px;padding:12px 16px;box-shadow:0 8px 24px rgba(0,0,0,.1);font-size:12px;display:flex;align-items:center;gap:10px}
        .card-tr{top:-20px;right:-30px;animation:slideIn 1s .5s both}
        .card-bl{bottom:-20px;left:-30px;animation:slideIn 1s .8s both}
        section{padding:80px 40px}
        .container{max-width:1200px;margin:0 auto}
        .section-label{font-family:var(--font-mono);font-size:11px;font-weight:600;color:var(--accent);letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px}
        .section-title{font-family:var(--font-display);font-size:36px;font-weight:700;color:var(--primary);margin-bottom:16px;line-height:1.2}
        .section-sub{font-size:17px;color:var(--text-muted);line-height:1.6;max-width:560px}
        .how-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:56px}
        .how-step{text-align:center;padding:28px 18px;background:white;border-radius:16px;border:1px solid var(--border);transition:all .3s}
        .how-step:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(15,43,91,.1);border-color:var(--accent)}
        .step-num{width:42px;height:42px;border-radius:12px;background:var(--primary);color:white;font-family:var(--font-display);font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
        .step-icon{font-size:26px;margin-bottom:10px}
        .step-title{font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--primary);margin-bottom:8px}
        .step-desc{font-size:13px;color:var(--text-muted);line-height:1.5}
        .modules-section{background:var(--primary);color:white;padding:80px 40px}
        .modules-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:56px}
        .module-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:30px;transition:all .3s;position:relative;overflow:hidden}
        .module-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,200,150,.08),transparent);opacity:0;transition:opacity .3s}
        .module-card:hover{border-color:var(--accent);transform:translateY(-4px)}
        .module-card:hover::before{opacity:1}
        .module-tag{font-family:var(--font-mono);font-size:10px;font-weight:600;padding:4px 10px;border-radius:100px;margin-bottom:18px;display:inline-block}
        .tag-free{background:rgba(0,200,150,.15);color:var(--accent);border:1px solid rgba(0,200,150,.3)}
        .tag-premium{background:rgba(245,158,11,.15);color:#F59E0B;border:1px solid rgba(245,158,11,.3)}
        .module-icon{font-size:34px;margin-bottom:14px}
        .module-title{font-family:var(--font-display);font-size:19px;font-weight:700;margin-bottom:10px;color:white}
        .module-desc{font-size:14px;color:rgba(255,255,255,.65);line-height:1.6;margin-bottom:18px}
        .module-features{list-style:none}
        .module-features li{font-size:13px;color:rgba(255,255,255,.6);padding:4px 0;padding-left:18px;position:relative}
        .module-features li::before{content:'→';position:absolute;left:0;color:var(--accent)}
        .pricing-section{background:var(--bg)}
        .pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:56px;max-width:800px}
        .pricing-card{background:white;border-radius:20px;padding:34px;border:2px solid var(--border);position:relative;transition:all .3s}
        .pricing-card.featured{border-color:var(--accent)}
        .pricing-popular{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:white;font-size:11px;font-weight:700;padding:4px 16px;border-radius:100px;font-family:var(--font-mono);white-space:nowrap}
        .price-value{font-family:var(--font-display);font-size:40px;font-weight:800;color:var(--primary)}
        .coffee-bar{background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1px solid #F59E0B;border-radius:16px;padding:20px 26px;display:flex;align-items:center;gap:16px;margin-top:40px;max-width:800px}
        .tech-section{background:white}
        .tech-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
        .tech-card{padding:22px;border-radius:14px;border:1px solid var(--border);transition:all .25s}
        .tech-card:hover{border-color:rgba(0,200,150,.4);box-shadow:0 4px 16px rgba(0,200,150,.08)}
        .footer{background:var(--primary);color:rgba(255,255,255,.7);padding:48px 40px;text-align:center}
        @media(max-width:900px){
          .hero-content{grid-template-columns:1fr;gap:40px}
          .hero-title{font-size:36px}
          .how-grid{grid-template-columns:1fr 1fr}
          .modules-grid,.pricing-grid{grid-template-columns:1fr}
          .tech-grid{grid-template-columns:1fr 1fr}
          .nav{padding:14px 20px}
          section{padding:60px 20px}
          .hero{padding:100px 20px 60px}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <Link className="logo" href="/">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2"/>
              <circle cx="10" cy="10" r="3" fill="#00C896"/>
              <line x1="10" y1="1" x2="10" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="10" y1="16" x2="10" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="1" y1="10" x2="4" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="16" y1="10" x2="19" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          TaxLens <span className="logo-py">&nbsp;PY</span>
        </Link>
        <div className="nav-links">
          <a className="nav-link" href="#modulos">Módulos</a>
          <a className="nav-link" href="#precios">Precios</a>
          <a className="nav-link" href="#tecnologia">Tecnología</a>
          <Link className="btn btn-primary" href="/dashboard" style={{padding:'8px 18px',fontSize:'13px'}}>
            Comenzar gratis →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-grid"/>
        <div className="hero-content">
          <div>
            <div className="hero-badge fade-up">
              <span className="badge-dot"/>
              OCR + AI fiscal corriendo en tu computadora
            </div>
            <h1 className="hero-title fade-up delay-1">
              Mirá tus<br/>impuestos<br/>con <span className="hero-title-accent">claridad.</span>
            </h1>
            <p className="hero-sub fade-up delay-2">
              Procesá facturas, generá tus libros de Marangatu y consultá la DNIT —
              con IA que corre en tu dispositivo. Sin servidores. Sin costos. 100% privado.
            </p>
            <div className="hero-ctas fade-up delay-3">
              <Link className="btn btn-primary btn-lg" href="/dashboard">
                Empezar gratis →
              </Link>
              <a className="btn btn-ghost btn-lg" href="#modulos">
                Ver módulos ↓
              </a>
            </div>
            <div className="hero-trust fade-up delay-4">
              {['Marangatu listo','Sin cuenta de pago requerida','Funciona offline'].map(t => (
                <div className="trust-item" key={t}>
                  <span className="trust-icon">✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual fade-up delay-3">
            <div className="floating-card card-tr">
              <span style={{fontSize:20}}>🧠</span>
              <div>
                <div style={{fontFamily:'var(--font-display)',fontSize:12,fontWeight:700,color:'var(--primary)'}}>Gemma 4 activo</div>
                <div style={{fontSize:11,color:'var(--text-muted)'}}>Clasificando facturas...</div>
              </div>
            </div>

            <div className="invoice-mockup">
              <div className="scan-line"/>
              <div className="mockup-header">
                <div className="mockup-title">🔍 Procesando factura_042.jpg</div>
                <div className="mockup-badge">FLORENCE-2</div>
              </div>
              {[
                {label:'RUC Emisor',  value:'80012345-6',  conf:'high'},
                {label:'Timbrado',    value:'12345678',    conf:'high'},
                {label:'Fecha',       value:'15/06/2025',  conf:'high'},
                {label:'Monto Total', value:'₲ 350.000',   conf:'high'},
                {label:'IVA 10%',     value:'₲ 31.818',    conf:'mid'},
                {label:'Imputa a',    value:'IVA + IRE',   conf:'high'},
              ].map((row, i) => (
                <div key={i} className="mockup-row" style={{borderRadius:5,paddingLeft:6,paddingRight:6}}>
                  <div className="mockup-label">{row.label}</div>
                  <div className="mockup-value">{row.value}</div>
                  <div className={`mockup-conf ${row.conf === 'high' ? 'conf-high' : 'conf-mid'}`}>
                    {row.conf === 'high' ? '98%' : '81%'}
                  </div>
                </div>
              ))}
              <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:11,color:'var(--text-muted)'}}>42 / 80 facturas procesadas</span>
                <span style={{fontSize:11,fontFamily:'var(--font-mono)',color:'var(--accent)',fontWeight:600}}>52%</span>
              </div>
              <div style={{height:4,background:'var(--border)',borderRadius:2,marginTop:7}}>
                <div style={{height:'100%',width:'52%',background:'var(--accent)',borderRadius:2}}/>
              </div>
            </div>

            <div className="floating-card card-bl">
              <span style={{fontSize:20}}>✅</span>
              <div>
                <div style={{fontFamily:'var(--font-display)',fontSize:12,fontWeight:700,color:'var(--success)'}}>RUC válido</div>
                <div style={{fontSize:11,color:'var(--text-muted)'}}>Dígito verificador ✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background:'white'}} id="como-funciona">
        <div className="container">
          <div className="section-label">¿Cómo funciona?</div>
          <h2 className="section-title">De la foto a Marangatu en 4 pasos</h2>
          <p className="section-sub">Sin instalación de software. Solo abrí el navegador y empezá.</p>
          <div className="how-grid">
            {[
              {num:'1',icon:'📥',title:'Subí tus facturas',desc:'Arrastrá tus fotos de facturas. JPG, PNG o HEIC. Hasta 200 por sesión.'},
              {num:'2',icon:'🔍',title:'OCR automático',desc:'Florence-2 extrae RUC, timbrado, monto y todos los campos. Corre en tu GPU.'},
              {num:'3',icon:'🧠',title:'Clasificación AI',desc:'Gemma 4 imputa cada gasto: IVA, IRE o IRP-RSP. Consulta la DNIT si hay dudas.'},
              {num:'4',icon:'📊',title:'Descargá el Excel',desc:'Archivo CSV/Excel listo para adjuntar en Marangatu. Generado en tu navegador.'},
            ].map((step, i) => (
              <div key={i} className="how-step">
                <div className="step-icon">{step.icon}</div>
                <div className="step-num">{step.num}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="modules-section" id="modulos">
        <div className="container">
          <div className="section-label" style={{color:'rgba(0,200,150,.8)'}}>Módulos</div>
          <h2 className="section-title" style={{color:'white'}}>Todo lo que necesitás, sin pagar por IA</h2>
          <p className="section-sub" style={{color:'rgba(255,255,255,.6)'}}>El procesamiento corre en tu computadora. Nosotros solo guardamos tus configuraciones.</p>
          <div className="modules-grid">
            {[
              {tag:'GRATIS',tagClass:'tag-free',icon:'🏠',title:'AI Hub',desc:'Centro de control donde descargás los modelos de IA y la base de conocimiento de la DNIT. Instalás una vez, usás siempre.',features:['Descarga de Florence-2 (OCR)','Descarga de Gemma 4 (LLM local)','Índice vectorial de leyes DNIT','Verificación de integridad SHA-256']},
              {tag:'GRATIS',tagClass:'tag-free',icon:'📋',title:'Marangatu Generator',desc:'Pipeline completo de facturas: OCR masivo + clasificación automática + validación de RUCs + generación de archivos para el sistema de la DNIT.',features:['Libros de Compras y Ventas (IVA)','Libros de Ingresos y Egresos (IRE/IRP)','Validación de RUC con dígito verificador','Exportación CSV/Excel con formato exacto']},
              {tag:'₲ 50.000 / MES',tagClass:'tag-premium',icon:'🎮',title:'AI Playground',desc:'Creá tus propios esquemas de extracción sin programar. Definí campos, reglas de clasificación y plantillas de Excel personalizadas.',features:['Schema Builder drag & drop','Logic Engine con reglas propias','Template Generator Excel avanzado','Base de conocimiento personalizada']},
            ].map((m, i) => (
              <div key={i} className="module-card">
                <div className={`module-tag ${m.tagClass}`}>{m.tag}</div>
                <div className="module-icon">{m.icon}</div>
                <div className="module-title">{m.title}</div>
                <div className="module-desc">{m.desc}</div>
                <ul className="module-features">
                  {m.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="precios">
        <div className="container">
          <div className="section-label">Precios</div>
          <h2 className="section-title">Sin sorpresas. Sin costos ocultos.</h2>
          <p className="section-sub">La funcionalidad core es gratis de por vida. Solo pagás si necesitás esquemas personalizados.</p>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div style={{fontFamily:'var(--font-mono)',fontSize:11,fontWeight:600,color:'var(--text-muted)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:8}}>Free</div>
              <div style={{marginBottom:4}}>
                <span className="price-value">₲ 0</span>
                <span style={{fontSize:14,color:'var(--text-muted)'}}> / mes</span>
              </div>
              <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:20}}>Para siempre</div>
              <Link className="btn btn-ghost" style={{width:'100%',justifyContent:'center'}} href="/dashboard">
                Empezar gratis
              </Link>
              <div style={{height:1,background:'var(--border)',margin:'20px 0'}}/>
              <ul style={{listStyle:'none'}}>
                {['AI Hub completo (todos los modelos)','Marangatu Generator sin límites','OCR de facturas con Florence-2','Clasificación IA con Gemma 4','Base de conocimiento DNIT','Validación de RUC y timbrados','Exportación CSV/Excel'].map((f,i)=>(
                  <li key={i} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,padding:'5px 0'}}>
                    <span style={{color:'var(--accent)',flexShrink:0,marginTop:1}}>✓</span>{f}
                  </li>
                ))}
                {['Schema Builder personalizado','Logic Engine','Template Generator avanzado'].map((f,i)=>(
                  <li key={i} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,padding:'5px 0',color:'var(--text-muted)'}}>
                    <span style={{flexShrink:0,marginTop:1}}>—</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pricing-card featured">
              <div className="pricing-popular">🌟 Más popular entre contadores</div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:11,fontWeight:600,color:'var(--text-muted)',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:8}}>AI Playground</div>
              <div style={{marginBottom:4}}>
                <span className="price-value" style={{color:'var(--accent)'}}>₲ 50.000</span>
                <span style={{fontSize:14,color:'var(--text-muted)'}}> / mes</span>
              </div>
              <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:20}}>≈ USD 6,50 · Probá 7 días gratis</div>
              <Link className="btn btn-accent" style={{width:'100%',justifyContent:'center'}} href="/dashboard">
                Empezar prueba gratis →
              </Link>
              <div style={{height:1,background:'var(--border)',margin:'20px 0'}}/>
              <ul style={{listStyle:'none'}}>
                {['Todo lo del plan Free','Schema Builder visual ilimitado','Logic Engine con reglas propias','Template Generator Excel avanzado','Hasta 20 esquemas en la nube','Hasta 20 documentos propios','Soporte por email (48h)'].map((f,i)=>(
                  <li key={i} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,padding:'5px 0'}}>
                    <span style={{color:'var(--accent)',flexShrink:0,marginTop:1}}>✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Buy Me a Coffee */}
          <div className="coffee-bar">
            <span style={{fontSize:30}}>☕</span>
            <div>
              <h4 style={{fontFamily:'var(--font-display)',fontSize:14,fontWeight:700,color:'#92400E',marginBottom:3}}>¿Te ahorré horas de trabajo?</h4>
              <p style={{fontSize:13,color:'#B45309'}}>TaxLens PY es gratis. Un café me ayuda a mantenerlo actualizado con cada resolución de la DNIT.</p>
            </div>
            <a
              style={{marginLeft:'auto',flexShrink:0,padding:'9px 18px',background:'#F59E0B',color:'#451A03',border:'none',borderRadius:8,fontWeight:700,fontSize:13,cursor:'pointer',textDecoration:'none',whiteSpace:'nowrap'}}
              href="https://buymeacoffee.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Invitame un café ☕
            </a>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="tech-section" id="tecnologia">
        <div className="container">
          <div className="section-label">Tecnología</div>
          <h2 className="section-title">Por qué es local-first</h2>
          <p className="section-sub">Tus datos fiscales son sensibles. Con TaxLens PY, jamás salen de tu computadora.</p>
          <div className="tech-grid">
            {[
              {layer:'Frontend',name:'Next.js en Vercel',detail:'UI rápida con App Router. La aplicación se carga en segundos, los modelos se descargan en segundo plano.'},
              {layer:'OCR Engine',name:'Florence-2 (ONNX)',detail:'Modelo de visión computacional de Microsoft. Extrae texto de facturas con 95%+ de precisión en imágenes claras.'},
              {layer:'LLM Local',name:'Gemma 4 E2B',detail:'Modelo de Google cuantizado a int4. Clasifica gastos y consulta contexto legal. Corre en tu GPU vía WebGPU.'},
              {layer:'Búsqueda Legal',name:'RAG con Orama',detail:'Base de conocimiento vectorial de las leyes DNIT. Búsqueda semántica offline en milisegundos.'},
              {layer:'Storage',name:'OPFS + IndexedDB',detail:'Los modelos y facturas viven en tu navegador. Gigabytes de almacenamiento, cero en nuestros servidores.'},
              {layer:'Nube (solo config)',name:'Neon PostgreSQL',detail:'Solo guardamos tus esquemas y configuraciones del Playground. Nunca datos fiscales ni imágenes.'},
            ].map((t, i) => (
              <div key={i} className="tech-card">
                <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--accent)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8}}>{t.layer}</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:15,fontWeight:700,color:'var(--primary)',marginBottom:6}}>{t.name}</div>
                <div style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.5}}>{t.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:800,color:'white',marginBottom:8}}>
          TaxLens <span style={{color:'var(--accent)'}}>PY</span>
        </div>
        <div style={{fontSize:14,marginBottom:24}}>Inteligencia Fiscal Local para Paraguay</div>
        <div style={{display:'flex',justifyContent:'center',gap:24,marginBottom:24}}>
          {['Privacidad','Términos','FAQ','Contacto'].map(l => (
            <span key={l} style={{fontSize:13,color:'rgba(255,255,255,.5)',cursor:'pointer',transition:'color .2s'}}>{l}</span>
          ))}
        </div>
        <div style={{marginBottom:20}}>
          <a
            href="https://linkedin.com/in/"
            target="_blank"
            rel="noopener noreferrer"
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'9px 18px',borderRadius:8,border:'1px solid rgba(255,255,255,.2)',color:'rgba(255,255,255,.8)',textDecoration:'none',fontSize:13,fontWeight:600}}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Creado por <strong style={{color:'white',marginLeft:3}}>Tu Nombre</strong>
          </a>
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.35)'}}>© 2025 TaxLens PY — Proyecto independiente</div>
        <div style={{fontSize:12,color:'rgba(0,200,150,.8)',marginTop:6}}>🔒 Tu información fiscal nunca sale de tu dispositivo.</div>
      </footer>
    </>
  );
}
