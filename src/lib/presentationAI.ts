import Anthropic from '@anthropic-ai/sdk';

// Inicializar cliente de Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface SlideContent {
  id: string;
  type: 'title' | 'content' | 'image' | 'chart' | 'bullets' | 'quote';
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    bullets?: string[];
    imageUrl?: string;
    imageCaption?: string;
    quote?: string;
    author?: string;
    chartType?: 'bar' | 'pie' | 'line';
    chartData?: any;
  };
  notes?: string;
  transition?: 'fade' | 'slide' | 'zoom';
}

export interface PresentationTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: {
    title: string;
    subtitle: string;
    body: string;
  };
}

export interface GeneratePresentationParams {
  topic: string;
  context?: string;
  numberOfSlides?: number;
  style?: 'professional' | 'creative' | 'minimalist' | 'bold';
  targetAudience?: string;
  tone?: 'formal' | 'casual' | 'inspirational' | 'educational';
}

export class PresentationAIService {
  
  /**
   * Genera el contenido de una presentación completa usando IA
   */
  async generatePresentation(params: GeneratePresentationParams): Promise<{
    title: string;
    description: string;
    slides: SlideContent[];
    suggestedTheme: PresentationTheme;
  }> {
    const {
      topic,
      context = '',
      numberOfSlides = 10,
      style = 'professional',
      targetAudience = 'general',
      tone = 'professional'
    } = params;

    try {
      const prompt = this.buildPresentationPrompt(topic, context, numberOfSlides, style, targetAudience, tone);
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseAIResponse(content.text);
      }
      
      throw new Error('Respuesta inesperada de la IA');
      
    } catch (error) {
      console.error('Error generando presentación con IA:', error);
      throw new Error('No se pudo generar la presentación');
    }
  }

  /**
   * Genera contenido para un slide individual
   */
  async generateSlideContent(
    topic: string,
    slideType: SlideContent['type'],
    context?: string
  ): Promise<SlideContent> {
    try {
      const prompt = this.buildSlidePrompt(topic, slideType, context);
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return this.parseSlideResponse(content.text, slideType);
      }
      
      throw new Error('Respuesta inesperada de la IA');
      
    } catch (error) {
      console.error('Error generando slide con IA:', error);
      throw new Error('No se pudo generar el contenido del slide');
    }
  }

  /**
   * Mejora el contenido existente de una presentación
   */
  async improveContent(currentContent: string, improvementType: 'clarity' | 'engagement' | 'conciseness'): Promise<string> {
    try {
      const prompt = `Por favor mejora el siguiente contenido de presentación para mayor ${
        improvementType === 'clarity' ? 'claridad' :
        improvementType === 'engagement' ? 'engagement y impacto' :
        'concisión y brevedad'
      }:\n\n${currentContent}\n\nDevuelve solo el contenido mejorado.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        temperature: 0.5,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text.trim();
      }
      
      return currentContent;
      
    } catch (error) {
      console.error('Error mejorando contenido:', error);
      return currentContent;
    }
  }

  /**
   * Genera notas del presentador para un slide
   */
  async generateSpeakerNotes(slideContent: SlideContent): Promise<string> {
    try {
      const prompt = `Genera notas breves del presentador (máximo 3 párrafos) para el siguiente slide:
      
Título: ${slideContent.content.title || ''}
Subtítulo: ${slideContent.content.subtitle || ''}
Contenido: ${JSON.stringify(slideContent.content)}

Las notas deben incluir:
- Puntos clave a enfatizar
- Transición sugerida al siguiente slide
- Tiempo estimado (30 segundos a 2 minutos)`;

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        temperature: 0.6,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text.trim();
      }
      
      return '';
      
    } catch (error) {
      console.error('Error generando notas del presentador:', error);
      return '';
    }
  }

  /**
   * Sugiere imágenes relevantes para el contenido
   */
  async suggestImages(content: string): Promise<string[]> {
    try {
      const prompt = `Sugiere 3 términos de búsqueda de imágenes en inglés para ilustrar el siguiente contenido de presentación. Devuelve solo los términos separados por comas:\n\n${content}`;

      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content_resp = response.content[0];
      if (content_resp.type === 'text') {
        return content_resp.text.split(',').map(term => term.trim());
      }
      
      return [];
      
    } catch (error) {
      console.error('Error sugiriendo imágenes:', error);
      return [];
    }
  }

  /**
   * Construye el prompt para generar una presentación completa
   */
  private buildPresentationPrompt(
    topic: string,
    context: string,
    numberOfSlides: number,
    style: string,
    targetAudience: string,
    tone: string
  ): string {
    return `Genera una presentación profesional sobre "${topic}".

Contexto adicional: ${context || 'N/A'}
Número de slides: ${numberOfSlides}
Estilo visual: ${style}
Audiencia objetivo: ${targetAudience}
Tono: ${tone}

Devuelve la respuesta en el siguiente formato JSON exacto:
{
  "title": "Título de la presentación",
  "description": "Descripción breve de la presentación",
  "slides": [
    {
      "id": "slide_1",
      "type": "title",
      "content": {
        "title": "Título del slide",
        "subtitle": "Subtítulo opcional"
      }
    },
    {
      "id": "slide_2",
      "type": "bullets",
      "content": {
        "title": "Título del slide",
        "bullets": ["Punto 1", "Punto 2", "Punto 3"]
      }
    }
  ],
  "suggestedTheme": {
    "name": "stellar",
    "primaryColor": "#00f6ff",
    "secondaryColor": "#0072ff",
    "backgroundColor": "#0f0c29",
    "fontFamily": "Inter",
    "fontSize": {
      "title": "48px",
      "subtitle": "24px",
      "body": "18px"
    }
  }
}

Tipos de slides disponibles: title, content, bullets, quote, image
Incluye una mezcla variada de tipos de slides.
Asegúrate de que el contenido sea relevante, profesional y bien estructurado.`;
  }

  /**
   * Construye el prompt para generar un slide individual
   */
  private buildSlidePrompt(topic: string, slideType: string, context?: string): string {
    return `Genera contenido para un slide de tipo "${slideType}" sobre el tema "${topic}".

Contexto adicional: ${context || 'N/A'}

Devuelve el contenido en formato JSON según el tipo de slide:
- Para tipo "title": {"title": "...", "subtitle": "..."}
- Para tipo "bullets": {"title": "...", "bullets": ["...", "...", "..."]}
- Para tipo "content": {"title": "...", "text": "..."}
- Para tipo "quote": {"quote": "...", "author": "..."}

El contenido debe ser profesional, conciso y relevante.`;
  }

  /**
   * Parsea la respuesta de la IA a estructura de datos
   */
  private parseAIResponse(response: string): {
    title: string;
    description: string;
    slides: SlideContent[];
    suggestedTheme: PresentationTheme;
  } {
    try {
      // Intentar parsear como JSON
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || 'Presentación sin título',
        description: parsed.description || '',
        slides: parsed.slides || [],
        suggestedTheme: parsed.suggestedTheme || this.getDefaultTheme()
      };
    } catch (error) {
      // Si falla el parseo, crear una estructura por defecto
      console.error('Error parseando respuesta de IA:', error);
      return {
        title: 'Nueva Presentación',
        description: 'Presentación generada con IA',
        slides: this.generateDefaultSlides(),
        suggestedTheme: this.getDefaultTheme()
      };
    }
  }

  /**
   * Parsea la respuesta para un slide individual
   */
  private parseSlideResponse(response: string, slideType: SlideContent['type']): SlideContent {
    try {
      const parsed = JSON.parse(response);
      return {
        id: `slide_${Date.now()}`,
        type: slideType,
        content: parsed,
        transition: 'fade'
      };
    } catch (error) {
      // Retornar slide por defecto si falla el parseo
      return this.getDefaultSlide(slideType);
    }
  }

  /**
   * Genera slides por defecto
   */
  private generateDefaultSlides(): SlideContent[] {
    return [
      {
        id: 'slide_1',
        type: 'title',
        content: {
          title: 'Título de Presentación',
          subtitle: 'Subtítulo'
        }
      },
      {
        id: 'slide_2',
        type: 'bullets',
        content: {
          title: 'Puntos Clave',
          bullets: ['Punto 1', 'Punto 2', 'Punto 3']
        }
      },
      {
        id: 'slide_3',
        type: 'content',
        content: {
          title: 'Conclusión',
          text: 'Resumen de los puntos principales'
        }
      }
    ];
  }

  /**
   * Obtiene un slide por defecto según el tipo
   */
  private getDefaultSlide(type: SlideContent['type']): SlideContent {
    const defaults: Record<SlideContent['type'], SlideContent> = {
      title: {
        id: `slide_${Date.now()}`,
        type: 'title',
        content: { title: 'Nuevo Título', subtitle: 'Subtítulo' }
      },
      content: {
        id: `slide_${Date.now()}`,
        type: 'content',
        content: { title: 'Contenido', text: 'Texto del slide' }
      },
      bullets: {
        id: `slide_${Date.now()}`,
        type: 'bullets',
        content: { title: 'Puntos', bullets: ['Punto 1', 'Punto 2'] }
      },
      image: {
        id: `slide_${Date.now()}`,
        type: 'image',
        content: { title: 'Imagen', imageUrl: '', imageCaption: '' }
      },
      chart: {
        id: `slide_${Date.now()}`,
        type: 'chart',
        content: { title: 'Gráfico', chartType: 'bar', chartData: {} }
      },
      quote: {
        id: `slide_${Date.now()}`,
        type: 'quote',
        content: { quote: 'Cita inspiradora', author: 'Autor' }
      }
    };

    return defaults[type];
  }

  /**
   * Obtiene un tema por defecto
   */
  private getDefaultTheme(): PresentationTheme {
    return {
      name: 'stellar',
      primaryColor: '#00f6ff',
      secondaryColor: '#0072ff',
      backgroundColor: '#0f0c29',
      fontFamily: 'Inter',
      fontSize: {
        title: '48px',
        subtitle: '24px',
        body: '18px'
      }
    };
  }
}

// Exportar instancia singleton
export const presentationAI = new PresentationAIService();