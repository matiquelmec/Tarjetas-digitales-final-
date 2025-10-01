/**
 * Tipos para Orbital Studio - Sistema limpio y escalable
 */

// Slide individual
export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  layout: 'title' | 'content' | 'split' | 'image' | 'video';
  order: number;
  
  // Diseño
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  
  // Efectos
  effects: SlideEffects;
  
  // Media (futuro)
  images?: MediaAsset[];
  videos?: MediaAsset[];
  
  // Transiciones
  transition?: TransitionType;
  duration?: number; // en segundos
}

// Efectos visuales del slide
export interface SlideEffects {
  glassmorphism: boolean;
  particles: boolean;
  particleType: 'floating' | 'constellation' | 'professional' | 'creative';
  animations: boolean;
  backgroundPatterns: boolean;
  hover: boolean;
}

// Presentación completa
export interface Presentation {
  id: string;
  title: string;
  description: string;
  userId: string;
  
  // Slides
  slides: Slide[];
  currentSlideIndex: number;
  
  // Configuración global
  theme: PresentationTheme;
  settings: PresentationSettings;
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  shareUrl?: string;
  
  // Analytics
  views: number;
  lastViewedAt?: Date;
}

// Tema de presentación
export interface PresentationTheme {
  id: string;
  name: string;
  category: 'professional' | 'creative' | 'minimal' | 'bold';
  
  // Colores base
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  // Tipografía
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  
  // Efectos predeterminados
  defaultEffects: SlideEffects;
}

// Configuración de presentación
export interface PresentationSettings {
  // Reproducción
  autoPlay: boolean;
  slideDuration: number; // segundos por slide
  loop: boolean;
  
  // Controles
  showNavigation: boolean;
  showProgress: boolean;
  allowKeyboard: boolean;
  
  // Colaboración
  allowComments: boolean;
  allowEdit: boolean;
  
  // Analytics
  trackViews: boolean;
  trackEngagement: boolean;
}

// Asset multimedia
export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
  
  // Metadatos
  size: number; // bytes
  dimensions?: { width: number; height: number };
  duration?: number; // para videos/audio
  
  // Generación IA (futuro)
  generatedBy?: 'flux' | 'vo3' | 'user';
  prompt?: string;
}

// Tipos de transición
export type TransitionType = 
  | 'none'
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-horizontal'
  | 'flip-vertical'
  | 'cube'
  | 'card-flip';

// Estado del editor orbital
export interface OrbitalEditorState {
  // Presentación activa
  presentation: Presentation;
  currentSlide: Slide;
  
  // UI
  selectedPanel: OrbitalPanel | null;
  isPreviewMode: boolean;
  isFullscreen: boolean;
  
  // Herramientas activas
  activeTool: 'select' | 'text' | 'image' | 'effects' | 'ai';
  
  // Historial (undo/redo)
  history: PresentationSnapshot[];
  historyIndex: number;
  
  // Colaboración
  collaborators: Collaborator[];
  isCollaborating: boolean;
}

// Panel orbital flotante
export interface OrbitalPanel {
  id: string;
  title: string;
  icon: string;
  position: {
    x: number;
    y: number;
    anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  size: 'small' | 'medium' | 'large';
  isVisible: boolean;
  isMinimized: boolean;
}

// Snapshot para historial
export interface PresentationSnapshot {
  id: string;
  timestamp: Date;
  action: string;
  presentation: Presentation;
}

// Colaborador
export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  cursor?: { x: number; y: number };
  currentSlide?: string;
}

// Agentes IA
export interface AIAgent {
  id: string;
  name: string;
  type: 'content' | 'design' | 'seo' | 'storytelling';
  avatar: string;
  isActive: boolean;
  
  // Capacidades
  capabilities: string[];
  
  // Estado
  isThinking: boolean;
  lastSuggestion?: Date;
  suggestions: AISuggestion[];
}

// Sugerencia de IA
export interface AISuggestion {
  id: string;
  agentId: string;
  type: 'content' | 'design' | 'structure' | 'seo';
  title: string;
  description: string;
  
  // Cambios propuestos
  changes: {
    slideId?: string;
    property: string;
    currentValue: any;
    suggestedValue: any;
    reason: string;
  }[];
  
  // Estado
  status: 'pending' | 'accepted' | 'rejected';
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  
  createdAt: Date;
}

// Analytics de presentación
export interface PresentationAnalytics {
  presentationId: string;
  
  // Vistas
  totalViews: number;
  uniqueViews: number;
  avgViewDuration: number;
  
  // Engagement por slide
  slideEngagement: {
    slideId: string;
    views: number;
    avgTimeSpent: number;
    dropoffRate: number;
  }[];
  
  // Geográficos
  viewsByCountry: Record<string, number>;
  viewsByDevice: Record<string, number>;
  
  // Temporal
  viewsByDate: Record<string, number>;
  peakViewingHours: number[];
}

// Configuración de exportación
export interface ExportConfig {
  format: 'pdf' | 'pptx' | 'html' | 'video' | 'images';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  includeAnimations: boolean;
  includeNotes: boolean;
  slideRange?: { start: number; end: number };
}

// Estado global de Orbital Studio
export interface OrbitalStudioGlobalState {
  // Editor
  editor: OrbitalEditorState;
  
  // UI
  ui: {
    theme: 'dark' | 'light';
    zoom: number;
    gridVisible: boolean;
    panelsLocked: boolean;
  };
  
  // Performance
  performance: {
    enabledEffects: number;
    renderMode: 'quality' | 'performance';
    deviceOptimization: boolean;
  };
  
  // Configuración
  preferences: {
    autoSave: boolean;
    autoSaveInterval: number; // minutos
    keyboardShortcuts: boolean;
    showTutorial: boolean;
  };
}