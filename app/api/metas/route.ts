import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las metas de un usuario
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

    const metas = await prisma.meta.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ metas }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener metas:', error);
    return NextResponse.json(
      { error: 'Error al obtener metas' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva meta
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, descripcion, montoObjetivo, fechaLimite, categoria, usuarioId } = body;

    if (!nombre || !montoObjetivo || !fechaLimite || !categoria || !usuarioId) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios son requeridos' },
        { status: 400 }
      );
    }

    const nuevaMeta = await prisma.meta.create({
      data: {
        nombre,
        descripcion: descripcion || '',
        montoObjetivo: parseFloat(montoObjetivo),
        fechaLimite: new Date(fechaLimite),
        categoria,
        usuarioId: parseInt(usuarioId),
      },
    });

    return NextResponse.json(
      { mensaje: 'Meta creada exitosamente', meta: nuevaMeta },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear meta:', error);
    return NextResponse.json(
      { error: 'Error al crear meta' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una meta
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, montoActual, completada, usuarioId } = body;

    if (!id || !usuarioId) {
      return NextResponse.json(
        { error: 'ID y Usuario ID son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la meta pertenece al usuario
    const meta = await prisma.meta.findFirst({
      where: {
        id: parseInt(id),
        usuarioId: parseInt(usuarioId),
      },
    });

    if (!meta) {
      return NextResponse.json(
        { error: 'Meta no encontrada' },
        { status: 404 }
      );
    }

    const metaActualizada = await prisma.meta.update({
      where: { id: parseInt(id) },
      data: {
        montoActual: montoActual !== undefined ? parseFloat(montoActual) : meta.montoActual,
        completada: completada !== undefined ? completada : meta.completada,
      },
    });

    return NextResponse.json(
      { mensaje: 'Meta actualizada exitosamente', meta: metaActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar meta:', error);
    return NextResponse.json(
      { error: 'Error al actualizar meta' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una meta
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const usuarioId = searchParams.get('usuarioId');

    if (!id || !usuarioId) {
      return NextResponse.json(
        { error: 'ID y Usuario ID son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la meta pertenece al usuario
    const meta = await prisma.meta.findFirst({
      where: {
        id: parseInt(id),
        usuarioId: parseInt(usuarioId),
      },
    });

    if (!meta) {
      return NextResponse.json(
        { error: 'Meta no encontrada' },
        { status: 404 }
      );
    }

    await prisma.meta.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { mensaje: 'Meta eliminada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar meta:', error);
    return NextResponse.json(
      { error: 'Error al eliminar meta' },
      { status: 500 }
    );
  }
}