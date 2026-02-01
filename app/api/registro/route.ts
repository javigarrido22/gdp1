import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombres, apellidos, correo, password, telefono } = body;

    // Validar que todos los campos estén presentes
    if (!nombres || !apellidos || !correo || !password || !telefono) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Normalizar correo a minúsculas
    const correoNormalizado = correo.toLowerCase().trim();

    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: correoNormalizado },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        correo: correoNormalizado,
        password: hashedPassword,
        telefono,
      },
    });

    // No devolver la contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;

    return NextResponse.json(
      { 
        mensaje: 'Usuario registrado exitosamente',
        usuario: usuarioSinPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}