import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { obtenerUsuarioPorKindeId } from '@/lib/db/queries';
import { estadoSuscripcion } from '@/lib/auth/subscription';

export async function GET() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const kindeUser = await getUser();
  if (!kindeUser?.id) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const usuario = await obtenerUsuarioPorKindeId(kindeUser.id);
  if (!usuario) {
    return NextResponse.json({ estado: 'sin_cuenta', diasRestantes: 0 });
  }

  const estado = await estadoSuscripcion(usuario.id);
  return NextResponse.json(estado);
}
