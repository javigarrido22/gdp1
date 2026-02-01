import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los ingresos de un usuario
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
      orderBy: { fecha: 'desc' },
    });

    return NextResponse.json({ ingresos }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener ingresos:', error);
    return NextResponse.json(
      { error: 'Error al obtener ingresos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo ingreso
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

    const nuevoIngreso = await prisma.ingreso.create({
      data: {
        descripcion,
        monto: parseFloat(monto),
        fecha: fecha ? new Date(fecha) : new Date(),
        categoria,
        usuarioId: parseInt(usuarioId),
      },
    });

    return NextResponse.json(
      { mensaje: 'Ingreso creado exitosamente', ingreso: nuevoIngreso },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear ingreso:', error);
    return NextResponse.json(
      { error: 'Error al crear ingreso' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un ingreso
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

    // Verificar que el ingreso pertenece al usuario
    const ingreso = await prisma.ingreso.findFirst({
      where: {
        id: parseInt(id),
        usuarioId: parseInt(usuarioId),
      },
    });

    if (!ingreso) {
      return NextResponse.json(
        { error: 'Ingreso no encontrado' },
        { status: 404 }
      );
    }

    await prisma.ingreso.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { mensaje: 'Ingreso eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar ingreso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar ingreso' },
      { status: 500 }
    );
  }
}