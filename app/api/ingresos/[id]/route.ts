import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener un ingreso por ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const idParam = context.params?.id;
    console.log("ID recibido en GET:", idParam);

    const id = parseInt(idParam, 10);
    if (!idParam || isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const ingreso = await prisma.ingreso.findUnique({ where: { id } });
    if (!ingreso) {
      return NextResponse.json({ error: "Ingreso no encontrado" }, { status: 404 });
    }

    return NextResponse.json(ingreso);
  } catch (error) {
    console.error("Error al obtener ingreso:", error);
    return NextResponse.json({ error: "Error al obtener ingreso" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Actualizar un ingreso
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("params en PUT:", params); // depuración
    const idNumber = Number(params.id);
    if (isNaN(idNumber)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();

    const data: any = {};
    if (body.descripcion !== undefined) data.descripcion = body.descripcion;
    if (body.monto !== undefined) data.monto = parseFloat(body.monto);
    if (body.categoria !== undefined) data.categoria = body.categoria;
    if (body.usuarioId !== undefined) data.usuarioId = Number(body.usuarioId);
    if (body.fecha !== undefined) {
      data.fecha = body.fecha ? new Date(body.fecha) : new Date();
    }

    const ingresoActualizado = await prisma.ingreso.update({
      where: { id: idNumber },
      data,
    });

    return NextResponse.json(ingresoActualizado);
  } catch (error: any) {
    console.error("Error al actualizar igreso:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar igreso" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


// DELETE - Eliminar un ingreso
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const idParam = context.params?.id;
    console.log("ID recibido en DELETE:", idParam);

    const id = parseInt(idParam, 10);
    if (!idParam || isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.ingreso.delete({ where: { id } });

    return NextResponse.json({ mensaje: "Ingreso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar ingreso:", error);
    return NextResponse.json({ error: "Error al eliminar ingreso" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
