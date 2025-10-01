'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, InputGroup, Alert } from 'react-bootstrap';
// import { FaPaperPlane, FaMicrophone, FaStop } from 'react-icons/fa';

interface Message {
  id: string;
  role: 'user' | 'indi' | 'system';
  content: string;
  timestamp: Date;
  data?: any; // Para datos de presentación generada
}

interface IndiChatProps {
  onPresentationGenerated?: (presentation: any) => void;
  className?: string;
}

const IndiChat: React.FC<IndiChatProps> = ({ onPresentationGenerated, className = '' }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presentationContext, setPresentationContext] = useState<{
    topic?: string;
    style?: string;
    audience?: string;
  }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with greeting message
  useEffect(() => {
    const greetingMessage: Message = {
      id: `msg_${Date.now()}_greeting`,
      role: 'indi',
      content: '¡Hola terrícola! 🛸 Soy Indi, tu embajador intergaláctico. ¿Sobre qué tema quieres crear una presentación hipnotizante?',
      timestamp: new Date()
    };
    setMessages([greetingMessage]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Analizar el mensaje para extraer contexto
    const message = userMessage.content.toLowerCase();
    
    // Detectar si el usuario quiere generar una presentación
    if (message.includes('presentación') || message.includes('slides') || message.includes('tema')) {
      // Extraer el tema de la conversación
      const topicMatch = message.match(/sobre\s+(.+?)(?:\.|$)|tema\s+(.+?)(?:\.|$)|acerca\s+de\s+(.+?)(?:\.|$)/);
      const topic = topicMatch ? (topicMatch[1] || topicMatch[2] || topicMatch[3]) : userMessage.content;
      
      setPresentationContext(prev => ({ ...prev, topic }));
      
      const indiResponse: Message = {
        id: `msg_${Date.now()}_indi`,
        role: 'indi',
        content: `¡Excelente! Voy a crear una presentación sobre "${topic}". 

Antes de comenzar, ¿podrías decirme:
1. ¿Para qué audiencia es? (profesional, estudiantes, general)
2. ¿Qué estilo prefieres? (minimalista, creativo, profesional, audaz)
3. ¿Cuántos slides necesitas aproximadamente?

O si prefieres, puedo generar una versión estándar profesional de 10 slides. ¿Qué prefieres?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, indiResponse]);
      setIsLoading(false);
    } else if (presentationContext.topic && (message.includes('sí') || message.includes('adelante') || message.includes('generar') || message.includes('crear'))) {
      // El usuario confirmó, generar la presentación
      await generatePresentationWithAI();
    } else {
      // Respuesta contextual basada en el mensaje
      const indiResponse: Message = {
        id: `msg_${Date.now()}_indi`,
        role: 'indi',
        content: analyzeAndRespond(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, indiResponse]);
      setIsLoading(false);
    }
  };

  const analyzeAndRespond = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('hi')) {
      return '¡Hola! 👋 Soy Indi, tu asistente de presentaciones con IA. Puedo ayudarte a crear presentaciones hipnotizantes sobre cualquier tema. ¿Sobre qué te gustaría crear una presentación hoy?';
    }
    
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
      return `Puedo ayudarte con:
• Crear presentaciones completas con IA
• Generar contenido para slides específicos
• Sugerir mejoras para tu contenido
• Recomendar diseños y estilos
• Crear notas del presentador

¿Qué necesitas hacer hoy?`;
    }
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo')) {
      return 'La generación de presentaciones con IA está disponible en todos los planes. Plan FREE incluye 1 presentación, PROFESSIONAL 5 presentaciones, y BUSINESS tiene presentaciones ilimitadas. ¿Te gustaría crear una ahora?';
    }
    
    return `Entiendo que quieres hablar sobre "${message}". ¿Te gustaría crear una presentación sobre este tema? Puedo generar slides profesionales con contenido relevante y diseño atractivo.`;
  };

  const handleStartNewConversation = () => {
    setMessages([{
      id: `msg_${Date.now()}_greeting`,
      role: 'indi',
      content: '¡Hola de nuevo! 🛸 ¿Sobre qué tema quieres crear tu próxima presentación hipnotizante?',
      timestamp: new Date()
    }]);
  };

  const generatePresentationWithAI = async () => {
    if (!presentationContext.topic) {
      setError('No se ha definido un tema para la presentación');
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Mensaje de estado
    const generatingMessage: Message = {
      id: `msg_${Date.now()}_system`,
      role: 'system',
      content: '🔄 Generando presentación con IA... Esto puede tomar unos segundos.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, generatingMessage]);

    try {
      const response = await fetch('/api/presentations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: presentationContext.topic,
          context: `Presentación solicitada por chat con Indi`,
          numberOfSlides: 10,
          style: presentationContext.style || 'professional',
          targetAudience: presentationContext.audience || 'general',
          tone: 'professional',
          autoSave: true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error generando presentación');
      }

      // Mensaje de éxito
      const successMessage: Message = {
        id: `msg_${Date.now()}_indi_success`,
        role: 'indi',
        content: `✅ ¡Presentación creada exitosamente!

**Título:** ${data.generated.title}
**Descripción:** ${data.generated.description}
**Slides generados:** ${data.generated.slides.length}

Tu presentación ha sido guardada automáticamente. ¿Te gustaría que haga algún ajuste específico?`,
        timestamp: new Date(),
        data: data.presentation
      };
      
      setMessages(prev => [...prev.slice(0, -1), successMessage]); // Reemplazar mensaje de carga

      // Notificar al componente padre
      if (onPresentationGenerated && data.presentation) {
        onPresentationGenerated(data.presentation);
      }

      // Limpiar contexto
      setPresentationContext({});

    } catch (error) {
      console.error('Error generando presentación:', error);
      
      const errorMessage: Message = {
        id: `msg_${Date.now()}_indi_error`,
        role: 'indi',
        content: `❌ Lo siento, ocurrió un error al generar la presentación: ${error instanceof Error ? error.message : 'Error desconocido'}

¿Te gustaría intentar de nuevo con un tema diferente?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev.slice(0, -1), errorMessage]); // Reemplazar mensaje de carga
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePresentation = async () => {
    if (presentationContext.topic) {
      await generatePresentationWithAI();
    } else {
      // Solicitar tema
      const requestMessage: Message = {
        id: `msg_${Date.now()}_indi_request`,
        role: 'indi',
        content: 'Para generar una presentación necesito que me digas sobre qué tema quieres que la haga. ¿Cuál es el tema de tu presentación?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, requestMessage]);
    }
  };

  return (
    <div className={`indi-chat ${className}`} style={{ maxWidth: '100%', height: '500px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mx-3 mt-2 mb-0" dismissible onClose={() => setError(null)}>
          <small>{error}</small>
        </Alert>
      )}
      
      {/* Chat Header */}
      <div className="chat-header p-3 bg-primary text-white rounded-top d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div style={{ fontSize: '1.5rem' }}>🛸</div>
          <div>
            <div className="fw-bold">Indi AI</div>
            <div className="small opacity-75">
              {isGenerating ? 'Generando presentación...' : 
               isLoading ? 'Pensando...' : 
               'Asistente de Presentaciones'}
            </div>
          </div>
        </div>
        <Button 
          variant="outline-light" 
          size="sm"
          onClick={handleStartNewConversation}
          disabled={isLoading || isGenerating}
        >
          Nueva Conversación
        </Button>
      </div>

      {/* Messages Area */}
      <div 
        className="messages-area flex-grow-1 p-3 bg-light"
        style={{ 
          overflowY: 'auto',
          maxHeight: '350px',
          minHeight: '300px'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message mb-3 d-flex ${
              message.role === 'user' ? 'justify-content-end' : 
              message.role === 'system' ? 'justify-content-center' : 
              'justify-content-start'
            }`}
          >
            <div
              className={`message-bubble p-2 px-3 rounded-3 max-w-75 ${
                message.role === 'user' 
                  ? 'bg-primary text-white' 
                  : message.role === 'system'
                  ? 'bg-info bg-opacity-25 border border-info text-info'
                  : 'bg-white border'
              }`}
              style={{
                maxWidth: message.role === 'system' ? '85%' : '75%',
                wordWrap: 'break-word'
              }}
            >
              {message.role === 'indi' && (
                <div className="small text-muted mb-1">
                  🛸 Indi
                </div>
              )}
              {message.role === 'system' && (
                <div className="small text-info mb-1">
                  🤖 Sistema
                </div>
              )}
              <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
              <div className={`small mt-1 ${
                message.role === 'user' ? 'text-white-50' : 
                message.role === 'system' ? 'text-info-emphasis' : 
                'text-muted'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message mb-3 d-flex justify-content-start">
            <div className="message-bubble p-2 px-3 rounded-3 bg-white border">
              <div className="small text-muted mb-1">🛸 Indi</div>
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <span>Analizando datos intergalácticos...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area p-3 bg-white border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Form.Control
              ref={inputRef}
              type="text"
              placeholder="Pregúntame sobre tu presentación..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isLoading}
              style={{ borderColor: isInputFocused ? '#0d6efd' : '#dee2e6' }}
            />
            <Button 
              variant="primary" 
              type="submit"
              disabled={!inputMessage.trim() || isLoading || isGenerating}
            >
              {isLoading || isGenerating ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Enviando...</span>
                </div>
              ) : (
                '📤'
              )}
            </Button>
          </InputGroup>
        </Form>
        
        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-2">
          <Button 
            variant={presentationContext.topic ? "success" : "outline-success"} 
            size="sm"
            onClick={handleGeneratePresentation}
            disabled={isLoading || isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Generando...</span>
                </div>
                Generando...
              </>
            ) : (
              <>✨ Generar Presentación</>
            )}
          </Button>
          <Button 
            variant="outline-secondary" 
            size="sm"
            disabled
            title="Próximamente disponible"
          >
            🎤 Grabar Audio
          </Button>
          {presentationContext.topic && (
            <small className="text-muted d-flex align-items-center ms-2">
              Tema: {presentationContext.topic.substring(0, 30)}{presentationContext.topic.length > 30 ? '...' : ''}
            </small>
          )}
        </div>
      </div>

      <style jsx>{`
        .max-w-75 {
          max-width: 75% !important;
        }
        
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-area::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .messages-area::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .messages-area::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default IndiChat;