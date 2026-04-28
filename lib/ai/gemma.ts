'use client';

import type { FacturaClasificada } from './schemas';
import { FacturaClasificadaSchema } from './schemas';
import { PROMPT_CLASIFICAR_COMPRA, SYSTEM_PROMPT_CLASIFICACION } from './prompts';

// Este módulo es un cliente que se comunica con el Service Worker
// El Service Worker carga Gemma 4 vía Transformers.js y procesa localmente

export type WorkerMessage =
  | { type: 'PROCESS_INVOICE'; payload: { imageData: ImageData | string; schema?: unknown } }
  | { type: 'CLASSIFY_TEXT'; payload: { texto: string; tipoLibro: string } }
  | { type: 'QUERY_DNIT'; payload: { query: string; chunks: string[] } };

export type WorkerResponse =
  | { type: 'PROGRESS'; progress: number; mensaje: string }
  | { type: 'RESULT'; result: FacturaClasificada }
  | { type: 'VALIDATION_ERROR'; attempt: number; zodError: string }
  | { type: 'ERROR'; error: string };

let workerInstance: Worker | null = null;

export function obtenerWorker(): Worker {
  if (!workerInstance && typeof window !== 'undefined') {
    workerInstance = new Worker('/sw.js', { type: 'classic' });
  }
  if (!workerInstance) throw new Error('Worker no disponible en este contexto');
  return workerInstance;
}

export async function clasificarFactura(
  textoOcr: string,
  tipoLibro: 'COMPRAS' | 'VENTAS' | 'INGRESOS' | 'EGRESOS',
  onProgress?: (p: number, msg: string) => void,
): Promise<FacturaClasificada> {
  return new Promise((resolve, reject) => {
    const worker = obtenerWorker();

    const handler = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      if (data.type === 'PROGRESS') {
        onProgress?.(data.progress, data.mensaje);
      } else if (data.type === 'RESULT') {
        worker.removeEventListener('message', handler);
        // Validar con Zod antes de usar — nunca confiar ciegamente en el LLM
        const parsed = FacturaClasificadaSchema.safeParse(data.result);
        if (parsed.success) {
          resolve(parsed.data);
        } else {
          reject(new Error('Output del LLM no pasó validación Zod: ' + parsed.error.message));
        }
      } else if (data.type === 'VALIDATION_ERROR') {
        // El worker ya está manejando los reintentos internamente
        onProgress?.(0, `Intento ${data.attempt}: corrigiendo output de Gemma 4...`);
      } else if (data.type === 'ERROR') {
        worker.removeEventListener('message', handler);
        reject(new Error(data.error));
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({
      type: 'CLASSIFY_TEXT',
      payload: { texto: textoOcr, tipoLibro },
    } satisfies WorkerMessage);
  });
}
