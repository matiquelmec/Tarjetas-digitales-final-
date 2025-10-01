/**
 * 🧪 API Test Endpoint - Prueba básica de generación AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 AI Test endpoint called');
    
    // Verificar autenticación básica
    const session = await getServerSession(authOptionsSafe);
    console.log('Session:', session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);

    const { document, title, audienceType = 'corporate' } = body;

    if (!document || !title) {
      return NextResponse.json(
        { error: 'Documento y título son requeridos' },
        { status: 400 }
      );
    }

    // Simulación de procesamiento AI
    console.log('🤖 Simulating AI processing...');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay

    // Respuesta simulada
    const mockPresentation = {
      id: `test-${Date.now()}`,
      metadata: {
        title: title,
        subtitle: 'Generado con IA (versión de prueba)',
        totalSlides: 8,
        estimatedDuration: 10,
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      },
      slides: [
        {
          id: 'slide-1',
          title: title,
          content: {
            bulletPoints: ['Presentación generada exitosamente', 'Sistema AI funcionando', 'Versión de prueba'],
            keyMessage: title,
            contentType: 'intro'
          },
          speakerNotes: 'Esta es una presentación de prueba generada por el sistema AI.',
          estimatedTime: 60
        },
        {
          id: 'slide-2',
          title: 'Contenido Principal',
          content: {
            bulletPoints: ['Punto clave 1', 'Punto clave 2', 'Punto clave 3'],
            keyMessage: 'Contenido procesado automáticamente',
            contentType: 'content'
          },
          speakerNotes: `Contenido basado en: ${document.substring(0, 100)}...`,
          estimatedTime: 90
        }
      ]
    };

    console.log('✅ Mock presentation created successfully');

    return NextResponse.json({
      success: true,
      presentation: mockPresentation,
      metrics: {
        processingTime: 2000,
        qualityScore: 8.5
      },
      message: 'Presentación de prueba generada exitosamente. El sistema AI está funcionando.'
    });

  } catch (error) {
    console.error('❌ Error in AI test endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error.message,
        endpoint: 'ai-test'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Test endpoint is working',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
}