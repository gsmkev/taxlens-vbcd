# 04 — Roadmap de Desarrollo: TaxLens PY

## Metodología

Sprints de **2 semanas** con entregables funcionales al final de cada uno. El objetivo es tener un MVP funcional en **8 semanas (2 meses)**, con las funcionalidades core del Marangatu Generator y el AI Hub operativas.

El AI Playground (módulo premium) se completa en la segunda fase.

---

## Vista General del Timeline

```
FASE 1 — FUNDACIONES (Semanas 1-4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 1 │ Setup infra + Auth + DB schema
Sprint 2 │ AI Hub + descarga de modelos + OCR básico

FASE 2 — CORE PRODUCT (Semanas 5-8)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 3 │ Pipeline OCR completo + Validaciones
Sprint 4 │ RAG DNIT + Generación CSV/Excel

FASE 3 — PREMIUM (Semanas 9-12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 5 │ Schema Builder + Logic Engine
Sprint 6 │ Template Generator + Pagos

FASE 4 — PULIDO (Semanas 13-16)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint 7 │ UX Polish + Onboarding + Landing Page
Sprint 8 │ Beta cerrada + Feedback + Bugfixes
```

---

## FASE 1 — FUNDACIONES

### Sprint 1 — Setup de Infraestructura (Semanas 1-2)

**Objetivo:** Tener un proyecto Next.js funcionando con auth real, base de datos conectada y CI/CD configurado.

#### Tareas:

**Infraestructura (Días 1-3)**
- [ ] Crear repositorio en GitHub con estructura monorepo
- [ ] Inicializar proyecto Next.js 15 con TypeScript y Tailwind
- [ ] Configurar Vercel con preview deployments automáticos
- [ ] Provisionar base de datos en Neon (branching para dev/prod)
- [ ] Configurar variables de entorno en Vercel

**Auth con Kinde (Días 3-5)**
- [ ] Configurar aplicación en Kinde dashboard
- [ ] Instalar `@kinde-oss/kinde-auth-nextjs`
- [ ] Implementar rutas `/api/auth/[kindeAuth]`
- [ ] Crear middleware de protección de rutas
- [ ] Sincronización Kinde → Neon al primer login (crear row en `usuarios`)

**Base de Datos (Días 5-8)**
- [ ] Instalar Drizzle ORM + `drizzle-kit`
- [ ] Escribir schema TypeScript alineado con `03_DATA_MODELS.md`
- [ ] Primera migración a Neon (dev branch)
- [ ] Seed de datos: `modelos_registry` y `dnit_knowledge_versions`

**Testing básico (Días 9-10)**
- [ ] Test de flujo auth completo (registro → login → perfil → logout)
- [ ] Test de conexión Neon desde Vercel (Edge Runtime)

**Entregable del Sprint 1:**
> Aplicación Next.js deployada en Vercel con login funcional, base de datos conectada y schema migrado. Sin UI final, pero con la plomería técnica funcionando.

---

### Sprint 2 — AI Hub & OCR Básico (Semanas 3-4)

**Objetivo:** El usuario puede descargar modelos y procesar su primera factura.

#### Tareas:

**Service Worker & Transformers.js (Días 1-4)**
- [ ] Registrar Service Worker en `app/layout.tsx`
- [ ] Integrar Transformers.js v3 en el worker
- [ ] Implementar canal de comunicación `postMessage` UI ↔ Worker
- [ ] Sistema de progreso de inferencia (streams de texto)
- [ ] Detección de capacidades: WebGPU, OPFS, memoria disponible

**AI Hub UI (Días 4-7)**
- [ ] Página `/hub` con listado de modelos desde Neon
- [ ] Componente `ModelCard` con estados (no descargado / descargando / listo)
- [ ] Lógica de descarga: fetch → OPFS write en stream con progress
- [ ] Verificación de hash SHA-256 post-descarga
- [ ] UI de Knowledge Base DNIT (descarga del índice vectorial)

**OCR Básico (Días 7-10)**
- [ ] Componente de upload de imágenes (drag & drop, múltiples archivos)
- [ ] Pre-procesamiento de imagen en canvas (resize, normalización)
- [ ] Pipeline Florence-2: imagen → texto estructurado
- [ ] Tabla de previsualización de resultados OCR
- [ ] Guardado en IndexedDB

**Entregable del Sprint 2:**
> El usuario puede ir al AI Hub, descargar Florence-2, subir una foto de factura y ver el texto extraído en pantalla. Sin clasificación por AI todavía.

---

## FASE 2 — CORE PRODUCT

