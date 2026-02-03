import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);
    
    console.log("ID recibido:", params.id, "ID parseado:", id);
    
    if (isNaN(id)) {
      console.error("ID es NaN");
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    console.log("Datos recibidos para actualizar:", body);

    // Verifica que la meta existe
    const metaExistente = await prisma.meta.findUnique({
      where: { id }
    });

    if (!metaExistente) {
      return NextResponse.json(
        { error: "Meta no encontrada" },
        { status: 404 }
      );
    }

    // Validación: si intenta marcar como completada, verificar el monto
    if (body.completada === true) {
      if (metaExistente.montoActual < metaExistente.montoObjetivo) {
        return NextResponse.json(
          { 
            error: "No puedes marcar esta meta como completada",
            mensaje: `Aún te faltan $${(metaExistente.montoObjetivo - metaExistente.montoActual).toLocaleString('es-CL')} para completar esta meta.`
          },
          { status: 400 }
        );
      }
    }

    // Prepara los datos para actualizar
    const dataToUpdate: any = {};
    
    if (body.titulo !== undefined) dataToUpdate.titulo = body.titulo;
    if (body.montoObjetivo !== undefined) dataToUpdate.montoObjetivo = parseFloat(body.montoObjetivo);
    if (body.montoActual !== undefined) dataToUpdate.montoActual = parseFloat(body.montoActual);
    if (body.fechaLimite !== undefined) {
      dataToUpdate.fechaLimite = body.fechaLimite ? new Date(body.fechaLimite) : null;
    }
    if (body.completada !== undefined) dataToUpdate.completada = body.completada;

    console.log("Datos a actualizar:", dataToUpdate);

    const metaActualizada = await prisma.meta.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json(metaActualizada);
  } catch (error: any) {
    console.error("Error detallado al actualizar meta:", error);
    return NextResponse.json(
      { 
        error: "Error al actualizar la meta",
        detalles: error.message,
        codigo: error.code
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    await prisma.meta.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Meta eliminada exitosamente" });
  } catch (error: any) {
    console.error("Error al eliminar meta:", error);
    return NextResponse.json(
      { 
        error: "Error al eliminar la meta",
        detalles: error.message
      },
      { status: 500 }
    );
  }
}