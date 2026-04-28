import {
  pgTable, uuid, varchar, text, integer,
  boolean, date, timestamp, jsonb, bigint,
} from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  kindeId: varchar('kinde_id', { length: 255 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  nombre: varchar('nombre', { length: 255 }),
  plan: varchar('plan', { length: 50 }).notNull().default('free'),
  dispositivos: integer('dispositivos').default(1),
  creadoEn: timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
});

export const suscripciones = pgTable('suscripciones', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }),
  estado: varchar('estado', { length: 50 }).notNull().default('trial'),
  // 'trial' | 'activo' | 'vencido' | 'cancelado'
  fechaInicio: date('fecha_inicio').notNull(),
  fechaVencimiento: date('fecha_vencimiento').notNull(),
  montoGs: integer('monto_gs').notNull().default(50000),
  metodoPago: varchar('metodo_pago', { length: 100 }),
  referenciaPago: varchar('referencia_pago', { length: 255 }),
  notas: text('notas'),
  creadoEn: timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
});

export const esquemasPlayground = pgTable('esquemas_playground', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  version: integer('version').notNull().default(1),
  definicion: jsonb('definicion').notNull(),
  activo: boolean('activo').default(true),
  tipo: varchar('tipo', { length: 50 }).default('custom'),
  // 'custom' | 'marangatu_ventas' | 'marangatu_compras' | 'ire' | 'irp_rsp'
  creadoEn: timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
});

export const plantillasPlayground = pgTable('plantillas_playground', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }),
  esquemaId: uuid('esquema_id').references(() => esquemasPlayground.id, { onDelete: 'set null' }),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  configExcel: jsonb('config_excel').notNull(),
  creadoEn: timestamp('creado_en').defaultNow(),
  actualizadoEn: timestamp('actualizado_en').defaultNow(),
});

// Solo lectura para usuarios — gestionado por el dev
export const modelosRegistry = pgTable('modelos_registry', {
  id: varchar('id', { length: 100 }).primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  version: varchar('version', { length: 50 }).notNull(),
  urlDescarga: text('url_descarga').notNull(),
  tamanoBytes: bigint('tamano_bytes', { mode: 'number' }).notNull(),
  hashSha256: varchar('hash_sha256', { length: 64 }).notNull(),
  hardwareMinimo: varchar('hardware_minimo', { length: 100 }),
  tipo: varchar('tipo', { length: 50 }),
  // 'ocr' | 'llm' | 'embedding'
  activo: boolean('activo').default(true),
  creadoEn: timestamp('creado_en').defaultNow(),
});

export const dnitKnowledgeVersions = pgTable('dnit_knowledge_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: varchar('version', { length: 50 }).notNull(),
  descripcion: text('descripcion'),
  urlIndice: text('url_indice').notNull(),
  tamanoBytes: bigint('tamano_bytes', { mode: 'number' }).notNull(),
  hashSha256: varchar('hash_sha256', { length: 64 }).notNull(),
  esActual: boolean('es_actual').default(false),
  publicadoEn: date('publicado_en').notNull(),
  creadoEn: timestamp('creado_en').defaultNow(),
});

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;
export type Suscripcion = typeof suscripciones.$inferSelect;
export type EsquemaPlayground = typeof esquemasPlayground.$inferSelect;
export type PlantillaPlayground = typeof plantillasPlayground.$inferSelect;
export type ModeloRegistry = typeof modelosRegistry.$inferSelect;
export type DnitKnowledgeVersion = typeof dnitKnowledgeVersions.$inferSelect;
