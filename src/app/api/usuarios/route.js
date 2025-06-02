import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: usuarios,
      message: 'Usuarios obtenidos correctamente'
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al obtener usuarios'
    }, { status: 500 });
  }
}

// POST - Crear nuevo usuario
export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, apellido, fechanac, active_user } = body;

    // Validación de campos requeridos
    if (!nombre || !apellido || !fechanac) {
      return NextResponse.json({
        success: false,
        error: 'Nombre, apellido y fecha de nacimiento son obligatorios'
      }, { status: 400 });
    }

    // Validar formato de fecha
    const fechaValida = new Date(fechanac);
    if (isNaN(fechaValida.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Formato de fecha inválido'
      }, { status: 400 });
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fechanac: new Date(fechanac),
        active_user: active_user !== undefined ? active_user : true
      }
    });

    return NextResponse.json({
      success: true,
      data: nuevoUsuario,
      message: 'Usuario creado correctamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al crear usuario'
    }, { status: 500 });
  }
}