'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useIndi } from '@/hooks/useIndi';
import type {
  ConversationState,
  ConversationMessage,
  IndiResponse,
  PresentationStructure,
  TextAnalysisInput,
  TextAnalysisResult
} from '../types/research';

export const useIndiResearch = () => {
  const { setState: setIndiState, setMessage: setIndiMessage } = useIndi();
  
  const [conversationState, setConversationState] = useState<ConversationState>({
    sessionId: '',
    currentStep: 'initial',
    topic: '',
    messages: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>('');

  // Initialize new conversation session
  const startNewConversation = useCallback(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionIdRef.current = sessionId;
    
    setConversationState({
      sessionId,
      currentStep: 'initial',
      topic: '',
      messages: []
    });
    
    setError(null);
    setIndiState('greeting');
    setIndiMessage('¡Hola terrícola! 🛸 Soy Indi, tu embajador intergaláctico. ¿Sobre qué tema quieres crear una presentación hipnotizante?');
  }, [setIndiState, setIndiMessage]);

  // Send message to Indi
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);
    setIndiState('thinking');
    setIndiMessage('Analizando datos intergalácticos...');
    
    // Add user message to conversation
    const userMsg: ConversationMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: userMessage.trim(),
      timestamp: new Date()
    };

    setConversationState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg]
    }));

    try {
      // Call research API
      const response = await fetch('/api/presentations/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: userMessage,
          currentState: conversationState
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación intergaláctica');
      }

      const indiResponse: IndiResponse = await response.json();
      
      // Add Indi's response to conversation
      const indiMsg: ConversationMessage = {
        id: `msg_${Date.now()}_indi`,
        role: 'indi',
        content: indiResponse.message,
        timestamp: new Date(),
        data: indiResponse
      };

      setConversationState(prev => ({
        ...prev,
        messages: [...prev.messages, indiMsg],
        currentStep: getNextStep(indiResponse.state),
        researchData: indiResponse.researchData || prev.researchData
      }));

      // Update Indi's state and message
      setIndiState(mapResponseStateToIndiState(indiResponse.state));
      setIndiMessage(indiResponse.message);

    } catch (error) {
      console.error('Research error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      
      setIndiState('error');
      setIndiMessage('¡Ups! Hubo interferencia en las comunicaciones intergalácticas. Intentemos de nuevo.');
      
      const errorMsg: ConversationMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'indi',
        content: 'Error en la comunicación. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };

      setConversationState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMsg]
      }));
    } finally {
      setIsLoading(false);
    }
  }, [conversationState, isLoading, setIndiState, setIndiMessage]);

  // Analyze text document
  const analyzeText = useCallback(async (input: TextAnalysisInput): Promise<TextAnalysisResult | null> => {
    setIsLoading(true);
    setIndiState('thinking');
    setIndiMessage('Analizando tu documento con tecnología intergaláctica...');

    try {
      const response = await fetch('/api/presentations/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Error al analizar el documento');
      }

      const result: TextAnalysisResult = await response.json();
      
      setIndiState('success');
      setIndiMessage('¡Análisis completo! He encontrado ideas fascinantes en tu documento.');
      
      return result;
    } catch (error) {
      console.error('Text analysis error:', error);
      setError(error instanceof Error ? error.message : 'Error en el análisis');
      setIndiState('error');
      setIndiMessage('Error al analizar el documento. Verificando conexiones intergalácticas...');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setIndiState, setIndiMessage]);

  // Generate presentation from research
  const generatePresentation = useCallback(async (structure?: PresentationStructure): Promise<string | null> => {
    if (!conversationState.researchData) {
      setError('No hay datos de investigación disponibles');
      return null;
    }

    setIsLoading(true);
    setIndiState('thinking');
    setIndiMessage('Creando tu presentación hipnotizante... 🎨✨');

    try {
      const response = await fetch('/api/presentations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          researchData: conversationState.researchData,
          structure: structure || conversationState.suggestedStructure,
          context: conversationState.context
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar la presentación');
      }

      const { presentationId } = await response.json();
      
      setIndiState('celebrating');
      setIndiMessage('¡Presentación creada con éxito! Lista para hipnotizar a tu audiencia. 🎉');
      
      return presentationId;
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Error en la generación');
      setIndiState('error');
      setIndiMessage('Error creando la presentación. Recalibrando sistemas...');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationState, setIndiState, setIndiMessage]);

  // Get conversation history
  const getConversationHistory = useCallback(() => {
    return conversationState.messages;
  }, [conversationState.messages]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setConversationState({
      sessionId: '',
      currentStep: 'initial',
      topic: '',
      messages: []
    });
    setError(null);
    setIndiState('normal');
    setIndiMessage('');
  }, [setIndiState, setIndiMessage]);

  // Auto-initialize on mount
  useEffect(() => {
    if (!sessionIdRef.current) {
      startNewConversation();
    }
  }, [startNewConversation]);

  return {
    // State
    conversationState,
    isLoading,
    error,
    
    // Actions
    sendMessage,
    analyzeText,
    generatePresentation,
    startNewConversation,
    clearConversation,
    getConversationHistory,
    
    // Computed properties
    canGenerate: conversationState.researchData && conversationState.currentStep !== 'initial',
    currentStep: conversationState.currentStep,
    hasResearchData: !!conversationState.researchData
  };
};

// Helper functions
function getNextStep(responseState: string): ConversationState['currentStep'] {
  switch (responseState) {
    case 'clarifying':
      return 'gathering_context';
    case 'researching':
      return 'researching';
    case 'analyzing':
      return 'structuring';
    case 'ready':
      return 'generating';
    default:
      return 'gathering_context';
  }
}

function mapResponseStateToIndiState(responseState: string) {
  switch (responseState) {
    case 'researching':
    case 'analyzing':
      return 'thinking';
    case 'ready':
      return 'success';
    case 'clarifying':
      return 'normal';
    default:
      return 'normal';
  }
}

export default useIndiResearch;