import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, codigo, nuevaPassword } = body;

    // Validar campos
    if (!correo || !codigo || !nuevaPassword) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (nuevaPassword.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findFirst({
      where: {
        correo: correo.toLowerCase().trim(),
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // **VERIFICAR CÓDIGO** - Esta es la parte crítica
    const codigoRecuperacion = await prisma.codigoRecuperacion.findFirst({
      where: {
        usuarioId: usuario.id,
        codigo: codigo.trim(),
        usado: false,
        expiraEn: {
          gt: new Date(), // Código no expirado
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!codigoRecuperacion) {
      return NextResponse.json(
        { error: 'Código inválido o expirado' },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar contraseña
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { password: hashedPassword },
    });

    // Marcar código como usado
    await prisma.codigoRecuperacion.update({
      where: { id: codigoRecuperacion.id },
      data: { usado: true },
    });

    // Opcional: Eliminar todos los códigos antiguos del usuario
    await prisma.codigoRecuperacion.deleteMany({
      where: {
        usuarioId: usuario.id,
        id: { not: codigoRecuperacion.id },
      },
    });

    return NextResponse.json(
      { 
        mensaje: 'Contraseña actualizada exitosamente',
        usuario: {
          id: usuario.id,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al verificar código:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}