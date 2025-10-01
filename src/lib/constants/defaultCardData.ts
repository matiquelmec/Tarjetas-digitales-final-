/**
 * Datos de ejemplo unificados para todas las vistas previas
 * Mantiene consistencia entre PC y móvil
 */

export const DEFAULT_CARD_DATA = {
  // Datos básicos - Profesional moderno
  name: 'Carlos Mendoza',
  title: 'Director de Tecnología',
  about: 'Líder en transformación digital con más de 10 años de experiencia en desarrollo de software y gestión de equipos. Especializado en arquitectura cloud y metodologías ágiles.',
  company: 'Tech Innovations Chile',
  email: 'carlos@techinnovations.cl',
  phone: '+56 9 9876 5432',
  location: 'Las Condes, Santiago',
  whatsapp: '56998765432',
  
  // Diseño moderno y limpio - Sin efectos especiales por defecto
  template: 'modern',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  
  // Tema Diamond predeterminado - Elegancia cristalina con destellos azul diamante
  cardBackgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  cardTextColor: '#ffffff',
  pageBackgroundColor: '#0a0d1a', // Fondo azul muy oscuro diamante
  buttonSecondaryColor: '#7986cb', // Azul brillante para mejor contraste
  buttonSecondaryHoverColor: '#5c6bc0',
  buttonNormalBackgroundColor: 'rgba(121,134,203,0.2)',
  fontFamily: 'Inter', // Fuente moderna y legible
  
  // Efectos visuales - Algunos habilitados para demostración
  enableHoverEffect: true,
  enableGlassmorphism: true,
  enableSubtleAnimations: true,
  enableBackgroundPatterns: true,
  
  // 🚀 Sistema Profesional v4.0 - Activado por defecto para demostrar nueva funcionalidad
  enableProfessionalEffects: true,
  professionalPersonality: 'executive' as const, // Personalidad ejecutiva para demostración
  effectIntensity: 'balanced' as const, // Intensidad perfecta para demo
  
  // Sistema de partículas legacy - Mantenido para compatibilidad
  enableParticles: true,
  particleType: 'professional' as const, // Usa el tipo que mapea a 'minimal' intensity
  particleCount: 4, // Reducido para elegancia del nuevo sistema
  particleDensity: 3,
  
  // Efectos de ambiente - Algunos habilitados para demostración
  enableAnimatedGradient: true,
  animatedGradientType: 'aurora',
  animatedGradientSpeed: 2,
  animatedGradientIntensity: 2,
  animatedGradientOpacity: 30,
  enableFloatingShapes: true,
  floatingShapesType: 'geometric',
  floatingShapesCount: 3,
  floatingShapesSpeed: 3,
  ambientIntensity: 3,
  ambientOpacity: 50,
  
  // Redes sociales - Datos profesionales de ejemplo
  linkedin: 'https://linkedin.com/in/carlosmendoza',
  twitter: '',
  instagram: '',
  website: 'https://carlosmendoza.tech',
  facebook: '',
  appointmentLink: 'https://calendly.com/carlosmendoza',
  
  // Detalles profesionales
  professionalDetails: `• MBA en Innovación Tecnológica - Universidad de Chile
• Certificación AWS Solutions Architect
• Speaker en conferencias de tecnología
• Mentor en programas de emprendimiento

Especialidades:
- Cloud Architecture (AWS, Azure)
- Transformación Digital
- Liderazgo de Equipos
- Metodologías Ágiles`,
  
  // Configuración
  customUrl: '',
  isPublic: true,
};

/**
 * Tema moderno recomendado - Colores profesionales y accesibles
 */
export const MODERN_THEME = {
  name: 'Modern Professional',
  description: 'Diseño limpio y moderno con gradiente sutil',
  colors: {
    cardBackgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardTextColor: '#ffffff',
    pageBackgroundColor: '#1a1a2e',
    buttonSecondaryColor: '#fbbf24',
    buttonSecondaryHoverColor: '#f59e0b',
    buttonNormalBackgroundColor: 'rgba(251, 191, 36, 0.15)'
  },
  fontFamily: 'Inter',
  // Sin efectos especiales para mejor rendimiento
  effects: {
    enableHoverEffect: false,
    enableGlassmorphism: false,
    enableSubtleAnimations: false,
    enableBackgroundPatterns: false,
    enableParticles: false,
    enableAnimatedGradient: false,
    enableFloatingShapes: false
  }
};

/**
 * DATOS CENTRALIZADOS - Consistencia total homepage ↔ editor
 * Single source of truth para todas las demos y previews
 */
export const CONSISTENT_DEMO_DATA = {
  // Usar datos profesionales de Carlos Mendoza (base de DEFAULT_CARD_DATA)
  ...DEFAULT_CARD_DATA,
  
  // 🚨 EFECTOS DESACTIVADOS por defecto - Usuario puede activarlos
  enableHoverEffect: false,
  enableGlassmorphism: false,  
  enableSubtleAnimations: false,
  enableBackgroundPatterns: false,
  enableProfessionalEffects: false,
  
  // Partículas desactivadas
  enableParticles: false,
  particleType: 'professional' as const,
  particleCount: 0,
  particleDensity: 0,
  
  // Efectos de ambiente desactivados
  enableAnimatedGradient: false,
  animatedGradientType: 'none',
  animatedGradientSpeed: 0,
  animatedGradientIntensity: 0, 
  animatedGradientOpacity: 0,
  enableFloatingShapes: false,
  floatingShapesType: 'none',
  floatingShapesCount: 0,
  floatingShapesSpeed: 0,
  ambientIntensity: 0,
  ambientOpacity: 0,
};

/**
 * Configuración para vista previa sin efectos
 */
export const PREVIEW_CONFIG = {
  // Desactivar todos los efectos especiales en preview
  disableAllEffects: true,
  // Usar datos consistentes
  useDefaultData: true,
  // Altura fija para preview
  previewHeight: '600px',
  // Fondo consistente
  consistentBackground: true
};