import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ingreso = await prisma.ingreso.findUnique({
      where: { id: parseInt(id) },
    });

    if (!ingreso) {
      return NextResponse.json(
        { error: 'Ingreso no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(ingreso);
  } catch (error) {
    console.error('Error al obtener ingreso:', error);
    return NextResponse.json(
      { error: 'Error al obtener ingreso' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const ingresoActualizado = await prisma.ingreso.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(ingresoActualizado);
  } catch (error) {
    console.error('Error al actualizar ingreso:', error);
    return NextResponse.json(
      { error: 'Error al actualizar ingreso' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    await prisma.ingreso.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Ingreso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar ingreso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar ingreso' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}