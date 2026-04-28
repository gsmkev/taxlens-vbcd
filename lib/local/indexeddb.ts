'use client';

import type { FacturaProcesada, SesionProcesamiento, ConfigLocal } from '@/types/factura';

const DB_NAME = 'taxlens_local';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

async function abrirDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('facturas_procesadas')) {
        const store = db.createObjectStore('facturas_procesadas', { keyPath: 'id' });
        store.createIndex('periodo', 'periodo', { unique: false });
        store.createIndex('tipo_libro', 'tipoLibro', { unique: false });
        store.createIndex('estado', 'estado', { unique: false });
      }

      if (!db.objectStoreNames.contains('sesiones_procesamiento')) {
        const store = db.createObjectStore('sesiones_procesamiento', { keyPath: 'id' });
        store.createIndex('estado', 'estado', { unique: false });
      }

      if (!db.objectStoreNames.contains('config_local')) {
        db.createObjectStore('config_local', { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains('errores_validacion')) {
        const store = db.createObjectStore('errores_validacion', { keyPath: 'id' });
        store.createIndex('facturaId', 'facturaId', { unique: false });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onerror = () => reject(request.error);
  });
}

function transaccion<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const db = await abrirDB();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = operation(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ── Facturas ──────────────────────────────────────────────────────────────────

export async function guardarFactura(factura: FacturaProcesada): Promise<void> {
  await transaccion('facturas_procesadas', 'readwrite', store => store.put(factura));
}

export async function obtenerFactura(id: string): Promise<FacturaProcesada | undefined> {
  return transaccion('facturas_procesadas', 'readonly', store => store.get(id));
}

export async function obtenerFacturasPorPeriodo(
  periodo: string,
  tipoLibro?: string,
): Promise<FacturaProcesada[]> {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('facturas_procesadas', 'readonly');
    const store = tx.objectStore('facturas_procesadas');
    const index = store.index('periodo');
    const request = index.getAll(periodo);
    request.onsuccess = () => {
      let resultados = request.result as FacturaProcesada[];
      if (tipoLibro) {
        resultados = resultados.filter(f => f.tipoLibro === tipoLibro);
      }
      resolve(resultados);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function actualizarFactura(
  id: string,
  cambios: Partial<FacturaProcesada>,
): Promise<void> {
  const existente = await obtenerFactura(id);
  if (!existente) throw new Error(`Factura ${id} no encontrada`);
  const actualizada = { ...existente, ...cambios, actualizadoEn: new Date().toISOString() };
  await guardarFactura(actualizada);
}

export async function eliminarFactura(id: string): Promise<void> {
  await transaccion('facturas_procesadas', 'readwrite', store => store.delete(id));
}

// ── Sesiones ──────────────────────────────────────────────────────────────────

export async function guardarSesion(sesion: SesionProcesamiento): Promise<void> {
  await transaccion('sesiones_procesamiento', 'readwrite', store => store.put(sesion));
}

export async function obtenerTodasLasSesiones(): Promise<SesionProcesamiento[]> {
  return transaccion('sesiones_procesamiento', 'readonly', store => store.getAll());
}

// ── Config ────────────────────────────────────────────────────────────────────

export async function guardarConfig(key: string, value: unknown): Promise<void> {
  const entrada: ConfigLocal = { key, value, actualizadoEn: new Date().toISOString() };
  await transaccion('config_local', 'readwrite', store => store.put(entrada));
}

export async function obtenerConfig<T>(key: string): Promise<T | undefined> {
  const entrada = await transaccion<ConfigLocal | undefined>(
    'config_local',
    'readonly',
    store => store.get(key),
  );
  return entrada?.value as T | undefined;
}

// ── Errores de validación (Instructor.js) ─────────────────────────────────────

export async function logErrorValidacion(
  facturaId: string,
  intento: number,
  zodError: string,
  jsonParcial: unknown,
): Promise<void> {
  const db = await abrirDB();
  const tx = db.transaction('errores_validacion', 'readwrite');
  const store = tx.objectStore('errores_validacion');
  store.put({
    id: `${facturaId}_intento${intento}_${Date.now()}`,
    facturaId,
    intento,
    zodError,
    jsonParcial,
    timestamp: new Date().toISOString(),
  });
}
