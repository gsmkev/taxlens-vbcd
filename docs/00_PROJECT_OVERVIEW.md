# 🧾 TaxLens PY — Inteligencia Fiscal Local para Paraguay

> **"Tu contador de bolsillo. Sin servidores. Sin costos ocultos. 100% tuyo."**

---

## ¿Qué es TaxLens PY?

**TaxLens PY** es una plataforma SaaS *local-first* diseñada específicamente para contribuyentes y contadores paraguayos que necesitan procesar facturas, generar archivos para **Marangatu** (DNIT) y consultar legislación tributaria — todo sin depender de servidores en la nube, sin exponer datos privados y sin costos de infraestructura variable.

La filosofía central del producto es: **el poder de la IA corre en tu computadora, no en la nuestra.**

---

## El Problema que Resuelve

El sistema tributario paraguayo (IVA, IRE, IRP-RSP) requiere:

- Clasificar cientos de facturas por período fiscal
- Generar archivos CSV/Excel con formato exacto de Marangatu
- Interpretar resoluciones y leyes de la DNIT (documentos técnicos densos)
- Validar RUCs, timbrados y montos antes de la presentación

Hoy, este proceso es **manual, lento y propenso a errores**, especialmente para:
- Contribuyentes independientes (IRP-RSP)
- PYMEs sin área contable dedicada
- Contadores con alto volumen de clientes

---

## La Solución: Local-First AI

TaxLens PY combina tres tecnologías de vanguardia que corren **directamente en el navegador del usuario**:

| Capacidad | Tecnología | Beneficio |
|---|---|---|
| OCR de Facturas | Florence-2 (ONNX) vía WebGPU | Velocidad sin servidor |
| Análisis y Clasificación | Gemma 4 E2B (ONNX) | Inferencia privada y gratuita |
| Búsqueda Legal (RAG) | Voy / Orama en WASM | Consultas DNIT offline |
| Generación Excel | ExcelJS en cliente | Sin backend de procesamiento |

---

## Módulos del Producto

### 🏠 1. AI Hub — Centro de Recursos
El panel de descarga e instalación de "paquetes de inteligencia". El usuario controla qué modelos y bases de conocimiento tiene disponibles.

### 📊 2. Marangatu Generator — Módulo Gratuito
Procesamiento especializado para los archivos adjuntos obligatorios: Ventas, Compras, Ingresos y Egresos. OCR masivo + mapeo automático de columnas.

### 🎮 3. AI Playground — Módulo Premium (₲ 50.000/mes)
Constructor visual de esquemas personalizados. El usuario define sus propios campos, reglas lógicas y plantillas de exportación sin escribir código.

---

## Modelo de Negocio

```
┌─────────────────────────────────────────────────────┐
│  GRATIS DE POR VIDA                                  │
│  • AI Hub (descarga de modelos)                      │
│  • Marangatu Generator (OCR + CSV/Excel)             │
│  • RAG de legislación DNIT                           │
│  • Validación de RUCs y timbrados                    │
├─────────────────────────────────────────────────────┤
│  AI PLAYGROUND — ₲ 50.000/mes                        │
│  • Schema Builder visual                             │
│  • Logic Engine con reglas personalizadas            │
│  • Template Generator con Excel dinámico             │
│  • Sincronización de esquemas en la nube (Neon)      │
└─────────────────────────────────────────────────────┘
```

**Premisa de rentabilidad:** Al no tener costos de GPU ni almacenamiento de datos de usuario, el margen del tier premium es prácticamente 100% desde el primer suscriptor.

---

## Stack Tecnológico Resumido

- **Frontend / Hosting:** Next.js 15 en Vercel (Free Tier)
- **Auth:** Kinde (Free Tier hasta 10.500 MAU)
- **Base de Datos:** Neon PostgreSQL (metadatos y esquemas solamente)
- **AI Runtime:** Transformers.js v3 con WebGPU
- **Storage Local:** OPFS (Origin Private File System) + IndexedDB
- **Pagos:** Bancard / transferencia bancaria manual (MVP)

---

## Identidad de Marca

**Nombre:** TaxLens PY  
**Tagline:** *Mirá tus impuestos con claridad.*  
**Paleta:** Azul profundo `#0F2B5B` + Acento verde `#00C896` + Blanco roto `#F5F7FA`  
**Tono:** Profesional pero accesible. Técnico pero humano. Paraguayo.  

---

## Documentos de este Repositorio

| Archivo | Contenido |
|---|---|
| `00_PROJECT_OVERVIEW.md` | Este documento |
| `01_ARCHITECTURE.md` | Arquitectura técnica detallada (v1.1) |
| `02_MODULES.md` | Especificación funcional de cada módulo (v1.1) |
| `03_DATA_MODELS.md` | Modelos de datos y esquemas de BD |
| `04_ROADMAP.md` | Plan de desarrollo por sprints |
| `05_BRANDING.md` | Guía de identidad visual y marca |
| `06_BUSINESS_MODEL.md` | Modelo de negocio y proyecciones |
| `07_TERMS_AND_PRIVACY.md` | Términos de Servicio y Política de Privacidad |

---

*Creado por el equipo de TaxLens PY · Paraguay · 2025*
