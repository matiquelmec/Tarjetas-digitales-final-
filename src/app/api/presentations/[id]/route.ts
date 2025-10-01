import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';

// GET: Obtener una presentación específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptionsSafe);
    const { id } = params;

    // Buscar la presentación
    const presentation = await prisma.presentation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentación no encontrada' },
        { status: 404 }
      );
    }

    // Si la presentación es privada, verificar que el usuario sea el dueño
    if (!presentation.isPublic) {
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (user?.id !== presentation.userId) {
        return NextResponse.json(
          { error: 'No tienes permiso para ver esta presentación' },
          { status: 403 }
        );
      }
    } else {
      // Si es pública, incrementar vistas
      await prisma.presentation.update({
        where: { id },
        data: { 
          views: { increment: 1 }
        }
      });
    }

    return NextResponse.json(presentation);

  } catch (error) {
    console.error('Error obteniendo presentación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una presentación
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { title, description, slides, theme, settings, isPublic, customUrl } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que la presentación pertenece al usuario
    const existingPresentation = await prisma.presentation.findFirst({
      where: {
        id,
        userId: user.id
      }
    });

    if (!existingPresentation) {
      return NextResponse.json(
        { error: 'Presentación no encontrada o no tienes permiso para editarla' },
        { status: 404 }
      );
    }

    // Si se proporciona customUrl, verificar que no esté en uso
    if (customUrl && customUrl !== existingPresentation.customUrl) {
      const urlInUse = await prisma.presentation.findFirst({
        where: {
          customUrl,
          NOT: { id }
        }
      });

      if (urlInUse) {
        return NextResponse.json(
          { error: 'Esta URL personalizada ya está en uso' },
          { status: 400 }
        );
      }
    }

    // Actualizar la presentación
    const updatedPresentation = await prisma.presentation.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(slides !== undefined && { slides }),
        ...(theme !== undefined && { theme }),
        ...(settings !== undefined && { settings }),
        ...(isPublic !== undefined && { isPublic }),
        ...(customUrl !== undefined && { customUrl }),
      }
    });

    return NextResponse.json({ 
      success: true,
      presentation: updatedPresentation,
      message: 'Presentación actualizada exitosamente' 
    });

  } catch (error) {
    console.error('Error actualizando presentación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una presentación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que la presentación pertenece al usuario antes de eliminar
    const presentation = await prisma.presentation.findFirst({
      where: {
        id,
        userId: user.id
      }
    });

    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentación no encontrada o no tienes permiso para eliminarla' },
        { status: 404 }
      );
    }

    // Eliminar la presentación
    await prisma.presentation.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Presentación eliminada exitosamente' 
    });

  } catch (error) {
    console.error('Error eliminando presentación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}