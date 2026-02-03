import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log("=== INICIO DE ACTUALIZACIÓN ===");
    
    // Await params en Next.js 15+
    const { id: idString } = await context.params;
    console.log("ID recibido (string):", idString);
    
    const id = parseInt(idString);
    console.log("ID parseado:", id, "Es número?", !isNaN(id));
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("Body completo:", body);
    
    const { nombres, apellidos, correo, telefono } = body;

    // Validaciones básicas
    if (!nombres || !apellidos || !correo || !telefono) {
      console.log("Validación fallida - campos faltantes");
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    console.log("Datos a actualizar:", { id, nombres, apellidos, correo, telefono });

    // Actualizar usuario directamente
    console.log("Ejecutando update en Prisma...");
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: id },
      data: {
        nombres,
        apellidos,
        correo,
        telefono
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        correo: true,
        telefono: true
      }
    });

    console.log("Usuario actualizado exitosamente:", usuarioActualizado);
    return NextResponse.json(usuarioActualizado, { status: 200 });

  } catch (error: any) {
    console.error('=== ERROR COMPLETO ===');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code);
    console.error('Meta:', error.meta);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error al actualizar usuario',
        mensaje: error.message,
        codigo: error.code
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}