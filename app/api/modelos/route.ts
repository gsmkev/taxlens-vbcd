import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { obtenerModelosActivos, obtenerVersionDnitActual } from '@/lib/db/queries';

export async function GET() {
  const { isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const [modelos, dnitVersion] = await Promise.all([
    obtenerModelosActivos(),
    obtenerVersionDnitActual(),
  ]);

  return NextResponse.json({ modelos, dnitVersion });
}
