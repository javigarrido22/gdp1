import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { correo, codigo } = await request.json();

    if (!correo || !codigo) {
      return NextResponse.json(
        { error: 'Correo y código son obligatorios' },
        { status: 400 }
      );
    }

    // Buscar el usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Buscar el código de recuperación
    const codigoRecuperacion = await prisma.codigoRecuperacion.findFirst({
      where: {
        usuarioId: usuario.id,
        codigo: codigo,
        usado: false,
        expiraEn: {
          gte: new Date()
        }
      }
    });

    if (!codigoRecuperacion) {
      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 400 }
      );
    }

    // Marcar el código como usado
    await prisma.codigoRecuperacion.update({
      where: { id: codigoRecuperacion.id },
      data: { usado: true }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Código verificado correctamente',
      usuarioId: usuario.id
    });

  } catch (error) {
    console.error('Error al verificar código:', error);
    return NextResponse.json(
      { error: 'Error al verificar código' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}