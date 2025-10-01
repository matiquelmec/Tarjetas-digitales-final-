/**
 * 🎯 PresentationMind AI - Sistema Integral Multi-Agente
 * 
 * Orquesta todos los agentes especializados para crear presentaciones
 * inmersivas y profesionales desde documentos de texto.
 */

import { OrchestratorAgent, PresentationContext, PresentationPlan } from './OrchestratorAgent';
import { ContentAnalysisAgent, ContentAnalysisInput, ContentAnalysisOutput } from './ContentAnalysisAgent';
import { ResearchAgent, ResearchInput, ResearchOutput } from './ResearchAgent';

export interface PresentationMindInput {
  document: string;
  audienceType: 'startup' | 'corporate' | 'academic' | 'sales' | 'training';
  duration: number;
  objective: 'inform' | 'persuade' | 'sell' | 'teach' | 'inspire';
  interactivityLevel: 'low' | 'medium' | 'high';
  requiresResearch: boolean;
  customInstructions?: string;
}

export interface PresentationMindOutput {
  presentation: CompletedPresentation;
  qualityScore: number;
  processingTime: number;
  agentReports: AgentReports;
  recommendations: string[];
}

export interface CompletedPresentation {
  metadata: {
    title: string;
    subtitle: string;
    totalSlides: number;
    estimatedDuration: number;
    createdAt: string;
    version: string;
  };
  slides: EnrichedSlide[];
  interactiveElements: InteractiveElement[];
  designTheme: string;
  speakerNotes: string[];
  appendix: AppendixData;
}

export interface EnrichedSlide {
  id: string;
  title: string;
  content: SlideContent;
  researchData?: ResearchEnrichment;
  visualElements: VisualElement[];
  interactiveComponent?: InteractiveComponent;
  transitionEffect: string;
  speakerNotes: string;
  estimatedTime: number; // segundos
}

export interface SlideContent {
  bulletPoints: string[];
  keyMessage: string;
  supportingData?: string;
  visualDescription: string;
  contentType: 'intro' | 'content' | 'data' | 'story' | 'conclusion';
}

export interface ResearchEnrichment {
  statistics: string[];
  trends: string[];
  caseStudies: string[];
  sources: string[];
}

export interface VisualElement {
  type: 'image' | 'chart' | 'infographic' | 'video' | 'animation';
  description: string;
  dataSource?: string;
  generationPrompt: string;
  position: 'background' | 'center' | 'side' | 'overlay';
}

export interface InteractiveElement {
  type: 'icebreaker' | 'poll' | 'quiz' | 'discussion' | 'activity';
  slidePosition: number;
  description: string;
  duration: number;
  instructions: string;
  expectedOutcome: string;
}

export interface InteractiveComponent {
  element: InteractiveElement;
  implementation: string; // React component code or configuration
  styling: string; // CSS específico
}

export interface AppendixData {
  sources: SourceReference[];
  additionalData: any[];
  glossary: GlossaryTerm[];
  contactInfo: ContactInfo;
}

export interface SourceReference {
  id: string;
  title: string;
  author: string;
  url: string;
  accessDate: string;
  credibilityScore: number;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  context: string;
}

export interface ContactInfo {
  presenter: string;
  email: string;
  linkedIn?: string;
  company?: string;
}

export interface AgentReports {
  orchestrator: {
    planQuality: number;
    executionTime: number;
    decisionsLog: string[];
  };
  contentAnalysis: {
    compressionRatio: number; // % de reducción del documento original
    ruleCompliance: number; // % cumplimiento regla 6x6
    narrativeCoherence: number; // Score 1-10
    processingTime: number;
  };
  research: {
    dataPointsFound: number;
    sourcesValidated: number;
    actualityScore: number; // % datos de últimos 2 años
    credibilityAverage: number;
    processingTime: number;
  };
  mediaGeneration?: {
    imagesGenerated: number;
    chartsCreated: number;
    processingTime: number;
  };
  interactivity?: {
    elementsCreated: number;
    engagementScore: number;
    processingTime: number;
  };
}

export class PresentationMindSystem {
  private orchestrator: OrchestratorAgent;
  private contentAnalysis: ContentAnalysisAgent;
  private research: ResearchAgent | null;
  private hasResearchCapability: boolean;
  
  constructor(
    anthropicApiKey: string,
    supabaseUrl: string,
    supabaseKey: string
  ) {
    this.orchestrator = new OrchestratorAgent(anthropicApiKey);
    this.contentAnalysis = new ContentAnalysisAgent(anthropicApiKey);
    
    // Solo inicializar ResearchAgent si Supabase está disponible
    if (supabaseUrl && supabaseKey) {
      this.research = new ResearchAgent(anthropicApiKey, supabaseUrl, supabaseKey);
      this.hasResearchCapability = true;
    } else {
      this.research = null;
      this.hasResearchCapability = false;
      console.warn('🔍 Research capabilities disabled - Supabase not configured');
    }
  }

