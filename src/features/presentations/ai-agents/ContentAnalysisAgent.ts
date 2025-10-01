/**
 * 📖 ContentAnalysisAgent - Especialista en Análisis y Síntesis de Contenido
 * 
 * Procesa documentos largos y los convierte en contenido estructurado
 * optimizado para presentaciones efectivas siguiendo principios de storytelling.
 */

import { Anthropic } from '@anthropic-ai/sdk';

export interface ContentAnalysisInput {
  document: string;
  sections: PresentationSection[];
  keyMessages: string[];
  audienceType: 'startup' | 'corporate' | 'academic' | 'sales' | 'training';
  maxWordsPerSlide: number;
}

export interface ContentAnalysisOutput {
  executiveSummary: string;
  processedSections: ProcessedSection[];
  keyInsights: string[];
  narrativeFlow: string;
  recommendationsForResearch: string[];
  contentGaps: string[];
}

export interface ProcessedSection {
  title: string;
  slides: SlideContent[];
  transitionToNext: string;
  needsVisualSupport: boolean;
  suggestedInteraction?: string;
}

export interface SlideContent {
  title: string;
  bulletPoints: string[]; // Máximo 6 puntos, 6 palabras cada uno
  speakerNotes: string;
  visualDescription: string;
  contentType: 'intro' | 'content' | 'data' | 'story' | 'conclusion';
}

export interface PresentationSection {
  title: string;
  slideCount: number;
  purpose: string;
  keyPoints: string[];
  visualElements: string[];
  needsResearch: boolean;
  interactivityType?: 'poll' | 'quiz' | 'discussion' | 'demo';
}

