# 06 — Modelo de Negocio y Proyecciones: TaxLens PY

---

## Propuesta de Valor

### Para el Usuario Final

**Contribuyente independiente (IRP-RSP):**
> *"En lugar de contratar un contador por ₲ 200.000/mes solo para ordenar mis facturas, yo mismo proceso todo en 30 minutos y el archivo queda listo para subir a Marangatu."*

**Contador con múltiples clientes:**
> *"Puedo procesar el lote de facturas de 5 clientes en una tarde, con validaciones automáticas que antes hacía a mano. El AI Playground me permite tener esquemas diferentes para cada cliente."*

**PYME sin área contable:**
> *"Mis empleados pueden escanear facturas de gastos con el celular. El sistema las clasifica automáticamente y genera el Excel para el contador externo."*

---

## Estructura de Precios

### Tier 1 — Free (Para siempre)

**Precio:** ₲ 0 / mes

**Incluye:**
- AI Hub completo (descarga de modelos Florence-2 y Gemma 4)
- Base de conocimiento DNIT (índice vectorial descargable)
- Marangatu Generator sin límite de facturas
  - OCR de imágenes con Florence-2
  - Clasificación automática con Gemma 4
  - Validación de RUC y timbrados
  - Exportación CSV/Excel formato Marangatu
- Búsqueda RAG de legislación DNIT
- Carga de hasta 3 documentos propios

**Limitaciones del tier free:**
- Sin Schema Builder personalizado
- Sin Logic Engine de reglas
- Sin Template Generator avanzado
- Sin sincronización en la nube de esquemas

---

### Tier 2 — AI Playground (Premium)

**Precio:** ₲ 50.000 / mes (~USD 6,50)

**Incluye todo lo del tier Free, más:**
- Schema Builder visual ilimitado
- Logic Engine con reglas personalizadas ilimitadas
- Template Generator con Excel avanzado
- Hasta 20 esquemas guardados en la nube
- Hasta 10 plantillas de exportación
- Hasta 20 documentos propios en la base de conocimiento
- Soporte por email (respuesta en 48h)

**Trial gratuito:** 7 días sin tarjeta de crédito requerida.

---

## Análisis de Competencia

### Alternativas actuales del mercado paraguayo

| Solución | Costo Estimado/mes | Privacidad | Funciona Offline | AI integrada |
|---|---|---|---|---|
| Excel manual | ₲ 0 | ✅ | ✅ | ❌ |
| Contador freelance | ₲ 150.000 - 500.000 | Variable | N/A | ❌ |
| Software contable local (SAGE, etc.) | USD 30-100+ | ✅ | ✅ | ❌ |
| **TaxLens PY Free** | ₲ 0 | ✅✅ | ✅ | ✅ |
| **TaxLens PY Playground** | ₲ 50.000 | ✅✅ | ✅ | ✅ |

**Ventaja competitiva no replicable a corto plazo:** La combinación de AI local (sin costo variable por inferencia) + especialización en el formato Marangatu + conocimiento embebido de la DNIT no existe en otra herramienta del mercado paraguayo.

---

## Estructura de Costos Operativos

### Costo Fijo Mensual (Infraestructura)

| Servicio | Plan | Costo |
|---|---|---|
| Vercel | Hobby (Free) | ₲ 0 |
| Kinde Auth | Free (hasta 10.500 MAU) | ₲ 0 |
| Neon PostgreSQL | Free (0.5GB, 190h compute) | ₲ 0 |
| Google Drive (modelos) | 15GB free o Google One | ~₲ 0 - 6.000 |
| Dominio (.com.py o .py) | Anual | ~₲ 5.000/mes (prorrateado) |
| **TOTAL FIJO** | | **~₲ 0 - 11.000/mes** |

### Cuando el producto crece (Upgrades necesarios)

| Umbral | Servicio a actualizar | Costo adicional |
|---|---|---|
| > 10.500 usuarios activos/mes | Kinde Pro | ~USD 25/mes |
| > 0.5GB datos en Neon | Neon Launch | USD 19/mes |
| > 100GB bandwidth/mes | Vercel Pro | USD 20/mes |
| **Total en escala media** | | **~USD 64/mes (~₲ 490.000)** |

**Conclusión:** El modelo es rentable desde el **primer suscriptor de pago**. No existe costo marginal por usuario en el tier free (la inferencia AI corre en el dispositivo del usuario).

---

## Proyecciones Financieras

### Escenario Base (Conservador)