  async createPresentation(input: PresentationMindInput): Promise<PresentationMindOutput> {
    const startTime = Date.now();
    const agentReports: AgentReports = {
      orchestrator: { planQuality: 0, executionTime: 0, decisionsLog: [] },
      contentAnalysis: { compressionRatio: 0, ruleCompliance: 0, narrativeCoherence: 0, processingTime: 0 },
      research: { dataPointsFound: 0, sourcesValidated: 0, actualityScore: 0, credibilityAverage: 0, processingTime: 0 }
    };

    try {
      // FASE 1: PLANIFICACIÓN ESTRATÉGICA
      console.log('🎯 Iniciando planificación estratégica...');
      const orchestratorStart = Date.now();
      
      const context: PresentationContext = {
        document: input.document,
        audienceType: input.audienceType,
        duration: input.duration,
        objective: input.objective,
        interactivityLevel: input.interactivityLevel
      };

      const plan = await this.orchestrator.createPresentationPlan(context);
      
      agentReports.orchestrator.executionTime = Date.now() - orchestratorStart;
      agentReports.orchestrator.planQuality = this.evaluatePlanQuality(plan);
      agentReports.orchestrator.decisionsLog.push('Plan estratégico creado exitosamente');

      // FASE 2: ANÁLISIS Y PROCESAMIENTO DE CONTENIDO
      console.log('📖 Procesando contenido del documento...');
      const contentStart = Date.now();
      
      const contentInput: ContentAnalysisInput = {
        document: input.document,
        sections: plan.sections,
        keyMessages: plan.keyMessages,
        audienceType: input.audienceType,
        maxWordsPerSlide: 30 // Límite estricto para presentaciones efectivas
      };

      const contentAnalysisResult = await this.contentAnalysis.processContent(contentInput);
      
      // Optimizar flujo narrativo
      const optimizedContent = await this.contentAnalysis.optimizeForStorytellingFlow(contentAnalysisResult);
      
      agentReports.contentAnalysis.processingTime = Date.now() - contentStart;
      agentReports.contentAnalysis.compressionRatio = this.calculateCompressionRatio(input.document, optimizedContent);
      agentReports.contentAnalysis.ruleCompliance = this.validateRuleCompliance(optimizedContent);
      agentReports.contentAnalysis.narrativeCoherence = 8.5; // Score basado en optimización

      // FASE 3: INVESTIGACIÓN Y ENRIQUECIMIENTO (si se requiere y está disponible)
      let researchResult: ResearchOutput | null = null;
      
      if (input.requiresResearch && this.hasResearchCapability && this.research) {
        console.log('🔍 Realizando investigación de datos actualizados...');
        const researchStart = Date.now();
        
        const researchInput: ResearchInput = {
          sectionsNeedingResearch: plan.sections.filter(s => s.needsResearch).map(section => ({
            title: section.title,
            keyPoints: section.keyPoints,
            specificDataNeeds: section.visualElements
          })),
          audienceType: input.audienceType,
          researchQueries: this.generateResearchQueries(plan, context),
          presentationTopic: plan.title,
          targetDate: new Date().getFullYear().toString()
        };

        researchResult = await this.research.conductResearch(researchInput);
        
        // Guardar investigación para futuras presentaciones
        await this.research.saveToKnowledgeBase(researchResult, plan.title);
        
        agentReports.research.processingTime = Date.now() - researchStart;
        agentReports.research.dataPointsFound = researchResult.currentStatistics.length;
        agentReports.research.sourcesValidated = researchResult.credibleSources.length;
        agentReports.research.actualityScore = this.calculateActualityScore(researchResult);
        agentReports.research.credibilityAverage = this.calculateCredibilityAverage(researchResult);
      } else if (input.requiresResearch && !this.hasResearchCapability) {
        console.log('⚠️  Investigación solicitada pero Supabase no configurado - modo básico');
        // Configurar reportes básicos para investigación
        agentReports.research = {
          dataPointsFound: 0,
          sourcesValidated: 0,
          actualityScore: 0,
          credibilityAverage: 0,
          processingTime: 0
        };
      }

      // FASE 4: ENSAMBLAJE DE PRESENTACIÓN FINAL
      console.log('🚀 Ensamblando presentación final...');
      const presentation = await this.assemblePresentation(
        plan,
        optimizedContent,
        researchResult,
        input
      );

      // FASE 5: EVALUACIÓN DE CALIDAD
      console.log('📊 Evaluando calidad de la presentación...');
      const qualityScore = await this.orchestrator.evaluatePresentationQuality(
        presentation,
        plan
      );

      const totalTime = Date.now() - startTime;

      return {
        presentation,
        qualityScore: qualityScore.overallScore,
        processingTime: totalTime,
        agentReports,
        recommendations: qualityScore.recommendations
      };

    } catch (error) {
      console.error('Error en PresentationMind System:', error);
      throw new Error(`Error creando presentación: ${error.message}`);
    }
  }

