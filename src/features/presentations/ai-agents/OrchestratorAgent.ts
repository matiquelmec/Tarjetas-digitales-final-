/**
 * 🎯 OrchestratorAgent - Director Ejecutivo del Sistema PresentationMind AI
 * 
 * Responsable de coordinar todos los agentes y crear el plan estratégico
 * de la presentación basado en documentos subidos y contexto de audiencia.
 */

import { Anthropic } from '@anthropic-ai/sdk';

export interface PresentationContext {
  document: string;
  audienceType: 'startup' | 'corporate' | 'academic' | 'sales' | 'training';
  duration: number; // en minutos
  objective: 'inform' | 'persuade' | 'sell' | 'teach' | 'inspire';
  interactivityLevel: 'low' | 'medium' | 'high';
}

export interface PresentationPlan {
  title: string;
  subtitle: string;
  totalSlides: number;
  sections: PresentationSection[];
  keyMessages: string[];
  callToAction: string;
  interactiveElements: InteractiveElement[];
  designTheme: string;
  estimatedDuration: number;
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

export interface InteractiveElement {
  type: 'icebreaker' | 'poll' | 'quiz' | 'discussion' | 'activity';
  slidePosition: number;
  description: string;
  duration: number; // en minutos
}

export class OrchestratorAgent {
  private anthropic: Anthropic;
  private systemPrompt: string;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    return `
Eres el OrchestratorAgent de PresentationMind AI, un sistema especializado en crear presentaciones inmersivas y profesionales.

## TU MISIÓN
Analizar documentos y crear planes estratégicos de presentación que:
- Sigan principios de presentaciones efectivas (6x6, storytelling, visual-first)
- Integren elementos interactivos para máximo engagement
- Optimicen para el tipo de audiencia y contexto específico
- Coordinen otros agentes especializados según necesidades

## PRINCIPIOS DE PRESENTACIONES EFECTIVAS
1. **Regla 6x6**: Máximo 6 bullets, 6 palabras por bullet
2. **Storytelling**: Inicio impactante → Problema → Solución → Acción
3. **Visual First**: Imágenes y gráficos > Texto siempre
4. **Engagement**: Interacción cada 3-4 slides máximo
5. **Data-Driven**: Estadísticas actuales que generen impacto

## ESTRUCTURA OBLIGATORIA
- **Apertura impactante** (estadística, pregunta, historia)
- **Agenda visual** con tiempo estimado por sección
- **Desarrollo con storytelling** coherente
- **Elementos interactivos** estratégicamente distribuidos
- **Llamada a la acción** clara y específica
- **Cierre memorable** con siguiente paso definido

## TIPOS DE AUDIENCIA Y ADAPTACIONES
- **Startup**: Enfoque en crecimiento, métricas, inversión
- **Corporate**: ROI, eficiencia, benchmarks de industria  
- **Academic**: Rigor, metodología, evidencia científica
- **Sales**: Beneficios, casos de éxito, objeciones comunes
- **Training**: Práctica, aplicación, evaluación de aprendizaje

Responde SIEMPRE en formato JSON válido con la estructura PresentationPlan.
`;
  }

