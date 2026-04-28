import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  obtenerUsuarioPorKindeId,
  obtenerEsquemasDeUsuario,
  guardarEsquema,
  actualizarEsquema,
  eliminarEsquema,
} from '@/lib/db/queries';
import { tieneAccesoPlayground } from '@/lib/auth/subscription';
import { EsquemaCamposSchema } from '@/lib/ai/schemas';

async function resolverUsuario() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) return null;
  const kindeUser = await getUser();
  if (!kindeUser?.id) return null;
  return obtenerUsuarioPorKindeId(kindeUser.id);
}

export async function GET() {
  const usuario = await resolverUsuario();
  if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const tieneAcceso = await tieneAccesoPlayground(usuario.id);
  if (!tieneAcceso) {
    return NextResponse.json({ error: 'Requiere plan AI Playground' }, { status: 403 });
  }

  const esquemas = await obtenerEsquemasDeUsuario(usuario.id);
  return NextResponse.json({ esquemas });
}

export async function POST(req: NextRequest) {
  const usuario = await resolverUsuario();
  if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const tieneAcceso = await tieneAccesoPlayground(usuario.id);
  if (!tieneAcceso) {
    return NextResponse.json({ error: 'Requiere plan AI Playground' }, { status: 403 });
  }

  const body = await req.json();

  // Validar que la definición cumple el schema
  const parsed = EsquemaCamposSchema.safeParse(body.definicion);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Schema inválido', detalles: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const esquema = await guardarEsquema(
    usuario.id,
    body.nombre,
    parsed.data,
    body.descripcion,
    body.tipo,
  );

  return NextResponse.json({ esquema }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const usuario = await resolverUsuario();
  if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const esquema = await actualizarEsquema(body.id, usuario.id, {
    nombre: body.nombre,
    definicion: body.definicion,
    descripcion: body.descripcion,
  });

  return NextResponse.json({ esquema });
}

export async function DELETE(req: NextRequest) {
  const usuario = await resolverUsuario();
  if (!usuario) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  await eliminarEsquema(id, usuario.id);
  return NextResponse.json({ ok: true });
}
