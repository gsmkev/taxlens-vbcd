# 05 — Identidad Visual y Marca: TaxLens PY

---

## El Nombre: TaxLens PY

### Razonamiento

- **Tax** — Directo, internacional, inmediatamente asociado a impuestos. Evita ambigüedades.
- **Lens** — La lente como metáfora de claridad, enfoque y precisión. Ver los impuestos con nitidez.
- **PY** — Ancla al mercado paraguayo sin excluir futuras expansiones regionales. Reconocible localmente.

### Alternativas consideradas (y descartadas)

| Nombre | Por qué se descartó |
|---|---|
| FiscalPY | Muy genérico, sin diferenciación |
| ContaBot | Sugiere chatbot simple, no plataforma |
| MarangaBot | Demasiado técnico, no amigable para el usuario final |
| ImpoSmart | Confundible con IMPO (órgano del Estado) |
| ClearTax PY | ClearTax ya existe como marca internacional |

### Taglines

**Principal:**
> *"Mirá tus impuestos con claridad."*

**Variantes por contexto:**
- Para contadores: *"Procesá 100 facturas en lo que tomás un tereré."*
- Para técnica: *"IA fiscal. Local. Privada. Gratis."*
- Para redes: *"Tu contador inteligente — sin servidores, sin costos ocultos."*

---

## Paleta de Colores

### Colores Primarios

```
Azul Profundo (Primario)
  Hex: #0F2B5B
  RGB: 15, 43, 91
  Uso: Headers, navegación, textos principales de marca

Verde Esmeralda (Acento)
  Hex: #00C896
  RGB: 0, 200, 150
  Uso: CTAs, indicadores de éxito, badges "Listo", precios

Blanco Roto (Fondo)
  Hex: #F5F7FA
  RGB: 245, 247, 250
  Uso: Fondos de pantalla principal, tarjetas
```

### Colores Secundarios

```
Gris Azulado (Texto secundario)
  Hex: #64748B
  RGB: 100, 116, 139

Azul Claro (Hover states, selección)
  Hex: #E8F4FD
  RGB: 232, 244, 253

Amarillo Advertencia
  Hex: #F59E0B
  RGB: 245, 158, 11
  Uso: Campos con baja confianza de OCR, advertencias

Rojo Error
  Hex: #EF4444
  RGB: 239, 68, 68
  Uso: Campos con error, validaciones fallidas

Verde Suave (Éxito)
  Hex: #10B981
  RGB: 16, 185, 129
```

### Modo Oscuro (Dark Theme)

```
Fondo oscuro:     #0A1628
Superficie:       #0F2240
Texto principal:  #E2E8F0
Texto secundario: #94A3B8
```

### Variables CSS del Sistema

```css
:root {
  --brand-primary:     #0F2B5B;
  --brand-accent:      #00C896;
  --brand-accent-dark: #009E78;
  --surface-bg:        #F5F7FA;
  --surface-card:      #FFFFFF;
  --text-primary:      #1E293B;
  --text-secondary:    #64748B;
  --border:            #E2E8F0;
  --warning:           #F59E0B;
  --error:             #EF4444;
  --success:           #10B981;
  --radius-sm:         6px;
  --radius-md:         10px;
  --radius-lg:         16px;
}
```

---

## Tipografía

### Fuente de Display: Sora

Usada en: Título del logo, headings H1 y H2, taglines.

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

h1, h2, .logo-text { font-family: 'Sora', sans-serif; }
```

**Por qué Sora:** Geométrica pero cálida. Técnica pero accesible. Tiene personalidad sin ser ostentosa. Rara en el mercado paraguayo local.

### Fuente de Cuerpo: Plus Jakarta Sans

Usada en: Texto general, UI, tablas, formularios.

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

body, p, span, td { font-family: 'Plus Jakarta Sans', sans-serif; }
```

### Fuente Monospace: JetBrains Mono

Usada en: Valores de RUC, timbrados, montos en tabla, código.

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