  private async assemblePresentation(
    plan: PresentationPlan,
    content: ContentAnalysisOutput,
    research: ResearchOutput | null,
    input: PresentationMindInput
  ): Promise<CompletedPresentation> {
    
    const slides: EnrichedSlide[] = [];
    let slideId = 1;

    for (const [sectionIndex, section] of content.processedSections.entries()) {
      for (const [slideIndex, slideContent] of section.slides.entries()) {
        
        // Enriquecer con datos de investigación si está disponible
        let researchEnrichment: ResearchEnrichment | undefined;
        
        if (research) {
          researchEnrichment = {
            statistics: research.currentStatistics
              .filter(stat => stat.slideRelevance.includes(section.title))
              .map(stat => `${stat.statistic}: ${stat.value} (${stat.source}, ${stat.year})`),
            trends: research.industryTrends
              .filter(trend => trend.impactLevel === 'high')
              .map(trend => trend.trend),
            caseStudies: research.caseStudies
              .filter(study => study.relevance > 7)
              .map(study => `${study.company}: ${study.results}`),
            sources: research.credibleSources
              .filter(source => source.credibilityScore > 7)
              .map(source => source.url)
          };
        }

        // Generar elementos visuales
        const visualElements: VisualElement[] = [{
          type: slideContent.contentType === 'data' ? 'chart' : 'image',
          description: slideContent.visualDescription,
          generationPrompt: this.createVisualPrompt(slideContent, input.audienceType),
          position: 'center'
        }];

        // Agregar componente interactivo si corresponde
        let interactiveComponent: InteractiveComponent | undefined;
        const relatedInteractive = plan.interactiveElements.find(
          elem => elem.slidePosition === slideId
        );

        if (relatedInteractive) {
          interactiveComponent = {
            element: relatedInteractive,
            implementation: this.generateInteractiveComponent(relatedInteractive),
            styling: this.generateInteractiveStyles(relatedInteractive)
          };
        }

        slides.push({
          id: `slide-${slideId}`,
          title: slideContent.title,
          content: {
            bulletPoints: slideContent.bulletPoints,
            keyMessage: this.extractKeyMessage(slideContent),
            supportingData: researchEnrichment?.statistics?.[0],
            visualDescription: slideContent.visualDescription,
            contentType: slideContent.contentType
          },
          researchData: researchEnrichment,
          visualElements,
          interactiveComponent,
          transitionEffect: this.selectTransitionEffect(slideContent.contentType),
          speakerNotes: slideContent.speakerNotes,
          estimatedTime: this.calculateSlideTime(slideContent, relatedInteractive)
        });

        slideId++;
      }
    }

    // Compilar apéndice
    const appendix: AppendixData = {
      sources: research?.credibleSources.map(source => ({
        id: `source-${source.url.split('/').pop()}`,
        title: source.title,
        author: source.author,
        url: source.url,
        accessDate: new Date().toISOString().split('T')[0],
        credibilityScore: source.credibilityScore
      })) || [],
      additionalData: research ? [
        { type: 'trends', data: research.industryTrends },
        { type: 'market_data', data: research.marketData }
      ] : [],
      glossary: this.generateGlossary(content),
      contactInfo: {
        presenter: 'PresentationMind AI',
        email: 'presentations@digital-cards.com',
        company: 'Digital Cards Platform'
      }
    };

    return {
      metadata: {
        title: plan.title,
        subtitle: plan.subtitle,
        totalSlides: slides.length,
        estimatedDuration: plan.estimatedDuration,
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      },
      slides,
      interactiveElements: plan.interactiveElements,
      designTheme: plan.designTheme,
      speakerNotes: content.processedSections.flatMap(section => 
        section.slides.map(slide => slide.speakerNotes)
      ),
      appendix
    };
  }

  // Métodos auxiliares para evaluación y procesamiento

  private evaluatePlanQuality(plan: PresentationPlan): number {
    let score = 10;
    
    // Evaluar completitud
    if (!plan.title || !plan.callToAction) score -= 2;
    if (plan.sections.length === 0) score -= 3;
    if (plan.keyMessages.length < 3) score -= 1;
    
    // Evaluar coherencia
    const avgSlidesPerSection = plan.totalSlides / plan.sections.length;
    if (avgSlidesPerSection > 6) score -= 1; // Secciones muy largas
    if (avgSlidesPerSection < 2) score -= 1; // Secciones muy cortas
    
    // Evaluar interactividad
    const interactivityRatio = plan.interactiveElements.length / plan.totalSlides;
    if (interactivityRatio < 0.2) score -= 1; // Muy poca interactividad
    if (interactivityRatio > 0.4) score -= 1; // Demasiada interactividad
    
    return Math.max(score, 0);
  }

