import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'Usuario ID es requerido' },
        { status: 400 }
      );
    }

    const ingresos = await prisma.ingreso.findMany({
      where: { usuarioId: parseInt(usuarioId) },
    });

    const egresos = await prisma.egreso.findMany({
      where: { usuarioId: parseInt(usuarioId) },
    });

    const totalIngresos = ingresos.reduce((sum: number, ingreso: { monto: number | any }) => sum + Number(ingreso.monto), 0);
    const totalEgresos = egresos.reduce((sum: number, egreso: { monto: number | any }) => sum + Number(egreso.monto), 0);
    const balance = totalIngresos - totalEgresos;

    return NextResponse.json(
      {
        totalIngresos,
        totalEgresos,
        balance,
        cantidadIngresos: ingresos.length,
        cantidadEgresos: egresos.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    return NextResponse.json(
      { error: 'Error al obtener resumen' },
      { status: 500 }
    );
  }
}