'use client';

import { opfsLeerArchivo, OPFS_PATHS } from '@/lib/local/opfs';

export interface ChunkDnit {
  id: string;
  fuente: string;        // "Ley 6380/2019 Art. 14"
  texto: string;
  vector: number[];
  score?: number;
}

let indiceCache: ChunkDnit[] | null = null;

export async function cargarIndiceDnit(): Promise<ChunkDnit[]> {
  if (indiceCache) return indiceCache;

  const buffer = await opfsLeerArchivo(OPFS_PATHS.DNIT_INDEX);
  if (!buffer) {
    throw new Error(
      'Base de conocimiento DNIT no encontrada. Descargala desde el AI Hub.',
    );
  }

  const texto = new TextDecoder().decode(buffer);
  indiceCache = JSON.parse(texto) as ChunkDnit[];
  return indiceCache;
}

// Producto punto para similitud coseno simplificada
function puntoProducto(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
}

function magnitud(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

function similitudCoseno(a: number[], b: number[]): number {
  const magA = magnitud(a);
  const magB = magnitud(b);
  if (magA === 0 || magB === 0) return 0;
  return puntoProducto(a, b) / (magA * magB);
}

export async function buscarEnDnit(
  vectorConsulta: number[],
  topK = 5,
): Promise<ChunkDnit[]> {
  const indice = await cargarIndiceDnit();

  const conScores = indice.map(chunk => ({
    ...chunk,
    score: similitudCoseno(vectorConsulta, chunk.vector),
  }));

  return conScores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function limpiarCacheIndiceDnit(): void {
  indiceCache = null;
}