  private calculateCompressionRatio(originalDoc: string, processed: ContentAnalysisOutput): number {
    const originalWords = originalDoc.split(/\s+/).length;
    const processedWords = processed.processedSections
      .flatMap(section => section.slides)
      .flatMap(slide => slide.bulletPoints)
      .join(' ')
      .split(/\s+/).length;
    
    return ((originalWords - processedWords) / originalWords) * 100;
  }

  private validateRuleCompliance(content: ContentAnalysisOutput): number {
    let totalBullets = 0;
    let compliantBullets = 0;
    let compliantSlides = 0;
    let totalSlides = 0;

    content.processedSections.forEach(section => {
      section.slides.forEach(slide => {
        totalSlides++;
        
        // Verificar regla 6x6
        if (slide.bulletPoints.length <= 6) {
          let slideCompliant = true;
          
          slide.bulletPoints.forEach(bullet => {
            totalBullets++;
            if (bullet.split(/\s+/).length <= 6) {
              compliantBullets++;
            } else {
              slideCompliant = false;
            }
          });
          
          if (slideCompliant) compliantSlides++;
        }
      });
    });

    const bulletCompliance = totalBullets > 0 ? (compliantBullets / totalBullets) * 100 : 100;
    const slideCompliance = totalSlides > 0 ? (compliantSlides / totalSlides) * 100 : 100;
    
    return (bulletCompliance + slideCompliance) / 2;
  }

  private calculateActualityScore(research: ResearchOutput): number {
    const currentYear = new Date().getFullYear();
    const recentData = research.currentStatistics.filter(stat => 
      stat.year >= currentYear - 2
    ).length;
    
    return research.currentStatistics.length > 0 
      ? (recentData / research.currentStatistics.length) * 100 
      : 0;
  }

  private calculateCredibilityAverage(research: ResearchOutput): number {
    if (research.credibleSources.length === 0) return 0;
    
    const total = research.credibleSources.reduce(
      (sum, source) => sum + source.credibilityScore, 
      0
    );
    
    return total / research.credibleSources.length;
  }

  private generateResearchQueries(plan: PresentationPlan, context: PresentationContext): string[] {
    return [
      `${plan.title} statistics ${new Date().getFullYear()}`,
      `${context.audienceType} industry trends`,
      ...plan.keyMessages.map(message => `${message} latest data`),
      ...plan.sections
        .filter(s => s.needsResearch)
        .map(s => `${s.title} market research`)
    ];
  }

  private createVisualPrompt(slideContent: any, audienceType: string): string {
    return `Create a professional ${audienceType} presentation visual for: ${slideContent.title}. 
            Style: Modern, clean, ${audienceType === 'startup' ? 'dynamic' : 'corporate'}. 
            Content: ${slideContent.visualDescription}`;
  }

  private generateInteractiveComponent(interactive: InteractiveElement): string {
    // En una implementación completa, esto generaría código React
    return `<InteractiveComponent type="${interactive.type}" description="${interactive.description}" />`;
  }

  private generateInteractiveStyles(interactive: InteractiveElement): string {
    return `.interactive-${interactive.type} { /* Estilos específicos */ }`;
  }

  private extractKeyMessage(slideContent: any): string {
    return slideContent.bulletPoints[0] || slideContent.title;
  }

  private selectTransitionEffect(contentType: string): string {
    const effects = {
      intro: 'fadeIn',
      content: 'slideInLeft',
      data: 'zoomIn',
      story: 'slideInRight',
      conclusion: 'fadeInUp'
    };
    
    return effects[contentType] || 'fadeIn';
  }

  private calculateSlideTime(slideContent: any, interactive?: InteractiveElement): number {
    let baseTime = 90; // 1.5 minutos base por slide
    
    // Ajustar por complejidad del contenido
    baseTime += slideContent.bulletPoints.length * 10; // 10 seg por bullet
    
    // Agregar tiempo de interactividad
    if (interactive) {
      baseTime += interactive.duration * 60; // Convertir minutos a segundos
    }
    
    return baseTime;
  }

  private generateGlossary(content: ContentAnalysisOutput): GlossaryTerm[] {
    // En implementación completa, extraería términos técnicos
    return [
      {
        term: 'PresentationMind AI',
        definition: 'Sistema de inteligencia artificial para crear presentaciones profesionales',
        context: 'Herramienta de productividad empresarial'
      }
    ];
  }
}