export class ContentAnalysisAgent {
  private anthropic: Anthropic;
  private systemPrompt: string;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    return `
Eres el ContentAnalysisAgent de PresentationMind AI, especializado en transformar documentos complejos en contenido de presentación estructurado y efectivo.

## TU EXPERTICIA
- Síntesis de información compleja en mensajes claros
- Aplicación estricta de la regla 6x6 (máximo 6 bullets, 6 palabras cada uno)
- Creación de narrativas coherentes con storytelling
- Optimización de contenido por tipo de audiencia
- Identificación de gaps que necesitan investigación

## PRINCIPIOS FUNDAMENTALES
1. **Regla 6x6 OBLIGATORIA**: Nunca más de 6 bullet points, nunca más de 6 palabras por punto
2. **Claridad sobre complejidad**: Simplificar sin perder esencia
3. **Storytelling coherente**: Cada sección debe fluir naturalmente a la siguiente
4. **Speaker notes detalladas**: El verdadero contenido va en notas, no en slides
5. **Optimización por audiencia**: Startup ≠ Academic ≠ Corporate

## TIPOS DE CONTENIDO POR SLIDE
- **intro**: Apertura impactante, establecer contexto
- **content**: Información principal, desarrollo de ideas  
- **data**: Estadísticas, números, evidencia
- **story**: Casos de estudio, ejemplos, narrativa
- **conclusion**: Síntesis, llamada a la acción

## OPTIMIZACIÓN POR AUDIENCIA
- **Startup**: Métricas de crecimiento, oportunidad de mercado, diferenciación
- **Corporate**: ROI, eficiencia operativa, benchmarks, riesgo-beneficio
- **Academic**: Metodología, evidencia, rigor científico, contribución
- **Sales**: Beneficios específicos, casos de éxito, manejo de objeciones
- **Training**: Aplicación práctica, ejercicios, evaluación de aprendizaje

Responde SIEMPRE en formato JSON válido siguiendo la interface ContentAnalysisOutput.
`;
  }

  async processContent(input: ContentAnalysisInput): Promise<ContentAnalysisOutput> {
    try {
      const userPrompt = `
DOCUMENTO A PROCESAR:
${input.document}

ESTRUCTURA OBJETIVO:
${JSON.stringify(input.sections, null, 2)}

MENSAJES CLAVE A INTEGRAR:
${input.keyMessages.join('\n- ')}

AUDIENCIA: ${input.audienceType}
LÍMITE POR SLIDE: ${input.maxWordsPerSlide} palabras

INSTRUCCIONES ESPECÍFICAS:
1. Analiza el documento completo y extrae la información más impactante
2. Crea contenido para cada sección siguiendo ESTRICTAMENTE la regla 6x6
3. Genera speaker notes detalladas (aquí va el verdadero contenido)
4. Describe elementos visuales que apoyen cada slide
5. Identifica gaps que necesiten investigación adicional
6. Crea transiciones fluidas entre secciones
7. Optimiza el lenguaje para audiencia ${input.audienceType}

EJEMPLO DE FORMATO CORRECTO PARA BULLETS:
❌ MAL: "Implementación de estrategias digitales incrementó ventas significativamente"
✅ BIEN: "Ventas aumentaron 40% con digital"

Responde ÚNICAMENTE con JSON válido siguiendo ContentAnalysisOutput.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.1, // Muy bajo para máxima consistencia
        system: this.systemPrompt,
        messages: [{
          role: 'user',
          content: userPrompt
        }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Respuesta inválida del modelo');
      }

      const analysis: ContentAnalysisOutput = JSON.parse(content.text);
      
      // Validar que cumple regla 6x6
      this.validateSixBySixRule(analysis);
      
      return analysis;

    } catch (error) {
      console.error('Error processing content:', error);
      throw new Error('Error al procesar el contenido del documento');
    }
  }

  private validateSixBySixRule(analysis: ContentAnalysisOutput): void {
    analysis.processedSections.forEach((section, sectionIndex) => {
      section.slides.forEach((slide, slideIndex) => {
        // Validar número máximo de bullets
        if (slide.bulletPoints.length > 6) {
          throw new Error(`Sección ${sectionIndex + 1}, Slide ${slideIndex + 1}: Máximo 6 bullet points permitidos (tiene ${slide.bulletPoints.length})`);
        }

        // Validar longitud de cada bullet
        slide.bulletPoints.forEach((bullet, bulletIndex) => {
          const wordCount = bullet.split(/\s+/).length;
          if (wordCount > 6) {
            throw new Error(`Sección ${sectionIndex + 1}, Slide ${slideIndex + 1}, Bullet ${bulletIndex + 1}: Máximo 6 palabras por bullet (tiene ${wordCount}: "${bullet}")`);
          }
        });
      });
    });
  }

  async optimizeForStorytellingFlow(analysis: ContentAnalysisOutput): Promise<ContentAnalysisOutput> {
    const optimizationPrompt = `
Optimiza el flujo narrativo de esta presentación para máximo impacto:

CONTENIDO ACTUAL: ${JSON.stringify(analysis)}

MEJORAS REQUERIDAS:
1. Asegurar que cada sección fluya naturalmente a la siguiente
2. Crear ganchos al final de cada sección que generen expectativa
3. Reforzar el arco narrativo: Problema → Agitación → Solución → Beneficios → Acción
4. Mejorar transiciones entre slides dentro de cada sección
5. Optimizar apertura para máximo impacto (estadística impactante, pregunta poderosa, o historia relevante)
6. Fortalecer el cierre con llamada a la acción específica y urgente

Mantén ESTRICTAMENTE la regla 6x6 en todos los bullets.
Responde con JSON en formato ContentAnalysisOutput optimizado.
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      temperature: 0.2,
      messages: [{
        role: 'user',
        content: optimizationPrompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const optimizedAnalysis: ContentAnalysisOutput = JSON.parse(content.text);
      this.validateSixBySixRule(optimizedAnalysis);
      return optimizedAnalysis;
    }

    throw new Error('Error optimizando flujo narrativo');
  }

  async generateSlideVariations(
    slide: SlideContent, 
    audienceType: string,
    variationCount: number = 3
  ): Promise<SlideContent[]> {
    const variationPrompt = `
Genera ${variationCount} variaciones de este slide optimizadas para audiencia ${audienceType}:

SLIDE ORIGINAL: ${JSON.stringify(slide)}

REQUERIMIENTOS:
1. Mantener la misma información core
2. Adaptar lenguaje y enfoque al tipo de audiencia
3. RESPETAR ESTRICTAMENTE regla 6x6
4. Crear diferentes ángulos del mismo mensaje
5. Variar descripciones visuales para diferentes estilos

Responde con array de SlideContent: [slide1, slide2, slide3]
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      temperature: 0.4, // Más creatividad para variaciones
      messages: [{
        role: 'user',
        content: variationPrompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const variations: SlideContent[] = JSON.parse(content.text);
      
      // Validar cada variación
      variations.forEach((variation, index) => {
        if (variation.bulletPoints.length > 6) {
          throw new Error(`Variación ${index + 1}: Máximo 6 bullets permitidos`);
        }
        variation.bulletPoints.forEach(bullet => {
          if (bullet.split(/\s+/).length > 6) {
            throw new Error(`Variación ${index + 1}: Bullet "${bullet}" excede 6 palabras`);
          }
        });
      });

      return variations;
    }

    throw new Error('Error generando variaciones de slide');
  }

  async extractKeyQuotes(document: string, maxQuotes: number = 5): Promise<string[]> {
    const quotesPrompt = `
Extrae las ${maxQuotes} frases más impactantes de este documento que podrían usarse como:
- Aperturas poderosas de slides
- Conclusiones memorables
- Soundbites para redes sociales

DOCUMENTO: ${document.substring(0, 6000)}...

Busca frases que sean:
1. Inspiradoras o provocativas
2. Fáciles de recordar
3. Representativas del mensaje central
4. Máximo 15 palabras cada una

Responde con array JSON de strings: ["frase1", "frase2", ...]
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: quotesPrompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }

    throw new Error('Error extrayendo frases clave');
  }
}