import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener usuario por ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID de usuario inválido'
      }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: usuario,
      message: 'Usuario obtenido correctamente'
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al obtener usuario'
    }, { status: 500 });
  }
}

// PUT - Actualizar usuario
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nombre, apellido, fechanac, active_user } = body;

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID de usuario inválido'
      }, { status: 400 });
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuarioExistente) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

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

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fechanac: new Date(fechanac),
        active_user: active_user !== undefined ? active_user : usuarioExistente.active_user
      }
    });

    return NextResponse.json({
      success: true,
      data: usuarioActualizado,
      message: 'Usuario actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al actualizar usuario'
    }, { status: 500 });
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID de usuario inválido'
      }, { status: 400 });
    }

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuarioExistente) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    await prisma.usuario.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al eliminar usuario'
    }, { status: 500 });
  }
}