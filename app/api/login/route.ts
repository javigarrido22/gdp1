import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, password } = body;

    if (!correo || !password) {
      return NextResponse.json(
        { error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // No devolver la contraseña
    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json(
      { 
        mensaje: 'Inicio de sesión exitoso',
        usuario: usuarioSinPassword 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en el login:', error);
    return NextResponse.json(
      { error: 'Error al procesar el inicio de sesión' },
      { status: 500 }
    );
  }
}