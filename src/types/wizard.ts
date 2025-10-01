// Types específicos para el Wizard sin conflictos con tipos existentes
export interface WizardStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface WizardUserData {
  // Información básica (Step 1)
  fullName: string;
  jobTitle: string;
  phoneNumber: string;
  email: string;
  
  // Personalización (Step 2)
  selectedTheme: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  
  // Configuración avanzada
  profileImage?: string;
  backgroundColor?: string;
  primaryColor?: string;
}

export interface UserProfile {
  type: 'entrepreneur' | 'employee' | 'freelancer' | 'student' | 'general';
  confidence: number;
  detectedFrom: string[];
}

export interface SmartSuggestion {
  id: string;
  type: 'cta_button' | 'bio_improvement' | 'social_link' | 'theme_suggestion';
  title: string;
  description: string;
  reason: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  applicable: boolean;
}

export interface WizardState {
  currentStep: number;
  userData: WizardUserData;
  userProfile: UserProfile | null;
  suggestions: SmartSuggestion[];
  isLoading: boolean;
  errors: Record<string, string>;
  progress: number;
}

// Tipos para componentes visuales
export interface ThemeOption {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  effects: string[];
}

export interface WizardAnimationConfig {
  duration: number;
  easing: string;
  stagger: number;
}

// Tipo para evitar conflictos con Card existente
export interface WizardCardPreview {
  id: string;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  theme: string;
  profileImage?: string;
}