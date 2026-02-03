import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ metas });
  } catch (error) {
    console.error('Error al obtener metas:', error);
    return NextResponse.json(
      { error: 'Error al obtener metas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Datos recibidos para crear meta:", body);

    if (!body.usuarioId || !body.titulo || !body.montoObjetivo) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios son requeridos' },
        { status: 400 }
      );
    }

    // Preparar los datos con tipos correctos
    const dataToCreate: any = {
      titulo: body.titulo,
      montoObjetivo: parseFloat(body.montoObjetivo),
      montoActual: parseFloat(body.montoActual || "0"),
      fechaInicio: new Date(),
      completada: false,
      usuarioId: parseInt(body.usuarioId)
    };

    // Solo agregar campos opcionales si tienen valor
    if (body.descripcion) {
      dataToCreate.descripcion = body.descripcion;
    }

    if (body.fechaLimite) {
      dataToCreate.fechaLimite = new Date(body.fechaLimite);
    }

    if (body.categoria) {
      dataToCreate.categoria = body.categoria;
    }

    const nuevaMeta = await prisma.meta.create({
      data: dataToCreate
    });

    return NextResponse.json(nuevaMeta);
  } catch (error: any) {
    console.error('Error al crear meta:', error);
    return NextResponse.json(
      { 
        error: 'Error al crear la meta',
        detalles: error.message
      },
      { status: 500 }
    );
  }
}