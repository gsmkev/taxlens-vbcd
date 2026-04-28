import { eq, and, gte } from 'drizzle-orm';
import { db } from './index';
import {
  usuarios, suscripciones, esquemasPlayground,
  plantillasPlayground, modelosRegistry, dnitKnowledgeVersions,
} from './schema';

export async function obtenerUsuarioPorKindeId(kindeId: string) {
  const resultado = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.kindeId, kindeId))
    .limit(1);
  return resultado[0] ?? null;
}

export async function crearOActualizarUsuario(kindeId: string, email: string, nombre?: string) {
  const existente = await obtenerUsuarioPorKindeId(kindeId);
  if (existente) return existente;

  const [nuevo] = await db
    .insert(usuarios)
    .values({ kindeId, email, nombre })
    .returning();
  return nuevo;
}

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

export async function obtenerSuscripcionActiva(usuarioId: string) {
  const hoy = new Date().toISOString().split('T')[0];
  const resultado = await db
    .select()
    .from(suscripciones)
    .where(
      and(
        eq(suscripciones.usuarioId, usuarioId),
        gte(suscripciones.fechaVencimiento, hoy),
      ),
    )
    .orderBy(suscripciones.fechaVencimiento)
    .limit(1);
  return resultado[0] ?? null;
}

export async function obtenerEsquemasDeUsuario(usuarioId: string) {
  return db
    .select()
    .from(esquemasPlayground)
    .where(and(
      eq(esquemasPlayground.usuarioId, usuarioId),
      eq(esquemasPlayground.activo, true),
    ));
}

export async function guardarEsquema(
  usuarioId: string,
  nombre: string,
  definicion: unknown,
  descripcion?: string,
  tipo = 'custom',
) {
  const [esquema] = await db
    .insert(esquemasPlayground)
    .values({ usuarioId, nombre, definicion, descripcion, tipo })
    .returning();
  return esquema;
}

export async function actualizarEsquema(
  id: string,
  usuarioId: string,
  updates: { nombre?: string; definicion?: unknown; descripcion?: string },
) {
  const [esquema] = await db
    .update(esquemasPlayground)
    .set({ ...updates, actualizadoEn: new Date() })
    .where(and(
      eq(esquemasPlayground.id, id),
      eq(esquemasPlayground.usuarioId, usuarioId),
    ))
    .returning();
  return esquema;
}

export async function eliminarEsquema(id: string, usuarioId: string) {
  await db
    .update(esquemasPlayground)
    .set({ activo: false })
    .where(and(
      eq(esquemasPlayground.id, id),
      eq(esquemasPlayground.usuarioId, usuarioId),
    ));
}

export async function obtenerModelosActivos() {
  return db
    .select()
    .from(modelosRegistry)
    .where(eq(modelosRegistry.activo, true));
}

export async function obtenerVersionDnitActual() {
  const resultado = await db
    .select()
    .from(dnitKnowledgeVersions)
    .where(eq(dnitKnowledgeVersions.esActual, true))
    .limit(1);
  return resultado[0] ?? null;
}

export async function obtenerPlantillasDeUsuario(usuarioId: string) {
  return db
    .select()
    .from(plantillasPlayground)
    .where(eq(plantillasPlayground.usuarioId, usuarioId));
}
