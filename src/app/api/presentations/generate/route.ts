import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';
import { presentationAI } from '@/lib/presentationAI';

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
    const {
      topic,
      context,
      numberOfSlides = 10,
      style = 'professional',
      targetAudience = 'general',
      tone = 'professional',
      autoSave = true
    } = body;

    // Validación básica
    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: 'Se requiere un tema válido (mínimo 3 caracteres)' },
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

    // Verificar límites del plan antes de generar
    if (autoSave) {
      const presentationCount = await prisma.presentation.count({
        where: { userId: user.id }
      });

      const planLimits = {
        FREE: 1,
        PROFESSIONAL: 5,
        BUSINESS: 25,
        ENTERPRISE: -1
      };

      const limit = planLimits[user.plan];
      if (limit !== -1 && presentationCount >= limit) {
        return NextResponse.json(
          { 
            error: `Has alcanzado el límite de presentaciones para tu plan ${user.plan}`,
            upgradeRequired: true,
            canGenerate: false
          },
          { status: 403 }
        );
      }
    }

    // Generar presentación con IA
    const generatedContent = await presentationAI.generatePresentation({
      topic,
      context,
      numberOfSlides,
      style,
      targetAudience,
      tone
    });

    let savedPresentation = null;

    // Guardar automáticamente si está habilitado
    if (autoSave) {
      savedPresentation = await prisma.presentation.create({
        data: {
          title: generatedContent.title,
          description: generatedContent.description,
          slides: generatedContent.slides,
          theme: generatedContent.suggestedTheme,
          settings: {
            autoPlay: false,
            loop: false,
            showProgress: true,
            allowDownload: false,
            transitionEffect: 'slide'
          },
          userId: user.id,
        }
      });
    }

    return NextResponse.json({
      success: true,
      presentation: savedPresentation,
      generated: generatedContent,
      message: autoSave 
        ? 'Presentación generada y guardada exitosamente' 
        : 'Presentación generada exitosamente (no guardada)'
    });

  } catch (error) {
    console.error('Error generando presentación con IA:', error);
    
    // Manejar error específico de API key faltante
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Servicio de IA no configurado. Contacta al administrador.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error generando presentación. Por favor intenta de nuevo.' },
      { status: 500 }
    );
  }
}

// Endpoint para mejorar contenido existente
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      content,
      improvementType = 'clarity'
    } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Se requiere contenido para mejorar' },
        { status: 400 }
      );
    }

    const improvedContent = await presentationAI.improveContent(
      content,
      improvementType as 'clarity' | 'engagement' | 'conciseness'
    );

    return NextResponse.json({
      success: true,
      original: content,
      improved: improvedContent
    });

  } catch (error) {
    console.error('Error mejorando contenido:', error);
    return NextResponse.json(
      { error: 'Error mejorando contenido' },
      { status: 500 }
    );
  }
}