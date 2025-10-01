/**
 * 🤖 API Endpoint - Generación de Presentaciones con PresentationMind AI
 * 
 * Integra el sistema multi-agente con la plataforma existente
 * para crear presentaciones inmersivas desde documentos subidos.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { PresentationMindSystem, PresentationMindInput } from '@/features/presentations/ai-agents/PresentationMindSystem';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptionsSafe);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Verificar límites del plan del usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { plan: true, id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar límites de generación según el plan
    const existingPresentations = await prisma.presentation.count({
      where: { 
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Último mes
        }
      }
    });

    const planLimits = {
      FREE: 2,
      PROFESSIONAL: 10,
      BUSINESS: 50,
      ENTERPRISE: -1 // Ilimitado
    };

    const limit = planLimits[user.plan as keyof typeof planLimits] || 2;
    
    if (limit !== -1 && existingPresentations >= limit) {
      return NextResponse.json(
        { 
          error: 'Límite de presentaciones alcanzado para tu plan',
          limit,
          current: existingPresentations,
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    // Parsear datos de la request
    const body = await request.json();
    const {
      document,
      title,
      audienceType = 'corporate',
      duration = 15,
      objective = 'inform',
      interactivityLevel = 'medium',
      requiresResearch = true,
      customInstructions
    } = body;

    // Validar inputs requeridos
    if (!document || document.trim().length < 100) {
      return NextResponse.json(
        { error: 'El documento debe tener al menos 100 caracteres' },
        { status: 400 }
      );
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      );
    }

    // Verificar variables de entorno necesarias
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!anthropicKey) {
      console.error('Missing ANTHROPIC_API_KEY');
      return NextResponse.json(
        { error: 'Configuración de IA incompleta' },
        { status: 500 }
      );
    }

    // Si faltan variables de Supabase, usar modo básico sin investigación
    let presentationMind;
    let hasResearchCapability = false;
    
    if (supabaseUrl && supabaseKey) {
      presentationMind = new PresentationMindSystem(
        anthropicKey,
        supabaseUrl,
        supabaseKey
      );
      hasResearchCapability = true;
    } else {
      console.warn('Supabase not configured - running in basic mode without research');
      // Crear versión simplificada que solo usa Anthropic
      presentationMind = new PresentationMindSystem(
        anthropicKey,
        '', // Supabase URL vacío
        ''  // Supabase key vacío
      );
    }

    // Preparar input para el sistema
    const aiInput: PresentationMindInput = {
      document: document.trim(),
      audienceType,
      duration,
      objective,
      interactivityLevel,
      requiresResearch: requiresResearch && user.plan !== 'FREE' && hasResearchCapability, // Solo si Supabase está disponible
      customInstructions
    };

    // Generar presentación con IA
    console.log(`🤖 Iniciando generación de presentación AI para usuario ${user.id}`);
    const startTime = Date.now();

    const aiResult = await presentationMind.createPresentation(aiInput);

    const processingTime = Date.now() - startTime;
    console.log(`✅ Presentación generada en ${processingTime}ms`);

    // Guardar presentación en base de datos
    const savedPresentation = await prisma.presentation.create({
      data: {
        title: aiResult.presentation.metadata.title,
        description: aiResult.presentation.metadata.subtitle || '',
        content: JSON.stringify(aiResult.presentation),
        userId: user.id,
        metadata: JSON.stringify({
          aiGenerated: true,
          originalDocument: document.substring(0, 1000), // Solo primeros 1000 chars
          audienceType,
          duration,
          objective,
          qualityScore: aiResult.qualityScore,
          processingTime,
          agentReports: aiResult.agentReports,
          version: '1.0.0'
        })
      }
    });

    // Registrar métricas de uso
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'AI_PRESENTATION_GENERATED',
        details: JSON.stringify({
          presentationId: savedPresentation.id,
          audienceType,
          duration,
          qualityScore: aiResult.qualityScore,
          processingTimeMs: processingTime,
          slidesGenerated: aiResult.presentation.metadata.totalSlides,
          researchEnabled: requiresResearch
        })
      }
    }).catch(error => {
      console.error('Error logging user activity:', error);
      // No bloquear la respuesta por error de logging
    });

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      presentation: {
        id: savedPresentation.id,
        title: aiResult.presentation.metadata.title,
        subtitle: aiResult.presentation.metadata.subtitle,
        totalSlides: aiResult.presentation.metadata.totalSlides,
        estimatedDuration: aiResult.presentation.metadata.estimatedDuration,
        qualityScore: aiResult.qualityScore,
        createdAt: savedPresentation.createdAt,
        slides: aiResult.presentation.slides.map(slide => ({
          id: slide.id,
          title: slide.title,
          content: slide.content,
          hasInteractiveElement: !!slide.interactiveComponent,
          estimatedTime: slide.estimatedTime
        }))
      },
      metrics: {
        processingTime,
        qualityScore: aiResult.qualityScore,
        agentPerformance: {
          contentAnalysis: aiResult.agentReports.contentAnalysis.ruleCompliance,
          researchQuality: aiResult.agentReports.research.credibilityAverage,
          narrativeCoherence: aiResult.agentReports.contentAnalysis.narrativeCoherence
        }
      },
      recommendations: aiResult.recommendations,
      usage: {
        presentationsThisMonth: existingPresentations + 1,
        planLimit: limit,
        remainingGenerations: limit === -1 ? 'Ilimitado' : Math.max(0, limit - existingPresentations - 1)
      }
    });

  } catch (error) {
    console.error('Error generating AI presentation:', error);
    
    // Manejo específico de errores conocidos
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Error de configuración del servicio AI' },
        { status: 500 }
      );
    }

    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.' },
        { status: 429 }
      );
    }

    if (error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'El proceso está tomando más tiempo del esperado. Intenta con un documento más corto.' },
        { status: 408 }
      );
    }

    // Error genérico
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al generar la presentación',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener estado de generaciones del usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { plan: true, id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const presentationsThisMonth = await prisma.presentation.count({
      where: { 
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      }
    });

    const planLimits = {
      FREE: 2,
      PROFESSIONAL: 10, 
      BUSINESS: 50,
      ENTERPRISE: -1
    };

    const limit = planLimits[user?.plan as keyof typeof planLimits] || 2;

    return NextResponse.json({
      usage: {
        presentationsThisMonth,
        planLimit: limit,
        remainingGenerations: limit === -1 ? 'Ilimitado' : Math.max(0, limit - presentationsThisMonth),
        plan: user?.plan || 'FREE'
      },
      capabilities: {
        maxDocumentLength: user?.plan === 'FREE' ? 5000 : 50000, // caracteres
        researchEnabled: user?.plan !== 'FREE',
        maxDuration: user?.plan === 'FREE' ? 10 : 60, // minutos
        customInstructions: user?.plan !== 'FREE',
        priorityProcessing: ['BUSINESS', 'ENTERPRISE'].includes(user?.plan || '')
      }
    });

  } catch (error) {
    console.error('Error getting AI generation status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}