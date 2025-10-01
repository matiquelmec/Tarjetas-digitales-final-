// Types for AI Research & Conversation System
export interface ResearchQuery {
  id: string;
  topic: string;
  userMessage: string;
  timestamp: Date;
  userId: string;
}

export interface ResearchContext {
  audienceLevel: 'beginner' | 'intermediate' | 'expert' | 'mixed';
  tone: 'formal' | 'casual' | 'persuasive' | 'educational' | 'inspirational';
  duration: '5min' | '10min' | '20min' | '30min' | '45min' | '60min';
  purpose: 'pitch' | 'training' | 'report' | 'marketing' | 'academic' | 'internal';
  industry?: string;
  specificRequirements?: string[];
}

export interface IndiResponse {
  id: string;
  message: string;
  type: 'question' | 'information' | 'suggestion' | 'confirmation' | 'result';
  state: 'researching' | 'analyzing' | 'generating' | 'ready' | 'clarifying';
  followUpQuestions?: string[];
  researchData?: ResearchData;
  suggestedActions?: string[];
  confidence: number; // 0-100
}

export interface ResearchData {
  sources: ResearchSource[];
  keyInsights: KeyInsight[];
  statistics: StatisticData[];
  trends: TrendData[];
  relatedTopics: string[];
  lastUpdated: Date;
}

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  type: 'academic' | 'news' | 'report' | 'government' | 'industry' | 'blog';
  author: string;
  publishDate: Date;
  reliability: number; // 0-100
  relevance: number; // 0-100
  summary: string;
  keyQuotes: string[];
}

export interface KeyInsight {
  id: string;
  insight: string;
  importance: 'high' | 'medium' | 'low';
  sources: string[]; // source IDs
  category: 'trend' | 'statistic' | 'opportunity' | 'challenge' | 'prediction';
}

export interface StatisticData {
  id: string;
  metric: string;
  value: string;
  unit?: string;
  change?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    timeframe: string;
  };
  source: string;
  date: Date;
  context: string;
}

export interface TrendData {
  id: string;
  trend: string;
  direction: 'rising' | 'declining' | 'stable' | 'emerging';
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  evidence: string[];
  predictions?: string[];
}

export interface ConversationState {
  sessionId: string;
  currentStep: 'initial' | 'gathering_context' | 'researching' | 'structuring' | 'generating' | 'refining' | 'complete';
  topic: string;
  context?: Partial<ResearchContext>;
  researchData?: ResearchData;
  messages: ConversationMessage[];
  suggestedStructure?: PresentationStructure;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'indi';
  content: string;
  timestamp: Date;
  data?: unknown; // Additional data like research results, suggestions, etc.
}

export interface PresentationStructure {
  title: string;
  subtitle?: string;
  estimatedSlides: number;
  estimatedDuration: string;
  outline: SlideOutline[];
  keyMessages: string[];
  callToAction?: string;
}

export interface SlideOutline {
  order: number;
  type: 'title' | 'intro' | 'content' | 'data' | 'comparison' | 'timeline' | 'conclusion' | 'cta';
  title: string;
  mainPoints: string[];
  suggestedVisuals: VisualSuggestion[];
  estimatedTime: string;
}

export interface VisualSuggestion {
  type: 'chart' | 'image' | 'video' | 'infographic' | 'icon' | 'diagram';
  description: string;
  prompt?: string; // For AI generation
  data?: unknown; // For charts/graphs
  priority: 'high' | 'medium' | 'low';
}

export interface TextAnalysisInput {
  text: string;
  type: 'document' | 'article' | 'notes' | 'outline' | 'script';
  userId: string;
}

export interface TextAnalysisResult {
  mainTopics: string[];
  keyInsights: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  complexity: 'simple' | 'moderate' | 'complex';
  suggestedAudience: string;
  missingInformation: string[];
  suggestedStructure: PresentationStructure;
  improvementSuggestions: string[];
  wordCount: number;
  readingTime: string;
}

// Indi personality and responses
export interface IndiPersonality {
  greetings: string[];
  thinking: string[];
  research: string[];
  success: string[];
  error: string[];
  clarification: string[];
  completion: string[];
}

export interface IndiConfig {
  personality: IndiPersonality;
  researchAPIs: {
    academic: string[];
    news: string[];
    statistics: string[];
  };
  aiGeneration: {
    textModel: string;
    imageModel: string;
    videoModel: string;
  };
  confidenceThresholds: {
    minReliability: number;
    minRelevance: number;
    minSources: number;
  };
}