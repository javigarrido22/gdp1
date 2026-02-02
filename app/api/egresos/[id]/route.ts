import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Actualizar un egreso
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { descripcion, monto, categoria, fecha } = await request.json();
    const id = parseInt(params.id);

    const egresoActualizado = await prisma.egreso.update({
      where: { id },
      data: {
        descripcion,
        monto,
        categoria,
        fecha: new Date(fecha)
      }
    });

    return NextResponse.json(egresoActualizado);
  } catch (error) {
    console.error('Error al actualizar egreso:', error);
    return NextResponse.json(
      { error: 'Error al actualizar egreso' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un egreso
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.egreso.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Egreso eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar egreso:', error);
    return NextResponse.json(
      { error: 'Error al eliminar egreso' },
      { status: 500 }
    );
  }
}