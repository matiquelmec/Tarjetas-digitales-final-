import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { researchService } from '@/features/presentations/api/researchService';
import type { ConversationState, IndiResponse } from '@/features/presentations/types/research';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptionsSafe);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { sessionId, message, currentState } = body;

    // Validate required fields
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Session ID and message are required' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 5000 characters.' },
        { status: 400 }
      );
    }

    // Process the conversation with Indi Research Service
    const conversationState: ConversationState = {
      sessionId,
      currentStep: currentState?.currentStep || 'initial',
      topic: currentState?.topic || '',
      context: currentState?.context,
      researchData: currentState?.researchData,
      messages: currentState?.messages || []
    };

    // Process the message through research service
    const indiResponse: IndiResponse = await researchService.processConversation(
      message,
      conversationState
    );

    // Log the interaction for analytics (optional)
    console.log(`[Indi Research] User ${session.user.id}: ${message.substring(0, 100)}...`);
    console.log(`[Indi Research] Response: ${indiResponse.message.substring(0, 100)}...`);

    return NextResponse.json(indiResponse);

  } catch (error) {
    console.error('Research API error:', error);
    
    // Return user-friendly error message
    return NextResponse.json(
      { 
        error: 'Hubo un problema con la comunicación intergaláctica. Por favor, inténtalo de nuevo.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to interact with Indi.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to interact with Indi.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to interact with Indi.' },
    { status: 405 }
  );
}