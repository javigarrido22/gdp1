import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los egresos de un usuario
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

    const egresos = await prisma.egreso.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      orderBy: { fecha: 'desc' },
    });

    return NextResponse.json({ egresos }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener egresos:', error);
    return NextResponse.json(
      { error: 'Error al obtener egresos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo egreso
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { descripcion, monto, fecha, categoria, usuarioId } = body;

    if (!descripcion || !monto || !categoria || !usuarioId) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const nuevoEgreso = await prisma.egreso.create({
      data: {
        descripcion,
        monto: parseFloat(monto),
        fecha: fecha ? new Date(fecha) : new Date(),
        categoria,
        usuarioId: parseInt(usuarioId),
      },
    });

    return NextResponse.json(
      { mensaje: 'Egreso creado exitosamente', egreso: nuevoEgreso },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear egreso:', error);
    return NextResponse.json(
      { error: 'Error al crear egreso' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un egreso
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const usuarioId = searchParams.get('usuarioId');

    if (!id || !usuarioId) {
      return NextResponse.json(
        { error: 'ID e Usuario ID son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el egreso pertenece al usuario
    const egreso = await prisma.egreso.findFirst({
      where: {
        id: parseInt(id),
        usuarioId: parseInt(usuarioId),
      },
    });

    if (!egreso) {
      return NextResponse.json(
        { error: 'Egreso no encontrado' },
        { status: 404 }
      );
    }

    await prisma.egreso.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { mensaje: 'Egreso eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar egreso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar egreso' },
      { status: 500 }
    );
  }
}