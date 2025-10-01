// Types for Presentations Feature
export interface Slide {
  id: string;
  order: number;
  type: SlideType;
  content: SlideContent;
  animations?: Animation[];
  transition?: Transition;
  background?: SlideBackground;
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  slides: Slide[];
  theme: PresentationTheme;
  settings: PresentationSettings;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  analytics?: PresentationAnalytics;
}

export type SlideType = 
  | 'title'
  | 'content'
  | 'image'
  | 'video'
  | 'chart'
  | 'quote'
  | 'section-break';

export interface SlideContent {
  title?: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  imageUrl?: string;
  videoUrl?: string;
  chartData?: Record<string, unknown>;
  quote?: {
    text: string;
    author: string;
  };
}

export interface Animation {
  id: string;
  element: string;
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: string;
}

export type AnimationType =
  | 'fade-in'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'zoom-in'
  | 'rotate-in'
  | 'bounce-in';

export interface Transition {
  type: TransitionType;
  duration: number;
  easing?: string;
}

export type TransitionType =
  | 'slide'
  | 'fade'
  | 'zoom'
  | 'flip'
  | 'cube'
  | 'cards';

export interface SlideBackground {
  type: 'color' | 'gradient' | 'image' | 'video';
  value: string;
  overlay?: {
    color: string;
    opacity: number;
  };
}

export interface PresentationTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  effects?: {
    shadows: boolean;
    glassmorphism: boolean;
    particles: boolean;
  };
}

export interface PresentationSettings {
  aspectRatio: '16:9' | '4:3' | '1:1';
  autoplay: boolean;
  showControls: boolean;
  allowFullscreen: boolean;
  enableAnalytics: boolean;
}

export interface PresentationAnalytics {
  views: number;
  uniqueViews: number;
  averageTimeSpent: number;
  slideCompletionRate: Record<string, number>;
  lastViewed: Date;
}