.ruc, .timbrado, .monto, code { font-family: 'JetBrains Mono', monospace; }
```

---

## Logo

### Concepto

Un lente (círculo) estilizado que integra el símbolo `₲` (guaraní) con un destello de enfoque. Simple, reconocible en 16x16px (favicon) y escalable a tamaños grandes.

### Variantes

1. **Logo completo:** Ícono + "TaxLens" + "PY" en tipografía Sora
2. **Logo reducido:** Solo ícono + "TaxLens"
3. **Ícono solo:** Para favicon, app icon, avatares sociales
4. **Versión negativa (sobre fondo oscuro):** Logo en blanco/verde

### Descripción del ícono para implementación SVG

```svg
<!-- Concepto base del ícono TaxLens PY -->
<!-- Círculo exterior (el "lente") en azul primario -->
<!-- Líneas internas formando el símbolo ₲ estilizado en verde acento -->
<!-- Destello/flare en la esquina superior derecha del círculo -->
```

*Nota: El ícono definitivo debe diseñarse con Figma o contratar diseñador por sesión única.*

---

## Tono de Comunicación

### Principios de Voz

**1. Directo y claro**
Los contadores y contribuyentes no tienen tiempo. Ir al punto.
- ❌ *"Nuestra plataforma aprovecha tecnologías de vanguardia de inteligencia artificial para optimizar su flujo de trabajo contable..."*
- ✅ *"Subí tus facturas. Descargá el Excel. En minutos."*

**2. Confiable sin ser aburrido**
El contexto es fiscal (serio), pero la experiencia no tiene que ser árida.
- ❌ *"Sistema de procesamiento de documentos tributarios"*
- ✅ *"Tu contador inteligente"*

**3. Paraguayo sin caricatura**
Usar referencias locales naturalmente, no como marketing forzado.
- ✅ Referencias a Marangatu, DNIT, guaraníes (₲), "factura de crédito"
- ❌ Intentar hablar en jopará o usar expresiones forzadas

**4. Técnicamente honesto**
No prometer magia. Cuando el OCR falla, decirlo claramente.
- ✅ *"Esta factura tiene baja calidad de imagen. Revisá el campo Timbrado."*
- ❌ *"¡Procesamiento exitoso!"* (cuando hay dudas)

---

## Componentes de UI — Guía Rápida

### Botones

```
PRIMARIO: bg #0F2B5B, text white, hover bg #1a3f7a, radius 8px
ACENTO:   bg #00C896, text white, hover bg #009E78, radius 8px
GHOST:    bg transparent, border #0F2B5B, text #0F2B5B
PELIGRO:  bg #EF4444, text white
```

### Tarjetas de Módulo

```
bg: white
border: 1px solid #E2E8F0
border-radius: 16px
shadow: 0 2px 8px rgba(0,0,0,0.06)
padding: 24px
hover: shadow: 0 4px 16px rgba(0,0,0,0.10), translateY(-2px)
```

### Estados de Modelo (AI Hub)

```
NO_DESCARGADO: badge gris #94A3B8, "No instalado"
DESCARGANDO:   badge azul animado, barra de progreso verde
DISPONIBLE:    badge verde #10B981, "Listo"
ACTIVO:        badge azul #0F2B5B, "En uso"
```

### Indicadores de Confianza OCR

```
Alta (≥ 0.90):    Sin indicador visual (confianza implícita)
Media (0.75-0.89): Subrayado amarillo punteado
Baja (< 0.75):     Resaltado amarillo claro + icono ⚠️
Error:             Fondo rojo claro + icono ❌
```

---

## Sección "Buy Me a Coffee"

### Ubicación
Footer de la aplicación y página `/acerca-de`.

### Implementación

```jsx
// Componente BuyMeCoffee
const BuyMeCoffee = () => (
  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
    <span className="text-2xl">☕</span>
    <div>
      <p className="text-sm font-semibold text-amber-900">
        ¿Te ahorré horas de trabajo?
      </p>
      <p className="text-xs text-amber-700">
        TaxLens PY es gratis. Un café me ayuda a mantenerlo así.
      </p>
    </div>
    <a
      href="https://buymeacoffee.com/[tu-username]"
      target="_blank"
      rel="noopener noreferrer"
      className="ml-auto px-4 py-2 bg-amber-400 hover:bg-amber-500 
                 text-amber-900 font-semibold rounded-lg text-sm 
                 transition-colors whitespace-nowrap"
    >
      Invitame un café ☕
    </a>
  </div>
);
```

### Copy alternativo para diferentes contextos

- Footer app: *"¿Te ahorré horas de trabajo? Invitame un café ☕"*
- Después de exportar Excel: *"¡Listo! Si te fue útil, podés apoyar el proyecto con un cafecito."*
- Página de precios: *"¿Preferís no suscribirte pero querés apoyar? Un café también sirve."*

---

## Sección LinkedIn

### Ubicación
Footer de la aplicación, página `/acerca-de`, y cards del módulo premium.

### Implementación

```jsx
// Componente LinkedIn Link
const LinkedInLink = () => (
  <a
    href="https://linkedin.com/in/[tu-perfil]"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-sm text-slate-600 
               hover:text-[#0077B5] transition-colors group"
  >
    <svg /* LinkedIn icon SVG */ className="w-5 h-5" />
    <span className="group-hover:underline">
      Creado por <strong>[Tu Nombre]</strong>
    </span>
  </a>
);
```

### Texto del Footer Completo

```
TaxLens PY — Inteligencia Fiscal Local para Paraguay
Creado con 🤍 por [Tu Nombre] · [LinkedIn icon] LinkedIn

[☕ Invitame un café]    [🔒 Privacidad]    [📄 Términos]

© 2025 TaxLens PY — Tu información fiscal nunca sale de tu dispositivo.
```

---

## Assets Necesarios (Checklist)

- [ ] Logo SVG en variantes (completo, reducido, ícono)
- [ ] Favicon.ico + PNG 192x192 + PNG 512x512 (para PWA)
- [ ] Open Graph image (1200x630px) para compartir en redes
- [ ] Screenshot de la app para landing page (mockup o real)
- [ ] Ícono de cada módulo (AI Hub, Marangatu Generator, AI Playground)

---

*TaxLens PY · Guía de Identidad Visual v1.0 · 2025*
