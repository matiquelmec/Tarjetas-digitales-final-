'use client';

import { useCallback, useEffect, useState } from 'react';
import { UserProfile, SmartSuggestion, WizardUserData } from '@/types/wizard';

// Patrones para detectar tipo de usuario
const userPatterns = {
  entrepreneur: {
    keywords: ['CEO', 'Founder', 'emprendedor', 'startup', 'Director', 'Owner', 'Presidente'],
    weight: 1.0
  },
  employee: {
    keywords: ['Specialist', 'Analyst', 'Manager', 'Developer', 'Engineer', 'Coordinator', 'Assistant'],
    weight: 0.8
  },
  freelancer: {
    keywords: ['Freelance', 'Consultant', 'Designer', 'independiente', 'Freelancer', 'Consultor'],
    weight: 0.9
  },
  student: {
    keywords: ['Student', 'Estudiante', 'Graduate', 'Intern', 'Practicante', 'Tesista'],
    weight: 0.7
  }
};

// Base de sugerencias por tipo de usuario
const suggestionDatabase = {
  entrepreneur: [
    {
      id: 'meeting_button',
      type: 'cta_button' as const,
      title: 'Agrega botón "Agenda reunión"',
      description: 'Los emprendedores que lo usan reciben 3x más contactos de calidad',
      reason: 'Facilita a los clientes potenciales agendar reuniones contigo',
      action: 'add_meeting_button',
      priority: 'high' as const
    },
    {
      id: 'results_bio',
      type: 'bio_improvement' as const,
      title: 'Bio orientada a resultados',
      description: 'Las bios centradas en resultados convierten 40% más',
      reason: 'Los emprendedores deben comunicar el valor que aportan',
      action: 'improve_bio_results',
      priority: 'high' as const
    }
  ],
  
  employee: [
    {
      id: 'linkedin_connect',
      type: 'social_link' as const,
      title: 'Conecta tu LinkedIn',
      description: 'Empleados con LinkedIn reciben 60% más ofertas',
      reason: 'LinkedIn es clave para oportunidades profesionales',
      action: 'connect_linkedin',
      priority: 'high' as const
    },
    {
      id: 'skills_highlight',
      type: 'bio_improvement' as const,
      title: 'Destaca tus habilidades técnicas',
      description: 'Las bios con skills específicos atraen más recruiters',
      reason: 'Los empleadores buscan competencias específicas',
      action: 'add_skills_bio',
      priority: 'medium' as const
    }
  ],
  
  freelancer: [
    {
      id: 'portfolio_link',
      type: 'social_link' as const,
      title: 'Agrega enlace a tu portfolio',
      description: 'Freelancers con portfolio cierran 50% más proyectos',
      reason: 'Los clientes quieren ver tu trabajo anterior',
      action: 'add_portfolio',
      priority: 'high' as const
    },
    {
      id: 'specialization_bio',
      type: 'bio_improvement' as const,
      title: 'Especifica tu nicho',
      description: 'Freelancers especializados cobran 30% más',
      reason: 'La especialización comunica mayor expertise',
      action: 'add_specialization',
      priority: 'medium' as const
    }
  ],
  
  student: [
    {
      id: 'github_profile',
      type: 'social_link' as const,
      title: 'Conecta tu GitHub',
      description: 'Estudiantes con GitHub reciben más oportunidades',
      reason: 'Muestra tus proyectos y código a empleadores',
      action: 'connect_github',
      priority: 'medium' as const
    },
    {
      id: 'learning_bio',
      type: 'bio_improvement' as const,
      title: 'Menciona lo que estás aprendiendo',
      description: 'Demuestra tu crecimiento y motivación',
      reason: 'Los reclutadores valoran la actitud de aprendizaje',
      action: 'add_learning_bio',
      priority: 'medium' as const
    }
  ]
};

