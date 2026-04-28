'use client';

import type { ChunkDnit } from './dnit';
import type { ChunkCustom } from './custom';

export interface ChunkFusionado {
  id: string;
  fuente: string;
  texto: string;
  score: number;
  origen: 'DNIT' | 'CUSTOM';
}

// Fusión de resultados de ambos índices, normalizada por score
export function fusionarResultados(
  chunksDnit: ChunkDnit[],
  chunksCustom: ChunkCustom[],
  pesosDnit = 0.6,
  pesosCustom = 0.4,
): ChunkFusionado[] {
  const fusionados: ChunkFusionado[] = [
    ...chunksDnit.map(c => ({
      id: c.id,
      fuente: c.fuente,
      texto: c.texto,
      score: (c.score ?? 0) * pesosDnit,
      origen: 'DNIT' as const,
    })),
    ...chunksCustom.map(c => ({
      id: c.id,
      fuente: c.nombreDocumento,
      texto: c.texto,
      score: (c.score ?? 0) * pesosCustom,
      origen: 'CUSTOM' as const,
    })),
  ];

  return fusionados
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
