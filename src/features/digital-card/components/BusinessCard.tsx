'use client';

import { Card, Stack, Button } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getBestTextColor, getContrastRatio, isAccessible } from '@/lib/contrast';
import { useVisualEffects } from '@/hooks/useVisualEffects';
import { useMouseTracking } from '@/hooks/useMouseTracking';
// 🎨 INDI Design System - Visual Excellence
import { DesignTokens } from '@/lib/design/tokens';
import { useOptimizedColors, evaluateContrast, generateButtonColors } from '@/lib/design/contrast';
// 🚀 ProfessionalEffectsSystem v4.0 - Sistema unificado de efectos profesionales 
import ProfessionalEffectsSystem, { ProfessionalPersonality, EffectIntensity } from '@/components/effects/ProfessionalEffectsSystem';
// 🌟 SmartParticles v3.0 - Sistema simplificado que aporta valor real (Fallback)
import SmartParticles from '@/components/effects/SmartParticles';
// ⭐ FloatingShapes v1.0 - Formas flotantes con gradientes animados
import FloatingShapes from '@/components/effects/FloatingShapes';

const QrCodeDisplay = dynamic(() => import('./QrCodeDisplay'), { ssr: false });

interface BusinessCardProps {
  name: string;
  title: string;
  about: string;
  location: string;
  whatsapp: string;
  email: string;
  photoUrl: string;
  cardBackgroundColor: string;
  cardTextColor: string;
  pageBackgroundColor?: string;
  enableHoverEffect: boolean;
  enableGlassmorphism: boolean;
  enableSubtleAnimations: boolean;
  enableBackgroundPatterns: boolean;
  enableParticles?: boolean;
  particleType?: 'floating' | 'constellation' | 'professional' | 'creative';
  particleCount?: number;
  particleDensity?: number;
  particleColor?: string;
  
  // 🚀 Nuevo Sistema Profesional v4.0
  enableProfessionalEffects?: boolean;
  professionalPersonality?: ProfessionalPersonality;
  effectIntensity?: EffectIntensity;
  
  // Nuevos efectos de ambiente (matching schema.prisma)
  enableAnimatedGradient?: boolean;
  animatedGradientType?: string;
  animatedGradientSpeed?: number;
  animatedGradientIntensity?: number;
  animatedGradientOpacity?: number;
  enableFloatingShapes?: boolean;
  floatingShapesType?: string;
  floatingShapesCount?: number;
  floatingShapesSpeed?: number;
  ambientIntensity?: number;
  ambientOpacity?: number;
  whatsappShareUrl: string;
  appointmentLink: string;
  professionalDetails: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  website: string;
  buttonSecondaryColor: string;
  buttonNormalBackgroundColor: string;
  buttonSecondaryHoverColor: string;
  template?: string; // Nueva prop para la plantilla visual
  fontFamily?: string; // Nueva prop para la fuente
  isPreviewMode?: boolean; // Modo preview para holograma
  // Mouse tracking
  enableMouseTracking?: boolean;
  mouseTrackingSensitivity?: number;
  enableMouseGlow?: boolean;
  enableMouseTilt?: boolean;
  enableMouseParticles?: boolean;
}

const staticStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Poppins:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Crimson+Text:wght@400;600;700&display=swap');
  
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-5px) scale(1.02); }
  }
  @keyframes glassShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  /* Sistema de Partículas Inteligente */
  @keyframes floatingParticle {
    0%, 100% { 
      transform: translateY(0px) translateX(0px) scale(1);
      opacity: 0.7;
    }
    33% { 
      transform: translateY(-15px) translateX(5px) scale(1.1);
      opacity: 1;
    }
    66% { 
      transform: translateY(-5px) translateX(-3px) scale(0.9);
      opacity: 0.8;
    }
  }
  
  @keyframes constellation {
    0% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0.3; transform: scale(0.8); }
  }
  
  @keyframes professionalPulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  @keyframes creativeSwirl {
    0% { transform: rotate(0deg) translateX(10px) rotate(0deg); opacity: 0.6; }
    100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); opacity: 0.6; }
  }
  
  /* Contenedor de partículas */
  .particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    border-radius: inherit;
    z-index: 1;
  }
  
  /* Tipos de partículas */
  .particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  
  .particle-floating {
    animation: floatingParticle 6s ease-in-out infinite;
  }
  
  .particle-constellation {
    animation: constellation 4s ease-in-out infinite;
  }
  
  .particle-professional {
    animation: professionalPulse 3s ease-in-out infinite;
    border-radius: 2px;
  }
  
  .particle-creative {
    animation: creativeSwirl 8s linear infinite;
    border-radius: 0;
    transform-origin: center;
  }
  
  /* Líneas de conexión para constellation */
  .constellation-line {
    position: absolute;
    height: 1px;
    background: currentColor;
    opacity: 0.3;
    transform-origin: left center;
    pointer-events: none;
  }
  
  /* Animación combinada para patterns - solo aplica si no hay background inline */
  /* CSS legacy removido - ahora se maneja con el nuevo sistema modular */
  /* 🎨 INDI DESIGN SYSTEM - BOTONES CON JERARQUÍA PROFESIONAL */
  
  /* Botón Primario - Máxima Prominencia */
  .btn-primary-indi {
    background: var(--button-primary-bg) !important;
    color: var(--button-primary-text) !important;
    border: none !important;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: var(--font-size-button);
    font-weight: var(--font-weight-button);
    letter-spacing: 0.02em;
    min-height: 52px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
    position: relative;
    overflow: hidden;
  }
  
  .btn-primary-indi:hover {
    background: var(--button-primary-hover-bg) !important;
    color: var(--button-primary-hover-text) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  .btn-primary-indi:active {
    transform: translateY(0);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  }
  
  /* Botones Secundarios - Elegancia Sutil */
  .btn-outline-secondary-custom {
    color: var(--button-secondary-color) !important;
    border: 2px solid var(--button-secondary-color) !important;
    background: var(--button-normal-bg-color) !important;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: var(--font-size-button);
    font-weight: 500;
    letter-spacing: 0.01em;
    min-height: 48px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
  }
  
  .btn-outline-secondary-custom:hover {
    color: var(--button-hover-text-color) !important;
    background: var(--button-secondary-hover-color) !important;
    border-color: var(--button-secondary-hover-color) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* 🎨 TYPOGRAPHY SYSTEM - Jerarquía Visual Perfecta */
  .indi-title-hero {
    font-size: var(--font-size-hero) !important;
    font-weight: var(--font-weight-hero) !important;
    line-height: var(--line-height-hero) !important;
    letter-spacing: -0.02em;
    margin-bottom: 12px !important;
    color: var(--card-text-color) !important;
  }
  
  .indi-title-main {
    font-size: var(--font-size-title) !important;
    font-weight: var(--font-weight-title) !important;
    line-height: var(--line-height-title) !important;
    letter-spacing: -0.01em;
    margin-bottom: 8px !important;
    color: var(--card-text-color) !important;
  }
  
  .indi-subtitle {
    font-size: var(--font-size-subtitle) !important;
    font-weight: var(--font-weight-subtitle) !important;
    line-height: var(--line-height-subtitle) !important;
    opacity: 0.9;
    margin-bottom: var(--spacing-section-gap) !important;
    color: var(--card-text-color) !important;
  }
  
  .indi-section-title {
    font-size: var(--font-size-caption) !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.85;
    margin-bottom: 20px !important;
    color: var(--card-text-color) !important;
  }
  
  .indi-body-text {
    font-size: var(--font-size-body) !important;
    line-height: var(--line-height-body) !important;
    letter-spacing: 0.01em;
    opacity: 0.95;
    color: var(--card-text-color) !important;
  }
  
  /* 🎨 SPACING SYSTEM - Respiración Visual Optimizada */
  .indi-section {
    margin-bottom: var(--spacing-section-gap) !important;
    padding-top: 32px;
    border-top: 1px solid rgba(var(--card-text-color-rgb), 0.1);
  }
  
  .indi-section:first-child {
    border-top: none;
    padding-top: 0;
  }
  
  .indi-button-stack {
    gap: var(--spacing-button-gap) !important;
    margin-top: 8px;
  }
  
  .indi-photo-container {
    margin-bottom: var(--spacing-photo-margin) !important;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 📱 RESPONSIVE DESIGN - Mobile-First Excellence */
  @media (max-width: 768px) {
    .btn-primary-indi {
      padding: 14px 24px;
      min-height: 48px;
      font-size: 1rem;
    }
    
    .btn-outline-secondary-custom {
      padding: 12px 20px;
      min-height: 44px;
      font-size: 1rem;
    }
    
    .indi-button-stack {
      gap: 14px !important;
    }
    
    .indi-section {
      margin-bottom: 24px !important;
      padding-top: 24px;
    }
  }
  
  /* 🎭 MICRO-INTERACTIONS - Detalles que Importan */
  .indi-card-container {
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(1px);
  }
  
  .indi-card-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    opacity: 0.6;
  }
`;

export default function BusinessCard({ 
  name, title, about, location, whatsapp, email, photoUrl, 
  cardBackgroundColor, cardTextColor, pageBackgroundColor = '#121212', 
  enableHoverEffect, enableGlassmorphism, enableSubtleAnimations, enableBackgroundPatterns, 
  enableParticles = false, particleType = 'floating', particleCount = 50, particleDensity = 3, particleColor = 'auto',
  // 🚀 Nuevo Sistema Profesional v4.0
  enableProfessionalEffects = false, professionalPersonality = 'trustworthy', effectIntensity = 'balanced',
  // Efectos de ambiente 
  enableAnimatedGradient = false, animatedGradientType = 'aurora', animatedGradientSpeed = 3, animatedGradientIntensity = 3, animatedGradientOpacity = 0.5, 
  enableFloatingShapes = false, floatingShapesType = 'geometric', floatingShapesCount = 3, floatingShapesSpeed = 3, 
  ambientIntensity = 3, ambientOpacity = 0.5, 
  appointmentLink, professionalDetails, linkedin, instagram, twitter, facebook, website, 
  buttonSecondaryColor, buttonNormalBackgroundColor, buttonSecondaryHoverColor, 
  template = 'modern', fontFamily = 'Montserrat', isPreviewMode = false, 
  enableMouseTracking = false, mouseTrackingSensitivity = 1.0, enableMouseGlow = true, enableMouseTilt = true, enableMouseParticles = false 
}: BusinessCardProps) {
  const [qrCodeValue, setQrCodeValue] = useState('');

  // 🎨 INDI DESIGN SYSTEM - AUTO-OPTIMIZACIÓN VISUAL
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Colores optimizados automáticamente para contraste perfecto
  const optimizedColors = useOptimizedColors(cardTextColor, cardBackgroundColor, true);
  
  // Sistema de botones con jerarquía inteligente
  const buttonSystem = generateButtonColors(buttonSecondaryColor || '#00F6FF');
  
  // Responsive spacing basado en design tokens optimizados
  const spacing = {
    cardPadding: isMobile ? DesignTokens.spacing.card.padding.mobile : DesignTokens.spacing.card.padding.desktop,
    sectionGap: isMobile ? DesignTokens.spacing.card.sections.gapMobile : DesignTokens.spacing.card.sections.gap,
    buttonGap: isMobile ? DesignTokens.spacing.card.elements.buttonGapMobile : DesignTokens.spacing.card.elements.buttonGap,
    photoMargin: isMobile ? DesignTokens.spacing.internal.photoMarginMobile : DesignTokens.spacing.internal.photoMargin
  };

  // Viewport spacing para respiración visual crítica
  const viewportSpacing = isMobile 
    ? DesignTokens.spacing.viewport.mobile 
    : DesignTokens.spacing.viewport.desktop;
  
  // Typography system profesional
  const typography = isMobile ? DesignTokens.typography.mobile : DesignTokens.typography.scale;

  // Sistema de efectos visuales limpio y modular
  const {
    effectsState,
    dynamicStyles,
    cssClasses,
    mouseTrackingConfig
  } = useVisualEffects({
    enableHoverEffect,
    enableGlassmorphism,
    enableSubtleAnimations,
    enableBackgroundPatterns,
    enableParticles,
    particleType,
    particleCount,
    // Nuevos efectos de ambiente
    enableAnimatedGradient,
    animatedGradientType,
    animatedGradientSpeed,
    animatedGradientIntensity,
    animatedGradientOpacity,
    enableFloatingShapes,
    floatingShapesType,
    floatingShapesCount,
    floatingShapesSpeed,
    ambientIntensity,
    ambientOpacity,
    // Mouse tracking
    enableMouseTracking,
    mouseTrackingSensitivity,
    enableMouseGlow,
    enableMouseTilt,
    enableMouseParticles,
    cardBackgroundColor,
    cardTextColor
  });

  // Mouse tracking hook
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    mousePosition,
    isTracking,
    bindToElement,
    tiltStyles,
    particleStyles
  } = useMouseTracking({
    smoothing: mouseTrackingConfig.smoothing,
    sensitivity: mouseTrackingConfig.sensitivity,
    enableGlow: mouseTrackingConfig.enableGlow,
    enableTilt: mouseTrackingConfig.enableTilt,
    enableParticles: mouseTrackingConfig.enableParticleFollow
  });


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrCodeValue(window.location.href);
    }
  }, []);

  // Debug para pageBackgroundColor
  useEffect(() => {
    console.log('🎨 BusinessCard - pageBackgroundColor recibido:', {
      pageBackgroundColor,
      isPreviewMode,
      location: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [pageBackgroundColor, isPreviewMode]);

  // Bind mouse tracking to card element
  useEffect(() => {
    if (enableMouseTracking && cardRef.current) {
      bindToElement(cardRef.current);
    }
    return () => {
      if (enableMouseTracking) {
        bindToElement(null); // Cleanup
      }
    };
  }, [enableMouseTracking, bindToElement]);

  // Validar contraste al cargar la tarjeta
  useEffect(() => {
    if (cardBackgroundColor && cardTextColor) {
      validateContrast(cardTextColor, cardBackgroundColor);
    }
    if (buttonSecondaryColor && buttonNormalBackgroundColor) {
      validateContrast(buttonSecondaryColor, buttonNormalBackgroundColor);
    }
  }, [cardBackgroundColor, cardTextColor, buttonSecondaryColor, buttonNormalBackgroundColor]);

  // Usar la utilidad de contraste mejorada
  const getContrastTextColor = (hexcolor: string) => getBestTextColor(hexcolor);
  
  // Función para validar accesibilidad
  const validateContrast = (textColor: string, bgColor: string) => {
    const ratio = getContrastRatio(textColor, bgColor);
    const accessible = isAccessible(textColor, bgColor, 'AA', 'normal');
    
    if (!accessible) {
      console.warn(`Contraste insuficiente: ${ratio.toFixed(2)}:1 entre ${textColor} y ${bgColor}`);
    }
    
    return { ratio, accessible };
  };

  // Function to properly format social media URLs
  const formatSocialUrl = (input: string, platform: string): string => {
    if (!input) return '';
    
    // Remove leading @ symbol if present
    let cleanInput = input.replace(/^@/, '');
    
    // If already a complete URL, return as is
    if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
      return cleanInput;
    }
    
    // Remove platform domain if user included it
    const platformDomains = {
      instagram: /^(instagram\.com\/|www\.instagram\.com\/)/i,
      linkedin: /^(linkedin\.com\/in\/|www\.linkedin\.com\/in\/)/i,
      twitter: /^(twitter\.com\/|www\.twitter\.com\/|x\.com\/|www\.x\.com\/)/i,
      facebook: /^(facebook\.com\/|www\.facebook\.com\/)/i
    };
    
    if (platformDomains[platform as keyof typeof platformDomains]) {
      cleanInput = cleanInput.replace(platformDomains[platform as keyof typeof platformDomains], '');
    }
    
    // Build proper URL based on platform
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${cleanInput}`;
      case 'linkedin':
        return `https://linkedin.com/in/${cleanInput}`;
      case 'twitter':
        return `https://x.com/${cleanInput}`;
      case 'facebook':
        return `https://facebook.com/${cleanInput}`;
      default:
        return cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`;
    }
  };

  // Function to format WhatsApp numbers
  const formatWhatsAppUrl = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, assume Chile (+56)
    if (!cleanNumber.startsWith('56') && cleanNumber.length >= 8) {
      cleanNumber = '56' + cleanNumber;
    }
    
    return `https://wa.me/${cleanNumber}`;
  };

  // Function to ensure URLs have proper protocol
  const ensureHttps = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Definir estilos de plantillas visuales
  const getTemplateStyles = (templateId: string) => {
    const templates = {
      modern: {
        cardStyle: {
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        headerStyle: {
          textAlign: 'center' as const,
          marginBottom: '1.5rem',
        },
        nameStyle: {
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        titleStyle: {
          fontSize: '1.1rem',
          fontWeight: '500',
          opacity: 0.9,
          marginBottom: '1rem',
        },
        photoStyle: {
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        },
      },
      elegant: {
        cardStyle: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        headerStyle: {
          textAlign: 'left' as const,
          marginBottom: '2rem',
          borderBottom: '2px solid',
          paddingBottom: '1rem',
        },
        nameStyle: {
          fontSize: '2rem',
          fontWeight: '300',
          marginBottom: '0.25rem',
          letterSpacing: '1px',
        },
        titleStyle: {
          fontSize: '1rem',
          fontWeight: '400',
          opacity: 0.8,
          fontStyle: 'italic',
          marginBottom: '1.5rem',
        },
        photoStyle: {
          borderRadius: '8px',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        },
      },
      creative: {
        cardStyle: {
          borderRadius: '25px',
          boxShadow: '0 12px 40px rgba(31, 38, 135, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        },
        headerStyle: {
          textAlign: 'center' as const,
          marginBottom: '2rem',
          position: 'relative' as const,
        },
        nameStyle: {
          fontSize: '2.2rem',
          fontWeight: '800',
          marginBottom: '0.5rem',
          background: 'linear-gradient(45deg, #00F6FF, #0072ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          // Fallback para cuando hay glassmorphism
          color: 'transparent',
        },
        titleStyle: {
          fontSize: '1.2rem',
          fontWeight: '600',
          opacity: 1,
          marginBottom: '1rem',
          textTransform: 'uppercase' as const,
          letterSpacing: '2px',
        },
        photoStyle: {
          borderRadius: '50%',
          border: '6px solid',
          borderImage: 'linear-gradient(45deg, #00F6FF, #0072ff) 1',
          boxShadow: '0 8px 24px rgba(0,246,255,0.3)',
        },
      },
      classic: {
        cardStyle: {
          borderRadius: '8px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        },
        headerStyle: {
          textAlign: 'center' as const,
          marginBottom: '1.5rem',
          padding: '1rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
        nameStyle: {
          fontSize: '1.6rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          fontFamily: 'serif',
        },
        titleStyle: {
          fontSize: '1rem',
          fontWeight: '400',
          opacity: 0.85,
          marginBottom: '1rem',
        },
        photoStyle: {
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
        },
      },
      ocean: {
        cardStyle: {
          background: 'linear-gradient(135deg, #006994 0%, #004d6b 50%, #003947 100%)',
          border: '2px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
        },
        headerStyle: {
          background: 'transparent',
          borderBottom: 'none',
          textAlign: 'center' as const,
          padding: '2rem 2rem 1rem',
        },
        nameStyle: {
          fontSize: '1.8rem',
          fontWeight: '700',
          color: '#ffffff',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          marginBottom: '0.5rem',
        },
        titleStyle: {
          fontSize: '1.1rem',
          fontWeight: '500',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '1rem',
        },
        aboutStyle: {
          fontSize: '0.95rem',
          fontWeight: '400',
          color: 'rgba(255, 255, 255, 0.85)',
          marginBottom: '1rem',
          lineHeight: '1.5',
        },
        photoStyle: {
          borderRadius: '50%',
          border: '3px solid rgba(0, 212, 255, 0.4)',
          boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)',
        },
      },
    };
    
    return templates[templateId as keyof typeof templates] || templates.modern;
  };

  // Function to generate professional WhatsApp share messages based on profession
  const generateCreativeWhatsAppMessage = (name: string, profession: string, about: string): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    // Clean and format the about text for better presentation
    const formatAbout = (text: string) => {
      if (!text) return '';
      // Clean up the text and limit to reasonable length
      return text.length > 200 ? text.substring(0, 200) + '...' : text;
    };

    const formattedAbout = formatAbout(about);
    
    // Professional templates following the Andrés Astorga format
    const templates = {
      // Medical professionals
      doctor: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para agendar una cita y contactarlo aquí: ${baseUrl}`,

      psicologo: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para agendar una cita y contactarlo aquí: ${baseUrl}`,

      // Legal professionals  
      abogado: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para contactarlo y conocer sus servicios legales aquí: ${baseUrl}`,

      // Tech professionals
      desarrollador: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios y proyectos aquí: ${baseUrl}`,

      ingeniero: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios profesionales aquí: ${baseUrl}`,

      // Business professionals
      consultor: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios de consultoría aquí: ${baseUrl}`,

      contador: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios contables y financieros aquí: ${baseUrl}`,

      // Creative professionals
      diseñador: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás todo su portafolio y información de contacto aquí: ${baseUrl}`,

      arquitecto: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus proyectos y servicios aquí: ${baseUrl}`,

      chef: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios culinarios aquí: ${baseUrl}`,

      profesor: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios educativos aquí: ${baseUrl}`,

      fotografo: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás todo su portafolio y información para sesiones aquí: ${baseUrl}`,

      marketing: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información sobre sus servicios de marketing aquí: ${baseUrl}`,

      // Default professional template
      default: `Te comparto la tarjeta de presentación digital de ${name}, ${profession}.

${formattedAbout ? `${formattedAbout}

` : ''}Encontrarás toda la información para contactarlo y conocer sus servicios aquí: ${baseUrl}`
    };

    // Detect profession type
    const professionLower = profession.toLowerCase();
    
    if (professionLower.includes('doctor') || professionLower.includes('médico') || professionLower.includes('dra') || professionLower.includes('dr.')) {
      return templates.doctor;
    } else if (professionLower.includes('abogado') || professionLower.includes('legal') || professionLower.includes('derecho')) {
      return templates.abogado;
    } else if (professionLower.includes('desarrollador') || professionLower.includes('developer') || professionLower.includes('programador')) {
      return templates.desarrollador;
    } else if (professionLower.includes('ingeniero') || professionLower.includes('engineer')) {
      return templates.ingeniero;
    } else if (professionLower.includes('consultor') || professionLower.includes('consultant')) {
      return templates.consultor;
    } else if (professionLower.includes('contador') || professionLower.includes('contable') || professionLower.includes('financiero')) {
      return templates.contador;
    } else if (professionLower.includes('diseñador') || professionLower.includes('designer')) {
      return templates.diseñador;
    } else if (professionLower.includes('arquitecto') || professionLower.includes('architect')) {
      return templates.arquitecto;
    } else if (professionLower.includes('psicólogo') || professionLower.includes('psicologo') || professionLower.includes('psychologist')) {
      return templates.psicologo;
    } else if (professionLower.includes('chef') || professionLower.includes('cocinero') || professionLower.includes('gastronom')) {
      return templates.chef;
    } else if (professionLower.includes('profesor') || professionLower.includes('teacher') || professionLower.includes('educador') || professionLower.includes('docente')) {
      return templates.profesor;
    } else if (professionLower.includes('fotógrafo') || professionLower.includes('fotografo') || professionLower.includes('photographer')) {
      return templates.fotografo;
    } else if (professionLower.includes('marketing') || professionLower.includes('publicista') || professionLower.includes('community manager')) {
      return templates.marketing;
    } else {
      return templates.default;
    }
  };

  // Sistema inteligente de combinación de efectos sin conflictos
  const getCombinedEffectsStyles = (
    template: string,
    effects: {
      hover: boolean;
      glass: boolean;
      animations: boolean;
      patterns: boolean;
    }
  ) => {
    const baseTemplate = getTemplateStyles(template);
    
    // 🎨 INDI DESIGN SYSTEM - Base styles optimizados para respiración visual
    const baseStyles = {
      width: '100%',
      maxWidth: viewportSpacing.maxCardWidth, // Usar ancho optimizado del viewport
      color: optimizedColors.textColor, // Usar color optimizado para contraste perfecto
      fontFamily: fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: typography.body.size,
      lineHeight: typography.body.lineHeight,
      letterSpacing: typography.body.letterSpacing,
      // Transiciones profesionales suaves
      transition: enableHoverEffect ? 'none' : DesignTokens.effects.transitions.normal,
      // Padding responsivo profesional OPTIMIZADO
      padding: spacing.cardPadding,
      margin: '0 auto',
      // Sombras sutiles pero impactantes
      boxShadow: DesignTokens.effects.shadows.card,
      borderRadius: DesignTokens.effects.radius.card,
      // CSS custom properties para sistema de colores inteligente
      '--card-background-color': optimizedColors.backgroundColor,
      '--card-text-color': optimizedColors.textColor,
      '--button-primary-bg': buttonSystem.primary.background,
      '--button-primary-text': buttonSystem.primary.text,
      '--button-primary-hover-bg': buttonSystem.hover.background,
      '--button-primary-hover-text': buttonSystem.hover.text,
      '--button-secondary-color': buttonSecondaryColor,
      '--button-normal-bg-color': buttonNormalBackgroundColor,
      '--button-secondary-hover-color': buttonSecondaryHoverColor,
      '--button-hover-text-color': getContrastTextColor(buttonSecondaryHoverColor),
      '--spacing-section-gap': spacing.sectionGap,
      '--spacing-button-gap': spacing.buttonGap,
      '--spacing-photo-margin': spacing.photoMargin,
      // Typography CSS variables
      '--font-size-hero': typography.hero.size,
      '--font-size-title': typography.title.size,
      '--font-size-subtitle': typography.subtitle.size,
      '--font-size-body': typography.body.size,
      '--font-size-caption': typography.caption.size,
      '--font-size-button': typography.button.size,
      '--font-weight-hero': typography.hero.weight,
      '--font-weight-title': typography.title.weight,
      '--font-weight-subtitle': typography.subtitle.weight,
      '--font-weight-button': typography.button.weight,
      '--line-height-hero': typography.hero.lineHeight,
      '--line-height-title': typography.title.lineHeight,
      '--line-height-subtitle': typography.subtitle.lineHeight,
      '--line-height-body': typography.body.lineHeight,
    };

    // Determinar color de fondo inteligentemente
    let background = cardBackgroundColor;
    let backdropFilter = 'none';
    let border = baseTemplate.cardStyle.border || 'none';
    
    if (effects.glass && !enableGlassmorphism) {
      // Legacy glassmorphism (solo si el nuevo sistema no está activo)
      if (cardBackgroundColor.startsWith('linear-gradient')) {
        // Para gradientes, mantener el gradiente original con ligero overlay
        background = cardBackgroundColor;
        backdropFilter = 'blur(8px) saturate(1.2)';
        border = '1px solid rgba(255, 255, 255, 0.2)';
      } else {
        // Para colores sólidos, aplicar transparencia
        const rgb = cardBackgroundColor.startsWith('#') 
          ? hexToRgb(cardBackgroundColor) 
          : parseRgb(cardBackgroundColor);
        
        if (rgb) {
          background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;
          backdropFilter = 'blur(12px) saturate(1.8)';
          border = `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
        }
      }
    } else if (enableGlassmorphism) {
      // Nuevo sistema de glassmorphism manejado por CSS - mantener fondo original
      background = cardBackgroundColor;
      backdropFilter = 'none'; // El CSS se encarga del backdrop-filter
      border = 'none'; // El CSS se encarga del border
    }

    // Combinar box-shadow de template, hover y glass
    let boxShadow = baseTemplate.cardStyle.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)';
    
    if (effects.hover && effects.glass) {
      // Combinación hover + glass
      boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 32px rgba(31, 38, 135, 0.4)';
    } else if (effects.hover) {
      // Solo hover
      boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
    } else if (effects.glass) {
      // Solo glass - mantener sombra de template pero más sutil
      const templateShadow = baseTemplate.cardStyle.boxShadow;
      boxShadow = templateShadow || '0 8px 32px rgba(31, 38, 135, 0.3)';
    }

    // Transform base - NO aplicar si hover effect está habilitado (conflicto con CSS)
    // Transform base - NO aplicar si hover effect está habilitado (conflicto con CSS)
    const transform = enableHoverEffect ? 'none' : 'translateY(0)';

    // Animaciones inteligentes - evitar conflicto con subtle animations
    let animation = 'none';
    if (enableSubtleAnimations) {
      // Si subtle animations está habilitado, no aplicar animation inline (conflicto)
      animation = 'none';
    } else if (effects.animations && !effects.patterns) {
      // Solo fadeIn si no hay patterns (patterns ya tienen su propia animación)
      animation = 'fadeIn 1s ease-out';
    } else if (effects.animations && effects.patterns) {
      // Para patterns, solo agregamos fadeIn inicial, gradientAnimation viene de la clase CSS
      animation = 'fadeIn 1.2s ease-out';
    }

    // Combinar borderRadius - prioridad: glass > template
    let borderRadius = baseTemplate.cardStyle.borderRadius || '12px';
    if (effects.glass) {
      // Glass effect funciona mejor con bordes más redondeados
      const templateRadius = parseInt(baseTemplate.cardStyle.borderRadius || '12');
      borderRadius = `${Math.max(templateRadius, 16)}px`;
    }

    return {
      ...baseStyles,
      background,
      backdropFilter,
      border,
      borderRadius,
      boxShadow,
      // Solo aplicar transform si no interfiere con hover effect
      ...(transform !== 'none' && { transform }),
      // Solo aplicar animation si no interfiere con subtle animations
      ...(animation !== 'none' && !enableSubtleAnimations && { animation }),
      // Mantener propiedades específicas de template que no conflictúan
      ...Object.fromEntries(
        Object.entries(baseTemplate.cardStyle).filter(([key]) => 
          !['background', 'backgroundColor', 'backdropFilter', 'border', 'borderRadius', 'boxShadow', 'transform', 'animation'].includes(key)
        )
      ),
    } as React.CSSProperties & Record<string, string>;
  };

  // Función helper para convertir hex a rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Renderizado de partículas de fondo (en page-background-container)
  const renderBackgroundParticles = () => {
    // Mostrar partículas de fondo si están habilitadas las partículas O los patrones de fondo
    if (!effectsState.particles.enabled && !effectsState.backgroundPatterns.enabled) return null;

    const backgroundParticles = [];
    // Si solo están activados los patrones de fondo, usar configuración por defecto más sutil
    const baseParticleCount = effectsState.particles.enabled ? effectsState.particles.count : 15;
    const backgroundParticleCount = Math.floor(baseParticleCount / 3); // Menos partículas en el fondo
    
    const getParticleColor = () => {
      if (particleColor !== 'auto') return particleColor;
      // Para fondo, usar color más sutil
      return cardTextColor === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : cardTextColor + '30';
    };

    const color = getParticleColor();

    for (let i = 0; i < backgroundParticleCount; i++) {
      const size = Math.random() * 3 + 1; // Partículas más pequeñas para el fondo
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const animationDelay = Math.random() * 6;
      
      // Tipo de partícula: usar el configurado o 'floating' por defecto para patrones de fondo
      const particleTypeForBg = effectsState.particles.enabled ? effectsState.particles.type : 'floating';

      backgroundParticles.push(
        <div
          key={`bg-${i}`}
          className={`particle particle-${particleTypeForBg}`}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            borderRadius: particleTypeForBg === 'creative' ? '0' : '50%',
            animationDelay: `${animationDelay}s`,
            zIndex: 1,
            pointerEvents: 'none',
            // Agregar animaciones específicas
            ...(particleTypeForBg === 'floating' && {
              animation: `floatingParticle ${6 + Math.random() * 3}s ease-in-out infinite`,
            }),
            ...(particleTypeForBg === 'creative' && {
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animation: `creativeSwirl ${8 + Math.random() * 4}s linear infinite`,
            }),
            ...(particleTypeForBg === 'constellation' && {
              boxShadow: `0 0 8px ${color}`,
              animation: `constellation ${4 + Math.random() * 2}s ease-in-out infinite`,
            }),
            ...(particleTypeForBg === 'professional' && {
              borderRadius: '2px',
              animation: `professionalPulse ${3 + Math.random() * 2}s ease-in-out infinite`,
            }),
          }}
        />
      );
    }

    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit'
      }}>
        {backgroundParticles}
      </div>
    );
  };

  // 🌟 SmartParticles v3.0 - Sistema simplificado que aporta valor real
  const getParticlesConfig = () => {
    if (!effectsState.particles.enabled) return null;

    // Mapear tipos legacy a comportamientos SmartParticles
    let behavior: 'static' | 'interactive' | 'ambient' = 'static';
    if (effectsState.particles.type === 'creative') {
      behavior = 'interactive';
    } else if (effectsState.particles.type === 'constellation') {
      behavior = 'ambient';
    }

    // Mapear count a intensity
    let intensity: 'subtle' | 'balanced' | 'prominent' = 'balanced';
    if (effectsState.particles.count <= 3) {
      intensity = 'subtle';
    } else if (effectsState.particles.count >= 7) {
      intensity = 'prominent';
    }

    // Detectar tema basado en colores de la tarjeta
    const getThemeFromBackground = (background: string): string => {
      if (background.includes('#1a1a2e') || background.includes('#7986cb')) return 'diamond';
      if (background.includes('#064e3b') || background.includes('#10b981')) return 'emerald';
      if (background.includes('#4a4a4a') || background.includes('#e5e7eb')) return 'platinum';
      if (background.includes('#667eea') || background.includes('#3b82f6')) return 'sapphire';
      if (background.includes('#fc466b') || background.includes('#ef4444')) return 'ruby';
      if (background.includes('#ffd700') || background.includes('#fbbf24')) return 'gold';
      return 'professional';
    };

    return {
      enabled: true,
      intensity,
      behavior,
      theme: getThemeFromBackground(cardBackgroundColor),
      targetElement: 'card' as const
    };
  };

  // Función helper para parsear rgb
  const parseRgb = (rgb: string) => {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    } : null;
  };

  // Obtener estilos de la plantilla seleccionada
  const templateStyles = getTemplateStyles(template);
  
  // Debug temporal para rastrear actualizaciones
  useEffect(() => {
    console.log('🎨 BusinessCard - Props actuales:', {
      cardBackgroundColor,
      cardTextColor,
      buttonSecondaryColor,
      template
    });
  }, [cardBackgroundColor, cardTextColor, buttonSecondaryColor, template]);

  // Aplicar sistema inteligente de efectos con ajustes para preview
  const cardStyles = {
    ...getCombinedEffectsStyles(template, {
      hover: enableHoverEffect,
      glass: enableGlassmorphism,
      animations: enableSubtleAnimations,
      patterns: enableBackgroundPatterns
    }),
    // Mouse tracking effects
    ...(enableMouseTracking && {
      ...tiltStyles,
      ...particleStyles,
      // Glow effect position
      ...(isTracking && mousePosition.isInside && {
        '--glow-x': `${mousePosition.elementX}px`,
        '--glow-y': `${mousePosition.elementY}px`,
      })
    }),
    // Ajustes específicos para preview mode
    ...(isPreviewMode && {
      maxWidth: '340px',
      width: '85%',
      minHeight: '480px',
      height: 'auto',
      // Optimizar padding para preview - más compacto
      padding: '18px 20px',
      // Sombra mejorada para preview
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15), 0 4px 15px rgba(0, 0, 0, 0.1)',
      // Border radius para mejor apariencia
      borderRadius: '16px',
      // Escala visual mejorada
      transform: 'scale(1)',
      transition: 'all 0.3s ease',
      margin: '0 auto'
    })
  };


  // Generar clases CSS dinámicas para efectos combinados
  // Sistema de clases base (sin efectos - el nuevo sistema los maneja)
  const getBaseCardClasses = () => {
    const classes = ['text-center', 'business-card-custom'];
    
    // Add tracking state class
    if (enableMouseTracking && isTracking) {
      classes.push('tracking-active');
    }
    
    return classes.join(' ');
  };

  return (
    <>
      <style>{staticStyles}</style>
      <style>{dynamicStyles}</style>
      <div 
        className={`${isPreviewMode ? 'preview-background-container' : 'page-background-container'} ${cssClasses}`}
        style={{
          ...(isPreviewMode ? {
            // Preview mode: aplicar el pageBackgroundColor aquí también
            minHeight: '100%',
            width: '100%',
            margin: '0',
            padding: '1rem',
            borderRadius: '0',
            backgroundColor: pageBackgroundColor // Usar el color de fondo real
          } : {
            // Full page mode: centrar contenido sin espacio extra
            backgroundColor: pageBackgroundColor,
            minHeight: '100vh', // Mantener 100vh para fondo completo
            width: '100vw',
            margin: '-2rem -1rem',
            padding: '2rem 1rem',
            borderRadius: '0px'
          }),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          // Patrones de fondo sutiles
          ...(enableBackgroundPatterns && {
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)
            `,
            backgroundSize: '60px 60px, 40px 40px, 100px 100px',
            backgroundPosition: '0 0, 30px 30px, 0 0'
          })
        }}
      >
        {/* Partículas de fondo */}
        {renderBackgroundParticles()}
        <FloatingShapes
          enabled={effectsState.floatingShapes.enabled}
          type={effectsState.floatingShapes.type as 'geometric' | 'organic' | 'stars' | 'particles' | 'professional'}
          count={effectsState.floatingShapes.count}
          speed={effectsState.floatingShapes.speed}
          theme={getParticlesConfig()?.theme || 'professional'}
        >
          <SmartParticles
            {...(getParticlesConfig() || { enabled: false, intensity: 'subtle', behavior: 'static', theme: 'professional', targetElement: 'card' })}
          >
          <Card 
            ref={cardRef}
            className={`${getBaseCardClasses()} ${cssClasses} indi-card-container`} 
            style={cardStyles}
          >
          <Card.Body style={{ padding: 0 }}>
          <Stack gap={0} className="indi-sections-container">
            {/* 🎨 HEADER SECTION - Máximo Impacto Visual */}
            <div className="indi-section header-section">
              <div className="indi-photo-container">
                <div style={{ 
                  position: 'relative',
                  // Foto más pequeña y menos dominante para mejor balance
                  width: isPreviewMode ? '80px' : isMobile ? '90px' : '100px', 
                  height: isPreviewMode ? '80px' : isMobile ? '90px' : '100px',
                  overflow: 'hidden',
                  borderRadius: template === 'creative' ? '50%' : templateStyles.photoStyle?.borderRadius || '50%',
                  border: `2px solid var(--card-text-color)`, // Border más sutil
                  boxShadow: DesignTokens.effects.shadows.photo,
                  opacity: 0.95
                }}>
                  <Image
                    src={photoUrl}
                    alt="Foto del Profesional"
                    fill
                    style={{ 
                      objectFit: 'cover',
                      objectPosition: 'center center',
                      width: '100%',
                      height: '100%'
                    }}
                    sizes="120px"
                    priority={false}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
              </div>
              
              {/* Título Principal - ÚNICO y Prominente */}
              <Card.Title 
                as="h1" 
                className={name.length > 25 ? "indi-title-main" : "indi-title-hero"}
                style={{
                  textAlign: 'center',
                  marginBottom: '0.75rem', // Espaciado optimizado
                  // Template creative mantiene su gradiente especial
                  ...(template === 'creative' && {
                    background: 'linear-gradient(45deg, #00F6FF, #0072ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  })
                }}
              >
                {name}
              </Card.Title>
              
              {/* Especialidad como Subtítulo - Información REAL no duplicada */}
              <Card.Subtitle 
                as="h2" 
                className="indi-subtitle"
                style={{ 
                  textAlign: 'center',
                  marginBottom: '1.5rem' // Más separación de contenido
                }}
              >
                {title}
              </Card.Subtitle>
            </div>

            {/* 📖 ABOUT SECTION - Contenido Completo y Legible */}
            {about && (
              <div className="indi-section about-section" style={{ textAlign: 'left' }}>
                <h3 className="indi-section-title">Sobre Mí</h3>
                <p className="indi-body-text mb-0" style={{ 
                  textAlign: 'justify',
                  lineHeight: '1.6' // Mejor legibilidad
                }}>
                  {about}
                </p>
                {/* 🤖 IA Suggestion Badge - Solo si el texto es muy largo */}
                {about.length > 300 && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(0, 246, 255, 0.1)',
                    border: '1px solid rgba(0, 246, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ opacity: 0.8 }}>
                      💡 <strong>Sugerencia IA:</strong> Considera un texto más conciso para mayor impacto. 
                    </span>
                    <br />
                    <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                      Versión optimizada disponible en el editor
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 🚀 ACTIONS SECTION - Botones con Jerarquía Clara */}
            <div className="indi-section actions-section">
              <Stack className="indi-button-stack">
                {/* 🎯 BOTÓN PRIMARIO - Máxima Conversión */}
                {whatsapp && (
                  <Button 
                    href={formatWhatsAppUrl(whatsapp)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary-indi"
                  >
                    💬 Contactar por WhatsApp
                  </Button>
                )}
                
                {/* 📅 BOTÓN SECUNDARIO DESTACADO */}
                {appointmentLink && (
                  <Button 
                    href={ensureHttps(appointmentLink)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline-secondary-custom"
                  >
                    📅 Agendar una Cita
                  </Button>
                )}
                
                {/* 📧 BOTONES SECUNDARIOS - Contacto Profesional */}
                {email && (
                  <Button 
                    href={`mailto:${email}`} 
                    className="btn-outline-secondary-custom"
                  >
                    ✉️ Enviar Email
                  </Button>
                )}
                
                {/* 🌐 REDES SOCIALES - Conexión Digital */}
                {linkedin && (
                  <Button 
                    href={formatSocialUrl(linkedin, 'linkedin')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline-secondary-custom"
                  >
                    💼 LinkedIn
                  </Button>
                )}
                
                {instagram && (
                  <Button 
                    href={formatSocialUrl(instagram, 'instagram')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline-secondary-custom"
                  >
                    📸 Instagram
                  </Button>
                )}
                
                {twitter && (
                  <Button 
                    href={formatSocialUrl(twitter, 'twitter')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline-secondary-custom"
                  >
                    🐦 X (Twitter)
                  </Button>
                )}
                
                {facebook && (
                  <Button 
                    href={formatSocialUrl(facebook, 'facebook')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline-secondary-custom"
                  >
                    👥 Facebook
                  </Button>
                )}
                
                {website && (
                  <Button 
                    href={website.startsWith('http') ? website : `https://${website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-outline-secondary-custom"
                  >
                    🌐 Sitio Web
                  </Button>
                )}
              </Stack>
            </div>

            {/* 💼 PROFESSIONAL DETAILS - Expertise Showcase Completo */}
            {professionalDetails && (
              <div className="indi-section extra-info" style={{ textAlign: 'left' }}>
                <h3 className="indi-section-title">Detalles Profesionales</h3>
                <p className="indi-body-text mb-0" style={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6' // Mejor legibilidad
                }}>
                  {professionalDetails}
                </p>
                {/* 🤖 IA Professional Optimization Badge */}
                {professionalDetails.length > 400 && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(0, 246, 255, 0.1)',
                    border: '1px solid rgba(0, 246, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ opacity: 0.8 }}>
                      🎯 <strong>IA Profesional:</strong> Destaca logros específicos y métricas para mayor credibilidad
                    </span>
                    <br />
                    <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                      Optimización disponible en panel de edición
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 📍 LOCATION - Geographic Connection */}
            {location && (
              <div className="indi-section location-section" style={{ textAlign: 'left' }}>
                <h3 className="indi-section-title">Ubicación</h3>
                <p className="indi-body-text mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                  {location}
                </p>
                <Button 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-outline-secondary-custom"
                >
                  🗺️ Ver en Mapa
                </Button>
              </div>
            )}

            <div className="share-section text-center" style={{ 
              borderTop: `1px solid var(--card-text-color)33`,
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              <h3 style={{ fontSize: '1.1em', fontWeight: 600, opacity: 0.8, marginBottom: '20px' }}>COMPARTE ESTA TARJETA</h3>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <QrCodeDisplay value={qrCodeValue} size={140} level="H" />
              </div>
              <Button 
                href={`https://wa.me/?text=${encodeURIComponent(generateCreativeWhatsAppMessage(name, title, about))}`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  backgroundColor: '#25D366', 
                  borderColor: '#25D366', 
                  color: 'white', 
                  fontWeight: 500,
                  padding: '12px 24px',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Compartir por WhatsApp
              </Button>
            </div>
          </Stack>
        </Card.Body>
      </Card>
        </SmartParticles>
        </FloatingShapes>
      </div>
    </>
  );
}