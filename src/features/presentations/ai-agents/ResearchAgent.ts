/**
 * 🔍 ResearchAgent - Investigador Inteligente con RAG
 * 
 * Busca información actualizada, verifica datos del documento
 * e integra estadísticas y tendencias actuales para enriquecer
 * las presentaciones con credibilidad y relevancia.
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ResearchInput {
  sectionsNeedingResearch: ResearchSection[];
  audienceType: string;
  researchQueries: string[];
  presentationTopic: string;
  targetDate: string; // Para buscar datos específicos de año/periodo
}

export interface ResearchSection {
  title: string;
  keyPoints: string[];
  specificDataNeeds: string[];
}

export interface ResearchOutput {
  currentStatistics: StatisticData[];
  industryTrends: TrendData[];
  caseStudies: CaseStudyData[];
  competitorInsights: CompetitorData[];
  marketData: MarketData[];
  credibleSources: SourceData[];
  verificationStatus: VerificationResult[];
  suggestedVisuals: VisualSuggestion[];
}

export interface StatisticData {
  statistic: string;
  value: string;
  source: string;
  year: number;
  reliability: 'high' | 'medium' | 'low';
  context: string;
  slideRelevance: string; // Which section/slide this applies to
}

export interface TrendData {
  trend: string;
  description: string;
  impactLevel: 'high' | 'medium' | 'low';
  timeframe: string;
  relatedMetrics: string[];
  sources: string[];
}

export interface CaseStudyData {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  source: string;
  relevance: number; // 1-10 score
}

export interface MarketData {
  marketSize: string;
  growthRate: string;
  keyPlayers: string[];
  opportunities: string[];
  threats: string[];
  year: number;
}

export interface SourceData {
  url: string;
  title: string;
  author: string;
  publishDate: string;
  credibilityScore: number; // 1-10
  summary: string;
}

export interface VerificationResult {
  originalClaim: string;
  verificationStatus: 'verified' | 'partially_verified' | 'conflicting' | 'outdated';
  currentData: string;
  sources: string[];
  recommendation: string;
}

export interface VisualSuggestion {
  type: 'chart' | 'infographic' | 'comparison' | 'timeline' | 'heatmap';
  dataToVisualize: string;
  suggestedTool: string;
  description: string;
}

export class ResearchAgent {
  private anthropic: Anthropic;
  private supabase: SupabaseClient;
  private systemPrompt: string;

  constructor(anthropicApiKey: string, supabaseUrl: string, supabaseKey: string) {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    return `
Eres el ResearchAgent de PresentationMind AI, especializado en investigación de datos actualizados y verificación de información para presentaciones profesionales.

## TU MISIÓN
- Encontrar estadísticas y datos más actuales disponibles
- Verificar información existente en documentos
- Identificar tendencias relevantes para la audiencia
- Localizar casos de estudio impactantes
- Proporcionar fuentes creíbles y verificables

## CRITERIOS DE CALIDAD
1. **Actualidad**: Preferir datos de los últimos 12-24 meses
2. **Credibilidad**: Fuentes reconocidas, estudios peer-reviewed, instituciones confiables
3. **Relevancia**: Directamente relacionado con el tema y audiencia
4. **Impacto**: Estadísticas que generen reacción o apoyen argumentos clave
5. **Verificabilidad**: Fuentes accesibles y citables

## TIPOS DE FUENTES PREFERIDAS
- Institutos de investigación reconocidos
- Consultoras prestigiosas (McKinsey, BCG, Deloitte)
- Publicaciones académicas peer-reviewed
- Informes gubernamentales oficiales
- Estudios de compañías Fortune 500
- Plataformas de datos reconocidas

## EVITAR
- Blogs sin respaldo institucional
- Datos de fuentes desconocidas
- Información anterior a 2022 (excepto para contexto histórico)
- Estadísticas sin metodología clara
- Fuentes con conflictos de interés evidentes

Siempre proporciona contexto y metodología cuando esté disponible.
Responde en formato JSON siguiendo la interface ResearchOutput.
`;
  }

  async conductResearch(input: ResearchInput): Promise<ResearchOutput> {
    try {
      // 1. Buscar en base de conocimientos existente (RAG)
      const ragResults = await this.searchKnowledgeBase(input.researchQueries);
      
      // 2. Buscar información actualizada en web
      const webResearch = await this.conductWebResearch(input);
      
      // 3. Verificar datos existentes del documento
      const verificationResults = await this.verifyExistingData(input);
      
      // 4. Consolidar y estructurar resultados
      const consolidatedResults = await this.consolidateResearchResults(
        ragResults,
        webResearch,
        verificationResults,
        input
      );

      return consolidatedResults;

    } catch (error) {
      console.error('Error conducting research:', error);
      throw new Error('Error en el proceso de investigación');
    }
  }

  private async searchKnowledgeBase(queries: string[]): Promise<any> {
    // Implementar búsqueda en Supabase pgvector
    const searchPromises = queries.map(async (query) => {
      try {
        // Generar embedding del query
        const embedding = await this.generateEmbedding(query);
        
        // Buscar en base vectorial
        const { data, error } = await this.supabase
          .rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.78,
            match_count: 10
          });

        if (error) throw error;
        
        return {
          query,
          results: data || []
        };
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error);
        return { query, results: [] };
      }
    });

    return Promise.all(searchPromises);
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // En una implementación real, usarías OpenAI embeddings o similar
    // Por ahora, simulamos con un embedding mock
    // TODO: Implementar OpenAI embeddings API
    return new Array(1536).fill(0).map(() => Math.random() - 0.5);
  }

  private async conductWebResearch(input: ResearchInput): Promise<any> {
    const researchPrompt = `
Necesito investigar información actualizada sobre estos temas para una presentación ${input.audienceType}:

TEMA PRINCIPAL: ${input.presentationTopic}
FECHA OBJETIVO: ${input.targetDate}

SECCIONES QUE NECESITAN INVESTIGACIÓN:
${input.sectionsNeedingResearch.map(section => 
  `- ${section.title}: ${section.specificDataNeeds.join(', ')}`
).join('\n')}

CONSULTAS ESPECÍFICAS:
${input.researchQueries.join('\n- ')}

Para cada tema, necesito:

1. **ESTADÍSTICAS ACTUALES** (últimos 12-24 meses):
   - Datos específicos con números exactos
   - Fuente y metodología
   - Contexto de la industria/mercado
   
2. **TENDENCIAS EMERGENTES**:
   - Cambios significativos recientes
   - Proyecciones futuras creíbles
   - Impacto en la audiencia ${input.audienceType}

3. **CASOS DE ESTUDIO RELEVANTES**:
   - Empresas reconocidas
   - Resultados medibles
   - Aplicabilidad a la presentación

4. **DATOS DE MERCADO**:
   - Tamaño y crecimiento
   - Jugadores principales
   - Oportunidades identificadas

IMPORTANTE: Solo incluir información de fuentes creíbles y verificables.
Priorizar datos de 2023-2024 cuando esté disponible.

Responde en formato JSON siguiendo la estructura ResearchOutput.
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.2,
      system: this.systemPrompt,
      messages: [{
        role: 'user',
        content: researchPrompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }

    throw new Error('Error en investigación web');
  }

  private async verifyExistingData(input: ResearchInput): Promise<VerificationResult[]> {
    // Extraer claims específicos de las secciones que necesitan verificación
    const claims = input.sectionsNeedingResearch.flatMap(section => 
      section.keyPoints.filter(point => 
        point.includes('%') || 
        point.includes('$') || 
        point.includes('millón') ||
        point.includes('billion') ||
        /\d+/.test(point) // Contiene números
      )
    );

    if (claims.length === 0) {
      return [];
    }

    const verificationPrompt = `
Verifica la actualidad y exactitud de estas afirmaciones:

CLAIMS A VERIFICAR:
${claims.map((claim, index) => `${index + 1}. ${claim}`).join('\n')}

Para cada afirmación:
1. Busca datos más recientes disponibles
2. Compara con la información original
3. Identifica discrepancias o actualizaciones
4. Proporciona fuentes de los datos actuales
5. Haz recomendación: mantener, actualizar, o marcar como desactualizada

Responde con array de VerificationResult en JSON.
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2000,
      temperature: 0.1, // Muy bajo para máxima precisión
      messages: [{
        role: 'user',
        content: verificationPrompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }

    return [];
  }

  private async consolidateResearchResults(
    ragResults: any,
    webResearch: any,
    verificationResults: VerificationResult[],
    input: ResearchInput
  ): Promise<ResearchOutput> {
    const consolidationPrompt = `
Consolida estos resultados de investigación en un formato estructurado y útil para presentaciones:

RESULTADOS RAG: ${JSON.stringify(ragResults)}
INVESTIGACIÓN WEB: ${JSON.stringify(webResearch)}
VERIFICACIONES: ${JSON.stringify(verificationResults)}

CONTEXTO: Presentación sobre "${input.presentationTopic}" para audiencia ${input.audienceType}

TAREAS:
1. Priorizar información más relevante y reciente
2. Eliminar duplicados y consolidar datos similares
3. Rankear por credibilidad e impacto
4. Sugerir visualizaciones para datos complejos
5. Crear lista de fuentes ordenada por credibilidad

Responde con JSON formato ResearchOutput completo y bien estructurado.
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      temperature: 0.15,
      messages: [{
        role: 'user',
        content: consolidationPrompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const consolidated: ResearchOutput = JSON.parse(content.text);
      
      // Validar calidad de los resultados
      this.validateResearchQuality(consolidated);
      
      return consolidated;
    }

    throw new Error('Error consolidando resultados de investigación');
  }

  private validateResearchQuality(research: ResearchOutput): void {
    // Verificar que tenemos al menos algunas estadísticas actuales
    if (!research.currentStatistics || research.currentStatistics.length === 0) {
      console.warn('No se encontraron estadísticas actuales en la investigación');
    }

    // Verificar credibilidad de fuentes
    const lowCredibilitySources = research.credibleSources?.filter(
      source => source.credibilityScore < 6
    ) || [];
    
    if (lowCredibilitySources.length > 0) {
      console.warn(`Encontradas ${lowCredibilitySources.length} fuentes de baja credibilidad`);
    }

    // Verificar actualidad de datos
    const outdatedData = research.currentStatistics?.filter(
      stat => stat.year < 2022
    ) || [];
    
    if (outdatedData.length > 0) {
      console.warn(`Encontrados ${outdatedData.length} datos desactualizados (anteriores a 2022)`);
    }
  }

  async saveToKnowledgeBase(research: ResearchOutput, topic: string): Promise<void> {
    try {
      // Guardar estadísticas en base vectorial para futura reutilización
      const documentsToSave = [
        ...research.currentStatistics.map(stat => ({
          content: `${stat.statistic}: ${stat.value} (${stat.year}) - ${stat.context}`,
          metadata: { 
            type: 'statistic', 
            topic, 
            year: stat.year,
            source: stat.source,
            reliability: stat.reliability
          }
        })),
        ...research.industryTrends.map(trend => ({
          content: `${trend.trend}: ${trend.description} (${trend.timeframe})`,
          metadata: { 
            type: 'trend', 
            topic, 
            impact: trend.impactLevel,
            sources: trend.sources.join(', ')
          }
        })),
        ...research.caseStudies.map(study => ({
          content: `${study.company} caso: ${study.challenge} -> ${study.solution} = ${study.results}`,
          metadata: { 
            type: 'case_study', 
            topic, 
            industry: study.industry,
            relevance: study.relevance
          }
        }))
      ];

      // Insertar en Supabase con embeddings
      for (const doc of documentsToSave) {
        const embedding = await this.generateEmbedding(doc.content);
        
        await this.supabase
          .from('knowledge_base')
          .insert({
            content: doc.content,
            embedding,
            metadata: doc.metadata,
            created_at: new Date().toISOString()
          });
      }

      console.log(`Guardados ${documentsToSave.length} documentos en base de conocimientos`);

    } catch (error) {
      console.error('Error guardando en base de conocimientos:', error);
      // No lanzar error para no bloquear el flujo principal
    }
  }
}