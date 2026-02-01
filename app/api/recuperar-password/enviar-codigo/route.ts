import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enviarCodigoRecuperacion } from '@/lib/email';

// Generar código de 6 dígitos
function generarCodigo(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, telefono } = body;

    if (!correo || !telefono) {
      return NextResponse.json(
        { error: 'Correo y teléfono son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findFirst({
      where: {
        correo: correo.toLowerCase().trim(),
        telefono: telefono.trim(),
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'No se encontró un usuario con esos datos' },
        { status: 404 }
      );
    }

    // Generar código
    const codigo = generarCodigo();
    
    // Calcular expiración (10 minutos)
    const expiraEn = new Date();
    expiraEn.setMinutes(expiraEn.getMinutes() + 10);

    // Guardar código en BD
    await prisma.codigoRecuperacion.create({
      data: {
        codigo,
        usuarioId: usuario.id,
        expiraEn,
      },
    });

    // Enviar correo
    const resultado = await enviarCodigoRecuperacion(
      usuario.correo,
      codigo,
      usuario.nombres
    );

    if (!resultado.success) {
      return NextResponse.json(
        { error: 'Error al enviar el correo' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        mensaje: 'Código enviado exitosamente',
        correoEnviado: usuario.correo.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Ocultar parte del correo
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}