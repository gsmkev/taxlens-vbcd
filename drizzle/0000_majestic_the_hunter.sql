CREATE TABLE "dnit_knowledge_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" varchar(50) NOT NULL,
	"descripcion" text,
	"url_indice" text NOT NULL,
	"tamano_bytes" bigint NOT NULL,
	"hash_sha256" varchar(64) NOT NULL,
	"es_actual" boolean DEFAULT false,
	"publicado_en" date NOT NULL,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "esquemas_playground" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"version" integer DEFAULT 1 NOT NULL,
	"definicion" jsonb NOT NULL,
	"activo" boolean DEFAULT true,
	"tipo" varchar(50) DEFAULT 'custom',
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "modelos_registry" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"version" varchar(50) NOT NULL,
	"url_descarga" text NOT NULL,
	"tamano_bytes" bigint NOT NULL,
	"hash_sha256" varchar(64) NOT NULL,
	"hardware_minimo" varchar(100),
	"tipo" varchar(50),
	"activo" boolean DEFAULT true,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plantillas_playground" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid,
	"esquema_id" uuid,
	"nombre" varchar(255) NOT NULL,
	"config_excel" jsonb NOT NULL,
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suscripciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid,
	"estado" varchar(50) DEFAULT 'trial' NOT NULL,
	"fecha_inicio" date NOT NULL,
	"fecha_vencimiento" date NOT NULL,
	"monto_gs" integer DEFAULT 50000 NOT NULL,
	"metodo_pago" varchar(100),
	"referencia_pago" varchar(255),
	"notas" text,
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kinde_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"nombre" varchar(255),
	"plan" varchar(50) DEFAULT 'free' NOT NULL,
	"dispositivos" integer DEFAULT 1,
	"creado_en" timestamp DEFAULT now(),
	"actualizado_en" timestamp DEFAULT now(),
	CONSTRAINT "usuarios_kinde_id_unique" UNIQUE("kinde_id"),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "esquemas_playground" ADD CONSTRAINT "esquemas_playground_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantillas_playground" ADD CONSTRAINT "plantillas_playground_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantillas_playground" ADD CONSTRAINT "plantillas_playground_esquema_id_esquemas_playground_id_fk" FOREIGN KEY ("esquema_id") REFERENCES "public"."esquemas_playground"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;