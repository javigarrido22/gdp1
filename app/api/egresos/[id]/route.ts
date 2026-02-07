import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("params en GET:", params); // depuración
    const idNumber = Number(params.id);
    if (isNaN(idNumber)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const egreso = await prisma.egreso.findUnique({
      where: { id: idNumber },
    });

    if (!egreso) {
      return NextResponse.json({ error: "Egreso no encontrado" }, { status: 404 });
    }

    return NextResponse.json(egreso);
  } catch (error: any) {
    console.error("Error al obtener egreso:", error);
    return NextResponse.json(
      { error: error.message || "Error al obtener egreso" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

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

    const egresoActualizado = await prisma.egreso.update({
      where: { id: idNumber },
      data,
    });

    return NextResponse.json(egresoActualizado);
  } catch (error: any) {
    console.error("Error al actualizar egreso:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar egreso" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("params en DELETE:", params); // depuración
    const idNumber = Number(params.id);
    if (isNaN(idNumber)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.egreso.delete({
      where: { id: idNumber },
    });

    return NextResponse.json({ message: "Egreso eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar egreso:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar egreso" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