### Sprint 3 — Pipeline Completo + Validaciones (Semanas 5-6)

**Objetivo:** El pipeline completo funciona: OCR → Clasificación → Validación → Preview editable.

#### Tareas:

**Integración Gemma 4 (Días 1-4)**
- [ ] Integrar Gemma 4 E2B en el Service Worker
- [ ] Diseñar prompts de clasificación por tipo de libro (Compras, Ventas, Ingresos, Egresos)
- [ ] Parser de JSON desde la respuesta del LLM (con retry ante JSON malformado)
- [ ] Manejo de batch: procesar N facturas en cola

**Validaciones (Días 4-7)**
- [ ] Algoritmo de dígito verificador de RUC (módulo 11)
- [ ] Validación de formato de timbrado
- [ ] Validación de cuadre matemático (gravadas + exentas = total)
- [ ] Lista local de timbrados vencidos/anulados (JSON estático actualizable)

**UI de Revisión (Días 7-10)**
- [ ] Tabla editable post-procesamiento
- [ ] Resaltado de campos con baja confianza (amarillo) y errores (rojo)
- [ ] Edición inline con validación en tiempo real
- [ ] Contador de facturas: procesadas / con advertencias / con errores

**Entregable del Sprint 3:**
> El usuario puede subir 20 facturas, el sistema las procesa con OCR + AI, y presenta una tabla editable donde puede corregir errores antes de exportar.

---

### Sprint 4 — RAG DNIT + Exportación (Semanas 7-8)

**Objetivo:** Búsqueda legal funcional + exportación CSV/Excel completa.

#### Tareas:

**Pre-procesamiento DNIT (Días 1-3, tarea fuera del sprint si ya está hecha)**
- [ ] Script Python para chunking de PDFs de la DNIT
- [ ] Generación de embeddings con all-MiniLM
- [ ] Serialización del índice a JSON
- [ ] Upload a Google Drive con link de descarga directa

**Integración RAG (Días 1-5)**
- [ ] Integrar librería Orama en el cliente
- [ ] Cargar índice DNIT desde OPFS al iniciar la sesión
- [ ] Función `consultarDNIT(query: string): ChunkRelevante[]`
- [ ] Integrar RAG al pipeline: cuando Gemma 4 marca "DUDOSO", consultar DNIT
- [ ] UI para mostrar citas legales con artículo fuente

**Exportación (Días 5-9)**
- [ ] Generador de CSV con formato exacto de Marangatu (todas las columnas)
- [ ] Generador de Excel con ExcelJS (formato humano con totales)
- [ ] Reporte de anomalías (lista de advertencias por factura)
- [ ] Nombre de archivo automático: `LIBRO_COMPRAS_202506.csv`

**Testing de Integración (Días 9-10)**
- [ ] Test con 50 facturas reales (datos anonimizados)
- [ ] Verificar CSV resultante con validador de Marangatu
- [ ] Medir latencia total por factura en hardware de gama media

**Entregable del Sprint 4:**
> **MVP completo del Marangatu Generator.** El usuario puede procesar un lote de facturas y descargar el CSV/Excel listo para adjuntar en Marangatu.

---

## FASE 3 — MÓDULO PREMIUM

### Sprint 5 — Schema Builder & Logic Engine (Semanas 9-10)

**Objetivo:** El AI Playground funciona para crear y usar esquemas personalizados.

#### Tareas:

**Schema Builder UI (Días 1-5)**
- [ ] Interfaz drag & drop para ordenar campos
- [ ] Panel de propiedades por tipo de campo
- [ ] Preview en tiempo real del Excel que se generará
- [ ] Guardado de esquema en Neon (requiere suscripción activa)
- [ ] Listado de esquemas guardados del usuario

**Logic Engine (Días 5-8)**
- [ ] Builder visual de condiciones (campo / operador / valor)
- [ ] Soporte para: CONTIENE, IGUAL_A, MAYOR_QUE, MENOR_QUE, ES_NULO
- [ ] Builder de acciones (SET campo = valor)
- [ ] Simulador de reglas: probar regla contra una factura de ejemplo
- [ ] Orden de ejecución de reglas (drag para priorizar)

**Gate de Suscripción (Días 8-10)**
- [ ] Middleware que verifica `suscripciones.estado = 'activo'`
- [ ] UI de paywall con CTA de suscripción y trial gratuito
- [ ] Toast de "Tu período de prueba vence en X días"

**Entregable del Sprint 5:**
> El usuario con trial activo puede crear un esquema personalizado con reglas y exportar datos en el formato que definió.

