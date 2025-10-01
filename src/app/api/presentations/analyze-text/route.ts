import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptionsSafe } from '@/lib/auth-safe';
import { researchService } from '@/features/presentations/api/researchService';
import type { TextAnalysisInput, TextAnalysisResult } from '@/features/presentations/types/research';

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
    const { text, type = 'document' } = body;

    // Validate required fields
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    // Validate text length
    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Text is too short. Please provide at least 50 characters for meaningful analysis.' },
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Text is too long. Please keep it under 50,000 characters.' },
        { status: 400 }
      );
    }

    // Create analysis input
    const analysisInput: TextAnalysisInput = {
      text,
      type,
      userId: session.user.id
    };

    // Analyze the text using research service
    const analysisResult: TextAnalysisResult = await researchService.analyzeText(analysisInput);

    // Log the analysis for analytics (optional)
    console.log(`[Text Analysis] User ${session.user.id} analyzed ${text.split(' ').length} words`);

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('Text analysis API error:', error);
    
    // Return user-friendly error message
    return NextResponse.json(
      { 
        error: 'Error analyzing your text. Our intergalactic systems are recalibrating. Please try again.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

// Handle file uploads for document analysis
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsSafe);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Handle file upload (for future implementation)
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload TXT, PDF, DOC, or DOCX files.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // TODO: Implement file parsing and text extraction
    // This would involve using libraries like pdf-parse, mammoth (for docx), etc.
    
    return NextResponse.json(
      { error: 'File upload analysis is not yet implemented. Please paste your text directly.' },
      { status: 501 }
    );

  } catch (error) {
    console.error('File analysis error:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze text or PUT to upload files.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze text or PUT to upload files.' },
    { status: 405 }
  );
}