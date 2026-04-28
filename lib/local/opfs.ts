'use client';

// Abstracción sobre OPFS (Origin Private File System)
// Para modelos ONNX grandes e índices vectoriales

export const OPFS_PATHS = {
  MODELS_DIR: 'models',
  KNOWLEDGE_DIR: 'knowledge',
  ORIGINALS_DIR: 'originals',
  DNIT_INDEX: 'knowledge/dnit-index-2025-Q1.json',
  CUSTOM_INDEX: 'knowledge/custom-user-index.json',
} as const;

async function getRootDir(): Promise<FileSystemDirectoryHandle> {
  return navigator.storage.getDirectory();
}

async function getOrCreateDir(
  root: FileSystemDirectoryHandle,
  path: string,
): Promise<FileSystemDirectoryHandle> {
  const parts = path.split('/');
  let dir = root;
  for (const part of parts) {
    dir = await dir.getDirectoryHandle(part, { create: true });
  }
  return dir;
}

export async function opfsEsDisponible(): Promise<boolean> {
  try {
    await navigator.storage.getDirectory();
    return true;
  } catch {
    return false;
  }
}

export async function opfsEscribirArchivo(
  rutaRelativa: string,
  data: ArrayBuffer | Blob,
  onProgress?: (bytes: number) => void,
): Promise<void> {
  const root = await getRootDir();
  const partes = rutaRelativa.split('/');
  const nombreArchivo = partes.pop()!;
  const dirPath = partes.join('/');

  let dir = root;
  if (dirPath) {
    dir = await getOrCreateDir(root, dirPath);
  }

  const fileHandle = await dir.getFileHandle(nombreArchivo, { create: true });
  const writable = await fileHandle.createWritable();

  if (data instanceof Blob) {
    const arrayBuffer = await data.arrayBuffer();
    await writable.write(arrayBuffer);
    onProgress?.(arrayBuffer.byteLength);
  } else {
    await writable.write(data);
    onProgress?.(data.byteLength);
  }

  await writable.close();
}

export async function opfsLeerArchivo(rutaRelativa: string): Promise<ArrayBuffer | null> {
  try {
    const root = await getRootDir();
    const partes = rutaRelativa.split('/');
    const nombreArchivo = partes.pop()!;
    const dirPath = partes.join('/');

    let dir = root;
    if (dirPath) {
      for (const parte of dirPath.split('/')) {
        dir = await dir.getDirectoryHandle(parte);
      }
    }

    const fileHandle = await dir.getFileHandle(nombreArchivo);
    const file = await fileHandle.getFile();
    return file.arrayBuffer();
  } catch {
    return null;
  }
}

export async function opfsArchivoExiste(rutaRelativa: string): Promise<boolean> {
  const data = await opfsLeerArchivo(rutaRelativa);
  return data !== null;
}

export async function opfsEliminarArchivo(rutaRelativa: string): Promise<void> {
  const root = await getRootDir();
  const partes = rutaRelativa.split('/');
  const nombreArchivo = partes.pop()!;
  const dirPath = partes.join('/');

  let dir = root;
  if (dirPath) {
    for (const parte of dirPath.split('/')) {
      dir = await dir.getDirectoryHandle(parte);
    }
  }

  await dir.removeEntry(nombreArchivo);
}

export async function opfsTamanioUsado(): Promise<{ bytes: number; gb: string }> {
  try {
    const estimate = await navigator.storage.estimate();
    const bytes = estimate.usage ?? 0;
    const gb = (bytes / (1024 ** 3)).toFixed(2);
    return { bytes, gb };
  } catch {
    return { bytes: 0, gb: '0.00' };
  }
}

// Descarga un modelo desde URL con progreso
export async function descargarModelo(
  modelId: string,
  url: string,
  hashSha256: string,
  onProgress?: (porcentaje: number, mbDescargados: number, mbTotal: number) => void,
): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error descargando modelo: ${response.status}`);

  const contentLength = parseInt(response.headers.get('content-length') ?? '0', 10);
  const reader = response.body!.getReader();
  const chunks: Uint8Array[] = [];
  let bytesRecibidos = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    bytesRecibidos += value.length;
    if (contentLength > 0) {
      const porcentaje = Math.round((bytesRecibidos / contentLength) * 100);
      const mbDescargados = bytesRecibidos / (1024 ** 2);
      const mbTotal = contentLength / (1024 ** 2);
      onProgress?.(porcentaje, mbDescargados, mbTotal);
    }
  }

  const buffer = new Uint8Array(bytesRecibidos);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }

  // Verificar hash SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (hashHex !== hashSha256) {
    throw new Error('Verificación de integridad fallida. El archivo descargado está corrupto o fue modificado.');
  }

  await opfsEscribirArchivo(`${OPFS_PATHS.MODELS_DIR}/${modelId}.onnx`, buffer.buffer);
}
