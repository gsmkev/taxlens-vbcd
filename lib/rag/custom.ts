'use client';

import { opfsLeerArchivo, opfsEscribirArchivo, OPFS_PATHS } from '@/lib/local/opfs';

export interface ChunkCustom {
  id: string;
  nombreDocumento: string;
  texto: string;
  vector: number[];
  score?: number;
}

export interface MetadataDocumento {
  id: string;
  nombre: string;
  tamanoBytes: number;
  cantidadChunks: number;
  estado: 'INDEXANDO' | 'LISTO' | 'ERROR';
  creadoEn: string;
}

let indiceCache: ChunkCustom[] | null = null;

export async function cargarIndiceCustom(): Promise<ChunkCustom[]> {
  if (indiceCache) return indiceCache;

  const buffer = await opfsLeerArchivo(OPFS_PATHS.CUSTOM_INDEX);
  if (!buffer) return [];

  const texto = new TextDecoder().decode(buffer);
  indiceCache = JSON.parse(texto) as ChunkCustom[];
  return indiceCache;
}

export async function agregarChunksAlIndice(chunks: ChunkCustom[]): Promise<void> {
  const indiceExistente = await cargarIndiceCustom();
  const nuevoIndice = [...indiceExistente, ...chunks];

  const json = JSON.stringify(nuevoIndice);
  const buffer = new TextEncoder().encode(json).buffer;
  await opfsEscribirArchivo(OPFS_PATHS.CUSTOM_INDEX, buffer);

  indiceCache = nuevoIndice;
}

export async function eliminarChunksDeDocumento(nombreDocumento: string): Promise<void> {
  const indice = await cargarIndiceCustom();
  const filtrado = indice.filter(c => c.nombreDocumento !== nombreDocumento);

  const json = JSON.stringify(filtrado);
  const buffer = new TextEncoder().encode(json).buffer;
  await opfsEscribirArchivo(OPFS_PATHS.CUSTOM_INDEX, buffer);

  indiceCache = filtrado;
}

function similitudCoseno(a: number[], b: number[]): number {
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  if (!magA || !magB) return 0;
  return a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0) / (magA * magB);
}

export async function buscarEnIndiceCustom(
  vectorConsulta: number[],
  topK = 5,
): Promise<ChunkCustom[]> {
  const indice = await cargarIndiceCustom();
  if (!indice.length) return [];

  return indice
    .map(chunk => ({ ...chunk, score: similitudCoseno(vectorConsulta, chunk.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