---

### Sprint 6 — Template Generator & Pagos (Semanas 11-12)

**Objetivo:** Generación de Excel avanzada + flujo de pago operativo.

#### Tareas:

**Template Generator (Días 1-5)**
- [ ] Motor de generación de Excel basado en esquema
- [ ] Soporte para: fórmulas SUM, SUBTOTAL, formato condicional
- [ ] Hoja de resumen ejecutivo auto-generada
- [ ] Presets de plantillas: "Contable Simple", "Gerencial con KPIs", "Marangatu Extendido"

**Pagos — MVP Manual (Días 5-8)**
- [ ] Formulario de suscripción con instrucciones de transferencia bancaria
- [ ] Admin panel simple (ruta protegida) para activar suscripciones manualmente
- [ ] Email de confirmación automático (Resend o Kinde)
- [ ] Webhook placeholder para futura integración con Bancard

**Pagos — Bancard (si tiempo permite)**
- [ ] Integrar Bancard Single Buy API
- [ ] Webhook de confirmación de pago → activar suscripción automáticamente

**Entregable del Sprint 6:**
> El AI Playground es completamente funcional y el flujo de pago (aunque sea manual) permite activar suscripciones. El producto es **monetizable**.

---

## FASE 4 — PULIDO Y LANZAMIENTO

### Sprint 7 — UX & Landing Page (Semanas 13-14)

- [ ] Landing page pública con propuesta de valor clara
- [ ] Onboarding interactivo (tour de 5 pasos con factura de ejemplo)
- [ ] Modo dark/light
- [ ] Componente "Buy Me a Coffee" en footer
- [ ] Link a LinkedIn del desarrollador
- [ ] Página de precios clara (Free vs. Playground ₲50.000/mes)
- [ ] FAQ con preguntas frecuentes de contadores paraguayos
- [ ] Optimización de performance (Lighthouse score > 90)

### Sprint 8 — Beta Cerrada (Semanas 15-16)

- [ ] Invitación a 20-50 contadores beta testers
- [ ] Canal de feedback (Discord o formulario simple)
- [ ] Monitoreo de errores con Sentry (Free Tier)
- [ ] Análisis de uso con Plausible Analytics (privacy-first, sin cookies)
- [ ] Corrección de bugs críticos reportados
- [ ] Documentación de usuario (FAQ + video corto de 3 minutos)
- [ ] **Lanzamiento público**

---

## Estimaciones de Esfuerzo

### Por Sprint (1 desarrollador full-stack)

| Sprint | Complejidad | Horas Estimadas | Riesgo |
|---|---|---|---|
| Sprint 1 | Media | 40h | Bajo (infraestructura estándar) |
| Sprint 2 | Alta | 60h | Medio (OPFS + modelos grandes) |
| Sprint 3 | Alta | 60h | Alto (Gemma 4 prompts delicados) |
| Sprint 4 | Alta | 55h | Medio (RAG + formato Marangatu exacto) |
| Sprint 5 | Media | 45h | Bajo (UI + lógica de negocio) |
| Sprint 6 | Media | 50h | Medio (pagos + integración) |
| Sprint 7 | Baja | 35h | Bajo |
| Sprint 8 | Variable | 40h | Depende de feedback |
| **TOTAL** | | **~385 horas** | |

### Riesgos Identificados y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| WebGPU no soportado en el navegador del usuario | Media | Alto | Fallback CPU con Florence-2 Tiny |
| Gemma 4 genera JSON malformado | Alta | Medio | Retry con temperatura 0, parser tolerante |
| OPFS storage lleno en el dispositivo del usuario | Baja | Alto | Alertas preventivas + gestión de modelos |
| Formato Marangatu cambia por resolución DNIT | Media | Alto | Knowledge Base actualizable + alerta en app |
| Tasa de conversión Free→Premium baja | Media | Medio | Trial 7 días + limitar exportaciones en free tier |

---

## KPIs del Lanzamiento (Metas a 6 meses)

| Métrica | Meta Conservadora | Meta Optimista |
|---|---|---|
| Usuarios registrados | 200 | 800 |
| Usuarios activos mensuales | 80 | 350 |
| Suscriptores Playground | 20 | 80 |
| MRR (₲) | ₲ 1.000.000 | ₲ 4.000.000 |
| MRR (USD aprox.) | ~$130 USD | ~$520 USD |
| NPS (encuesta a usuarios) | > 40 | > 60 |

---

*TaxLens PY · Roadmap v1.0 · 2025*
