import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📥 Datos recibidos en API:', body);

    const { nombres, apellidos, correo, password, telefono } = body;

    // Validar que todos los campos estén presentes
    if (!nombres || !apellidos || !correo || !password || !telefono) {
      console.log('❌ Faltan campos requeridos');
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Normalizar correo a minúsculas
    const correoNormalizado = correo.toLowerCase().trim();
    console.log('📧 Correo normalizado:', correoNormalizado);

    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: correoNormalizado },
    });

    if (usuarioExistente) {
      console.log('⚠️ Usuario ya existe');
      return NextResponse.json(
        { error: 'El correo ya está registrado' },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    console.log('🔐 Encriptando contraseña...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    console.log('💾 Intentando crear usuario en BD...');
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        correo: correoNormalizado,
        password: hashedPassword,
        telefono,
      },
    });

    console.log('✅ Usuario creado exitosamente:', nuevoUsuario.id);

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombres: nuevoUsuario.nombres,
        apellidos: nuevoUsuario.apellidos,
        correo: nuevoUsuario.correo,
      },
    });

  } catch (error) {
    console.error('💥 Error completo en registro:', error);
    return NextResponse.json(
      { error: 'Error al procesar el registro' },
      { status: 500 }
    );
  }
}