export const useSmartSuggestions = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  // Detectar tipo de usuario basado en el job title
  const detectUserProfile = useCallback((userData: WizardUserData): UserProfile | null => {
    if (!userData.jobTitle) return null;

    const jobTitle = userData.jobTitle.toLowerCase();
    const scores: Record<string, number> = {};

    // Calcular puntuación para cada tipo
    Object.entries(userPatterns).forEach(([type, pattern]) => {
      const matches = pattern.keywords.filter(keyword => 
        jobTitle.includes(keyword.toLowerCase())
      ).length;
      
      scores[type] = matches * pattern.weight;
    });

    // Encontrar el tipo con mayor puntuación
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
      return {
        type: 'general',
        confidence: 0,
        detectedFrom: []
      };
    }

    const detectedType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    const matchedKeywords = userPatterns[detectedType as keyof typeof userPatterns]?.keywords.filter(
      keyword => jobTitle.includes(keyword.toLowerCase())
    ) || [];

    return {
      type: detectedType as UserProfile['type'],
      confidence: Math.min(maxScore / 2, 1), // Normalizar confianza
      detectedFrom: matchedKeywords
    };
  }, []);

  // Generar sugerencias basadas en el perfil y datos del usuario
  const generateSuggestions = useCallback((profile: UserProfile, userData: WizardUserData): SmartSuggestion[] => {
    const baseSuggestions = suggestionDatabase[profile.type as keyof typeof suggestionDatabase] || [];
    
    return baseSuggestions.map((suggestion: any) => ({
      ...suggestion,
      applicable: checkApplicability(suggestion, userData)
    })).filter((suggestion: SmartSuggestion) => suggestion.applicable);
  }, [checkApplicability]);

  // Verificar si una sugerencia es aplicable
  const checkApplicability = useCallback((suggestion: SmartSuggestion, userData: WizardUserData): boolean => {
    switch (suggestion.id) {
      case 'linkedin_connect':
        return !userData.socialLinks?.linkedin;
      
      case 'portfolio_link':
        return !userData.socialLinks?.website;
      
      case 'meeting_button':
        return true; // Siempre aplicable para emprendedores
      
      case 'results_bio':
        return !userData.bio || userData.bio.length < 20;
      
      case 'skills_highlight':
        return !userData.bio || !userData.bio.toLowerCase().includes('especialista');
      
      case 'github_profile':
        return !userData.socialLinks?.website || !userData.socialLinks.website.includes('github');
      
      default:
        return true;
    }
  }, []);

  // Actualizar perfil y sugerencias cuando cambian los datos
  const updateProfileAndSuggestions = useCallback((userData: WizardUserData) => {
    const profile = detectUserProfile(userData);
    setUserProfile(profile);

    if (profile && profile.type !== 'general') {
      const newSuggestions = generateSuggestions(profile, userData);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [detectUserProfile, generateSuggestions]);

  // Aplicar una sugerencia
  const applySuggestion = useCallback((suggestionId: string, userData: WizardUserData): Partial<WizardUserData> => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return {};

    switch (suggestionId) {
      case 'results_bio':
        if (userProfile?.type === 'entrepreneur') {
          return {
            bio: `Ayudo a empresas a ${userData.jobTitle.toLowerCase().includes('marketing') ? 'crecer con marketing digital que convierte' : 'resolver problemas complejos y alcanzar sus objetivos'}`
          };
        }
        break;

      case 'skills_highlight':
        return {
          bio: `${userData.jobTitle} especializado en tecnologías modernas y soluciones innovadoras`
        };

      case 'learning_bio':
        return {
          bio: `Estudiante apasionado por ${userData.jobTitle.toLowerCase()}, siempre aprendiendo y creciendo profesionalmente`
        };

      case 'specialization_bio':
        return {
          bio: `${userData.jobTitle} especializado en proyectos de alta calidad y resultados excepcionales`
        };

      default:
        return {};
    }

    return {};
  }, [suggestions, userProfile]);

  // Obtener sugerencias por prioridad
  const getSuggestionsByPriority = useCallback((priority: 'high' | 'medium' | 'low') => {
    return suggestions.filter(s => s.priority === priority);
  }, [suggestions]);

  return {
    userProfile,
    suggestions,
    updateProfileAndSuggestions,
    applySuggestion,
    getSuggestionsByPriority,
    
    // Utilidades
    hasHighPrioritySuggestions: suggestions.some(s => s.priority === 'high'),
    hasSuggestions: suggestions.length > 0,
    profileConfidence: userProfile?.confidence || 0
  };
};