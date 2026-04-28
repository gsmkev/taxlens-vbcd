import { db } from '@/lib/db';
import { suscripciones } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function tieneAccesoPlayground(usuarioId: string): Promise<boolean> {
  const hoy = new Date().toISOString().split('T')[0];

  const resultado = await db
    .select()
    .from(suscripciones)
    .where(
      and(
        eq(suscripciones.usuarioId, usuarioId),
        eq(suscripciones.estado, 'activo'),
        gte(suscripciones.fechaVencimiento, hoy),
      ),
    )
    .limit(1);

  return resultado.length > 0;
}

export async function estadoSuscripcion(usuarioId: string) {
  const hoy = new Date().toISOString().split('T')[0];

  const resultado = await db
    .select()
    .from(suscripciones)
    .where(eq(suscripciones.usuarioId, usuarioId))
    .orderBy(suscripciones.fechaVencimiento)
    .limit(1);

  if (!resultado.length) return { estado: 'sin_suscripcion' as const, diasRestantes: 0 };

  const sus = resultado[0];
  const vencimiento = new Date(sus.fechaVencimiento);
  const ahora = new Date(hoy);
  const diasRestantes = Math.ceil(
    (vencimiento.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24),
  );

  return { estado: sus.estado as string, diasRestantes: Math.max(0, diasRestantes) };
}
