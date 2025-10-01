import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';

// GET: Obtener todas las presentaciones del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        presentations: {
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            theme: true,
            isPublic: true,
            views: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    });

    if (!user) {
      // Retornar array vacío en lugar de error 404
      return NextResponse.json({ presentations: [] });
    }

    return NextResponse.json({ presentations: user.presentations || [] });
  } catch (error) {
    console.error('Error obteniendo presentaciones:', error);
    // Siempre retornar 200 con array vacío para evitar crashes en frontend
    return NextResponse.json(
      { 
        presentations: [],
        error: 'Error interno del servidor'
      },
      { status: 200 }
    );
  }
}

// POST: Crear nueva presentación
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, slides, theme, settings } = body;

    // Validación básica
    if (!title || !slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { error: 'Datos inválidos. Se requiere título y slides.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar límites según el plan del usuario
    const presentationCount = await prisma.presentation.count({
      where: { userId: user.id }
    });

    const planLimits = {
      FREE: 1,
      PROFESSIONAL: 5,
      BUSINESS: 25,
      ENTERPRISE: -1 // Ilimitado
    };

    const limit = planLimits[user.plan];
    if (limit !== -1 && presentationCount >= limit) {
      return NextResponse.json(
        { 
          error: `Has alcanzado el límite de presentaciones para tu plan ${user.plan}. Actualiza tu plan para crear más presentaciones.`,
          upgradeRequired: true 
        },
        { status: 403 }
      );
    }

    // Crear la presentación
    const presentation = await prisma.presentation.create({
      data: {
        title,
        description: description || '',
        slides: slides || [],
        theme: theme || {
          name: 'stellar',
          primaryColor: '#00f6ff',
          secondaryColor: '#0072ff',
          backgroundColor: '#0f0c29',
          fontFamily: 'Inter'
        },
        settings: settings || {
          autoPlay: false,
          loop: false,
          showProgress: true,
          allowDownload: false,
          transitionEffect: 'slide'
        },
        userId: user.id,
      }
    });

    return NextResponse.json({ 
      success: true,
      presentation,
      message: 'Presentación creada exitosamente' 
    });

  } catch (error) {
    console.error('Error creando presentación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar múltiples presentaciones
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron IDs para eliminar' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar solo las presentaciones que pertenecen al usuario
    const result = await prisma.presentation.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true,
      deleted: result.count,
      message: `${result.count} presentacion(es) eliminada(s)` 
    });

  } catch (error) {
    console.error('Error eliminando presentaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}