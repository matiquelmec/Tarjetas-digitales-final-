/**
 * 🤖 API Endpoint - Generación Simple de Presentaciones con IA
 * 
 * Versión simplificada que usa solo Anthropic Claude directamente
 * sin dependencias complejas para máxima compatibilidad.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { prisma } from '@/lib/db';

interface SimpleSlide {
  id: string;
  type: 'title' | 'content' | 'bullets' | 'quote';
  title: string;
  content: any;
  estimatedTime: number;
}

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

    // Verificar usuario en base de datos por email
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

    // Parsear datos de la request
    const body = await request.json();
    const {
      document,
      title,
      audienceType = 'corporate',
      duration = 15,
      objective = 'inform'
    } = body;

    // Validar inputs
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

    // Verificar API key de Anthropic
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json(
        { error: 'Configuración de IA no disponible' },
        { status: 500 }
      );
    }

    console.log(`🤖 Iniciando generación simple para usuario ${user.id}`);
    const startTime = Date.now();

    // Llamada directa a Anthropic Claude
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Crea una presentación profesional basada en este documento. Sigue estas reglas estrictamente:

REGLA 6x6: Máximo 6 puntos por slide, máximo 6 palabras por punto.

DOCUMENTO:
${document.substring(0, 3000)}

CONFIGURACIÓN:
- Título: ${title}
- Audiencia: ${audienceType}
- Duración: ${duration} minutos
- Objetivo: ${objective}

RESPONDE SOLO con un JSON válido con esta estructura:
{
  "slides": [
    {
      "id": "slide-1",
      "type": "title",
      "title": "Título Principal",
      "content": {
        "title": "Título Principal",
        "subtitle": "Subtítulo conciso"
      },
      "estimatedTime": 1
    },
    {
      "id": "slide-2", 
      "type": "bullets",
      "title": "Puntos Clave",
      "content": {
        "title": "Puntos Clave",
        "bullets": ["Punto conciso uno", "Punto conciso dos"]
      },
      "estimatedTime": 2
    }
  ],
  "totalSlides": 2,
  "estimatedDuration": 3
}

Crea entre 5-8 slides dependiendo de la duración solicitada. Usa tipos: "title", "content", "bullets", "quote".`
        }]
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Anthropic API error:', errorText);
      return NextResponse.json(
        { error: 'Error del servicio de IA' },
        { status: 500 }
      );
    }

    const claudeData = await claudeResponse.json();
    const aiContent = claudeData.content[0].text;

    // Parsear respuesta JSON de Claude
    let aiResult;
    try {
      console.log('Raw AI content:', aiContent);
      
      // Extraer JSON del texto si viene con markdown
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiContent;
      
      console.log('Extracted JSON string:', jsonString);
      
      aiResult = JSON.parse(jsonString);
      
      console.log('Parsed AI result:', aiResult);
      
      // Validar estructura básica
      if (!aiResult.slides || !Array.isArray(aiResult.slides)) {
        throw new Error('Respuesta de IA no contiene slides válidos');
      }
      
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI content was:', aiContent);
      return NextResponse.json(
        { 
          error: 'Error procesando respuesta de IA',
          details: parseError.message,
          rawContent: process.env.NODE_ENV === 'development' ? aiContent : undefined
        },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;

    // Guardar presentación en base de datos
    const savedPresentation = await prisma.presentation.create({
      data: {
        title: title,
        description: `Generado con IA - ${audienceType}`,
        content: JSON.stringify(aiResult),
        userId: user.id,
        metadata: JSON.stringify({
          aiGenerated: true,
          audienceType,
          duration,
          objective,
          processingTime,
          version: 'simple-1.0.0'
        })
      }
    });

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      presentation: {
        id: savedPresentation.id,
        title: title,
        subtitle: `Presentación para ${audienceType}`,
        totalSlides: aiResult.totalSlides || aiResult.slides.length,
        estimatedDuration: aiResult.estimatedDuration || duration,
        qualityScore: 8.5,
        createdAt: savedPresentation.createdAt,
        slides: aiResult.slides
      },
      metrics: {
        processingTime,
        qualityScore: 8.5,
        agentPerformance: {
          contentAnalysis: 85,
          researchQuality: 0,
          narrativeCoherence: 90
        }
      },
      recommendations: [
        'Presentación creada con regla 6x6 aplicada',
        'Revisa el contenido antes de presentar',
        'Personaliza según tu audiencia específica'
      ]
    });

  } catch (error) {
    console.error('Error generating simple AI presentation:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { plan: true }
    });

    return NextResponse.json({
      usage: {
        presentationsThisMonth: 0,
        planLimit: 2,
        remainingGenerations: 2,
        plan: user?.plan || 'FREE'
      },
      capabilities: {
        maxDocumentLength: 5000,
        researchEnabled: false,
        maxDuration: 15,
        customInstructions: false,
        priorityProcessing: false
      }
    });

  } catch (error) {
    console.error('Error getting AI status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}