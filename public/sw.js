/**
 * TaxLens PY — Service Worker
 *
 * Corre Transformers.js v3 con WebGPU para inferencia local.
 * Se comunica con la UI via postMessage.
 *
 * Pipeline de mensajes:
 *   UI → SW: { type: 'CLASSIFY_TEXT', payload: { texto, tipoLibro } }
 *   UI → SW: { type: 'OCR_IMAGE', payload: { imageData } }
 *   UI → SW: { type: 'EMBED_TEXT', payload: { texto } }
 *   SW → UI: { type: 'PROGRESS', progress, mensaje }
 *   SW → UI: { type: 'RESULT', result }
 *   SW → UI: { type: 'VALIDATION_ERROR', attempt, zodError }
 *   SW → UI: { type: 'ERROR', error }
 */

// Estado del worker
let florenceLoaded = false;
let gemmaLoaded = false;
let miniLMLoaded = false;

// Simulación de procesamiento para desarrollo sin modelos descargados
// En producción, reemplazar con llamadas reales a Transformers.js

self.addEventListener('message', async (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'CLASSIFY_TEXT':
      await handleClassifyText(payload, event);
      break;
    case 'OCR_IMAGE':
      await handleOcrImage(payload, event);
      break;
    case 'EMBED_TEXT':
      await handleEmbedText(payload, event);
      break;
    case 'CHECK_MODELS':
      await handleCheckModels(event);
      break;
    default:
      event.ports[0]?.postMessage({ type: 'ERROR', error: `Tipo de mensaje desconocido: ${type}` });
  }
});

async function handleClassifyText(payload, event) {
  const { texto, tipoLibro } = payload;

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'PROGRESS', progress: 10, mensaje: 'Iniciando clasificación con Gemma 4...' });
    });
  });

  // Simulación de clasificación (reemplazar con Transformers.js real)
  await sleep(300);

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'PROGRESS', progress: 60, mensaje: 'Procesando con Gemma 4 E2B...' });
    });
  });

  await sleep(400);

  // Resultado simulado para desarrollo
  const resultado = extraerDatosSimulados(texto, tipoLibro);

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'PROGRESS', progress: 95, mensaje: 'Validando output con Zod...' });
    });
  });

  await sleep(100);

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'RESULT', result: resultado });
    });
  });
}

async function handleOcrImage(payload, event) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'PROGRESS', progress: 5, mensaje: 'Pre-procesando imagen...' });
    });
  });

  await sleep(200);

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'PROGRESS', progress: 30, mensaje: 'Florence-2: detectando regiones...' });
    });
  });

  await sleep(500);

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'PROGRESS', progress: 80, mensaje: 'Extrayendo texto de factura...' });
    });
  });

  await sleep(300);

  // Texto OCR simulado para desarrollo
  const textoOcr = `
    FACTURA
    RUC: 80012345-6
    TIMBRADO: 12345678
    Número: 001-001-0001234
    Fecha: 15/06/2025
    CONDICIÓN: CONTADO

    Descripción: Servicios de consultoría

    MONTO TOTAL: 550.000
    IVA 10%: 50.000
    GRAVADAS 10%: 500.000
    EXENTAS: 0
  `.trim();

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'RESULT', result: textoOcr });
    });
  });
}

async function handleEmbedText(payload, event) {
  const { texto } = payload;

  // Embeddings simulados (vectores aleatorios normalizados de 384 dims)
  const vector = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
  const magnitud = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
  const vectorNormalizado = vector.map(v => v / magnitud);

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'RESULT', result: vectorNormalizado });
    });
  });
}

async function handleCheckModels(event) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'RESULT',
        result: {
          florence: florenceLoaded,
          gemma: gemmaLoaded,
          miniLM: miniLMLoaded,
        },
      });
    });
  });
}

// Extracción simulada de datos para desarrollo
function extraerDatosSimulados(texto, tipoLibro) {
  return {
    rucEmisor: '80012345-6',
    timbrado: '12345678',
    numeroFactura: '001-001-0001234',
    fechaEmision: '15/06/2025',
    condicionVenta: 'CONTADO',
    montoTotal: 550000,
    gravadas5: 0,
    gravadas10: 500000,
    exentas: 0,
    iva5: 0,
    iva10: 50000,
    concepto: 'Servicios de consultoría',
    imputaIva: true,
    imputaIre: true,
    imputaIrpRsp: false,
    confianza: 0.92,
    dudas: [],
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Evento de instalación del Service Worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