Asunciones:
- Crecimiento orgánico por redes sociales y boca a boca
- Conversión Free → Premium: 8% (industria SaaS B2C: 2-5%, con el trial de 7 días se puede superar)
- Churn mensual: 10% (estimado alto para ser conservadores)

| Mes | Usuarios Reg. | MAU | Suscriptores | MRR (₲) | MRR (USD) |
|---|---|---|---|---|---|
| Mes 1 | 30 | 20 | 0 | ₲ 0 | $0 |
| Mes 2 | 70 | 50 | 2 | ₲ 100.000 | ~$13 |
| Mes 3 | 130 | 90 | 5 | ₲ 250.000 | ~$32 |
| Mes 4 | 200 | 140 | 9 | ₲ 450.000 | ~$58 |
| Mes 5 | 300 | 200 | 14 | ₲ 700.000 | ~$91 |
| Mes 6 | 400 | 280 | 20 | ₲ 1.000.000 | ~$130 |

### Escenario Optimista

Asunciones: Campaña activa en LinkedIn y grupos de contadores, mención en medios especializados, conversión 12%.

| Mes | Usuarios Reg. | MAU | Suscriptores | MRR (₲) | MRR (USD) |
|---|---|---|---|---|---|
| Mes 3 | 300 | 200 | 18 | ₲ 900.000 | ~$117 |
| Mes 6 | 800 | 500 | 55 | ₲ 2.750.000 | ~$357 |
| Mes 12 | 2.000 | 1.200 | 120 | ₲ 6.000.000 | ~$780 |

### ARR a 12 meses (Escenario base)
> **~₲ 18.000.000/año (~USD 2.340)** — Ingreso secundario sustancial para un proyecto sin costo de infraestructura.

---

## Estrategia de Adquisición de Usuarios

### Canal 1 — LinkedIn (Principal)
- Posts semanales demostrando el producto: "Procesé 80 facturas en 4 minutos"
- Artículos sobre cambios tributarios de la DNIT
- Compartir en grupos de contadores y administradores de empresas
- Cobertura estimada: 2.000-10.000 cuentas de contadores en PY

### Canal 2 — Facebook Groups
- Grupos de contadores paraguayos (varios con > 5.000 miembros)
- Compartir tutoriales cortos en video (Reel/Story)

### Canal 3 — SEO Local
- Blog con artículos sobre: "Cómo llenar el libro de compras en Marangatu", "Dígito verificador de RUC Paraguay", etc.
- Tráfico orgánico de contribuyentes buscando ayuda con Marangatu

### Canal 4 — Boca a Boca (Gratis)
- La funcionalidad free es suficientemente útil para que los usuarios la compartan
- Watermark opcional en el Excel exportado: *"Generado con TaxLens PY — taxlens.com.py"*

---

## Futura Monetización (Post-MVP)

Posibles expansiones una vez establecida la base de usuarios:

| Idea | Viabilidad | MRR Potencial |
|---|---|---|
| Tier "Contador Pro" (múltiples perfiles de cliente) | Alta | +₲ 100.000/mes por contador |
| Sincronización multi-dispositivo | Media | Incluir en plan premium existente |
| Integración directa con API de Marangatu (si DNIT la publica) | Alta | Diferenciador enorme |
| Módulo de Cotizaciones / Presupuestos con RUC | Media | +₲ 30.000/mes |
| White label para estudios contables | Alta | ₲ 200.000-500.000/mes por estudio |
| Expansión a Bolivia / Perú (tributación similar) | Baja a mediano plazo | Mercado 10x más grande |

---

## Términos de Servicio y Consideraciones Legales

### Lo que TaxLens PY garantiza:
- La aplicación procesa datos fiscales **localmente** en el dispositivo del usuario
- Neon solo almacena metadatos no fiscales (configuraciones, esquemas)
- Los archivos generados son responsabilidad del usuario verificarlos antes de presentar a la DNIT

### Lo que TaxLens PY NO garantiza:
- Precisión del 100% en el OCR (se recomienda siempre revisión manual)
- Cumplimiento normativo en caso de cambios de resoluciones DNIT no actualizados en el Knowledge Base
- Disponibilidad 24/7 (es un servicio indie, sin SLA formal en el tier free)

### Recomendación legal:
> Consultar con un abogado paraguayo antes del lanzamiento público para redactar Términos de Servicio que excluyan responsabilidad por errores en los archivos generados. El costo estimado de redacción: ₲ 500.000 - 1.500.000 (una sola vez).

---

*TaxLens PY · Modelo de Negocio v1.0 · 2025*