  async createPresentationPlan(context: PresentationContext): Promise<PresentationPlan> {
    try {
      const userPrompt = `
CONTEXTO DE LA PRESENTACIÓN:
- Documento: ${context.document.substring(0, 8000)}...
- Audiencia: ${context.audienceType}
- Duración: ${context.duration} minutos
- Objetivo: ${context.objective}
- Nivel de interactividad: ${context.interactivityLevel}

Analiza este documento y crea un plan estratégico de presentación que maximice el impacto y engagement. 

REQUERIMIENTOS ESPECÍFICOS:
1. Título impactante que capture la esencia del documento
2. Entre 10-25 slides según duración (1-2 slides por minuto)
3. Secciones lógicas con storytelling coherente
4. Elementos interactivos cada 3-4 slides
5. Identificar qué secciones necesitan investigación adicional
6. Llamada a la acción específica y medible

Responde ÚNICAMENTE con JSON válido siguiendo la interface PresentationPlan.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.3,
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

      const plan: PresentationPlan = JSON.parse(content.text);
      
      // Validar estructura del plan
      this.validatePresentationPlan(plan);
      
      return plan;

    } catch (error) {
      console.error('Error creating presentation plan:', error);
      throw new Error('Error al crear el plan de presentación');
    }
  }

  private validatePresentationPlan(plan: PresentationPlan): void {
    if (!plan.title || !plan.sections || !Array.isArray(plan.sections)) {
      throw new Error('Plan de presentación inválido: falta título o secciones');
    }

    if (plan.sections.length === 0) {
      throw new Error('Plan de presentación inválido: debe tener al menos una sección');
    }

    if (!plan.keyMessages || plan.keyMessages.length === 0) {
      throw new Error('Plan de presentación inválido: debe tener mensajes clave');
    }

    if (!plan.callToAction) {
      throw new Error('Plan de presentación inválido: debe tener llamada a la acción');
    }

    // Validar que hay elementos interactivos suficientes
    const totalSlides = plan.sections.reduce((sum, section) => sum + section.slideCount, 0);
    const minInteractiveElements = Math.floor(totalSlides / 4);
    
    if (plan.interactiveElements.length < minInteractiveElements) {
      console.warn(`Se recomienda al menos ${minInteractiveElements} elementos interactivos para ${totalSlides} slides`);
    }
  }

  async coordinateAgents(plan: PresentationPlan, context: PresentationContext): Promise<AgentCoordinationPlan> {
    const coordination: AgentCoordinationPlan = {
      contentAnalysis: {
        priority: 1,
        input: {
          document: context.document,
          sections: plan.sections,
          keyMessages: plan.keyMessages
        }
      },
      research: {
        priority: 2,
        input: {
          sectionsNeedingResearch: plan.sections.filter(s => s.needsResearch),
          audienceType: context.audienceType,
          researchQueries: this.generateResearchQueries(plan, context)
        }
      },
      mediaGeneration: {
        priority: 3,
        input: {
          visualElements: plan.sections.flatMap(s => s.visualElements),
          designTheme: plan.designTheme,
          brandGuidelines: 'professional-modern'
        }
      },
      interactivity: {
        priority: 3,
        input: {
          interactiveElements: plan.interactiveElements,
          audienceType: context.audienceType,
          duration: context.duration
        }
      },
      presentationDesign: {
        priority: 4,
        input: {
          sections: plan.sections,
          designTheme: plan.designTheme,
          totalSlides: plan.totalSlides
        }
      }
    };

    return coordination;
  }

  private generateResearchQueries(plan: PresentationPlan, context: PresentationContext): string[] {
    const baseQueries = [
      `latest statistics ${new Date().getFullYear()} ${plan.title}`,
      `market trends ${context.audienceType} industry`,
      `case studies successful ${context.objective}`
    ];

    const sectionQueries = plan.sections
      .filter(section => section.needsResearch)
      .map(section => `recent data ${section.title} ${context.audienceType}`);

    return [...baseQueries, ...sectionQueries];
  }

  async evaluatePresentationQuality(
    completedPresentation: any, 
    originalPlan: PresentationPlan
  ): Promise<QualityScore> {
    const qualityPrompt = `
Evalúa la calidad de esta presentación completada contra el plan original:

PLAN ORIGINAL: ${JSON.stringify(originalPlan)}
PRESENTACIÓN COMPLETADA: ${JSON.stringify(completedPresentation)}

Evalúa en escala 0-10:
1. Coherencia narrativa
2. Calidad visual
3. Nivel de engagement
4. Alineación con objetivos
5. Efectividad de CTA

Responde con JSON: { scores: {...}, overallScore: number, recommendations: string[] }
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      temperature: 0.1,
      messages: [{
        role: 'user',
        content: qualityPrompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }
    
    throw new Error('Error evaluando calidad de presentación');
  }
}

export interface AgentCoordinationPlan {
  contentAnalysis: {
    priority: number;
    input: any;
  };
  research: {
    priority: number;
    input: any;
  };
  mediaGeneration: {
    priority: number;
    input: any;
  };
  interactivity: {
    priority: number;
    input: any;
  };
  presentationDesign: {
    priority: number;
    input: any;
  };
}

export interface QualityScore {
  scores: {
    narrative: number;
    visual: number;
    engagement: number;
    alignment: number;
    cta: number;
  };
  overallScore: number;
  recommendations: string[];
}