import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST - Verificar correo y actualizar contraseña
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, telefono, nuevaPassword } = body;

    if (!correo || !telefono || !nuevaPassword) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por correo y teléfono
    const usuario = await prisma.usuario.findFirst({
      where: {
        correo: correo.toLowerCase().trim(),
        telefono: telefono.trim(),
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'No se encontró un usuario con ese correo y teléfono' },
        { status: 404 }
      );
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    // Actualizar la contraseña
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { password: hashedPassword },
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
    console.error('Error al recuperar contraseña:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}