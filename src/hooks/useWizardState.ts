'use client';

import { useState, useCallback, useEffect } from 'react';
import { WizardState, WizardUserData, UserProfile, SmartSuggestion } from '@/types/wizard';

const initialUserData: WizardUserData = {
  fullName: '',
  jobTitle: '',
  phoneNumber: '',
  email: '',
  selectedTheme: 'stellar',
  bio: '',
  socialLinks: {}
};

const initialState: WizardState = {
  currentStep: 0,
  userData: initialUserData,
  userProfile: null,
  suggestions: [],
  isLoading: false,
  errors: {},
  progress: 0
};

export const useWizardState = () => {
  const [state, setState] = useState<WizardState>(initialState);

  // Actualizar datos del usuario
  const updateUserData = useCallback((updates: Partial<WizardUserData>) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, ...updates },
      errors: {} // Limpiar errores cuando el usuario hace cambios
    }));
  }, []);

  // Cambiar paso
  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
      progress: ((step + 1) / 3) * 100 // 3 pasos total
    }));
  }, []);

  // Establecer perfil de usuario
  const setUserProfile = useCallback((profile: UserProfile) => {
    setState(prev => ({
      ...prev,
      userProfile: profile
    }));
  }, []);

  // Agregar sugerencias
  const setSuggestions = useCallback((suggestions: SmartSuggestion[]) => {
    setState(prev => ({
      ...prev,
      suggestions
    }));
  }, []);

  // Establecer estado de carga
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading
    }));
  }, []);

  // Establecer errores
  const setErrors = useCallback((errors: Record<string, string>) => {
    setState(prev => ({
      ...prev,
      errors
    }));
  }, []);

  // Validar paso actual
  const validateCurrentStep = useCallback(() => {
    const { currentStep, userData } = state;
    const errors: Record<string, string> = {};

    if (currentStep === 0) {
      // Validar paso 1: Información básica
      if (!userData.fullName.trim()) {
        errors.fullName = 'Nombre es requerido';
      }
      if (!userData.jobTitle.trim()) {
        errors.jobTitle = 'Profesión es requerida';
      }
      if (!userData.phoneNumber.trim()) {
        errors.phoneNumber = 'Teléfono es requerido';
      } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(userData.phoneNumber)) {
        errors.phoneNumber = 'Formato de teléfono inválido';
      }
      if (!userData.email.trim()) {
        errors.email = 'Email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.email = 'Formato de email inválido';
      }
    }

    if (currentStep === 1) {
      // Validar paso 2: Personalización (opcional, pero verificar formato)
      if (userData.socialLinks?.linkedin && !/^https?:\/\/(www\.)?linkedin\.com/.test(userData.socialLinks.linkedin)) {
        errors.linkedin = 'URL de LinkedIn inválida';
      }
      if (userData.socialLinks?.website && !/^https?:\/\//.test(userData.socialLinks.website)) {
        // Auto-corregir agregando https://
        updateUserData({
          socialLinks: {
            ...userData.socialLinks,
            website: `https://${userData.socialLinks.website}`
          }
        });
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [state, setErrors, updateUserData]);

  // Navegar al siguiente paso
  const nextStep = useCallback(() => {
    if (validateCurrentStep() && state.currentStep < 2) {
      setCurrentStep(state.currentStep + 1);
      return true;
    }
    return false;
  }, [state.currentStep, validateCurrentStep, setCurrentStep]);

  // Navegar al paso anterior
  const prevStep = useCallback(() => {
    if (state.currentStep > 0) {
      setCurrentStep(state.currentStep - 1);
      return true;
    }
    return false;
  }, [state.currentStep, setCurrentStep]);

  // Reiniciar wizard
  const resetWizard = useCallback(() => {
    setState(initialState);
  }, []);

  // Cargar datos desde sesión (si el usuario ya tiene algunos datos)
  const loadFromSession = useCallback((sessionData: any) => {
    if (sessionData?.user) {
      updateUserData({
        fullName: sessionData.user.name || '',
        email: sessionData.user.email || ''
      });
    }
  }, [updateUserData]);

  // Auto-guardar datos en localStorage para recuperación
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.userData.fullName || state.userData.email) {
        localStorage.setItem('wizard-draft', JSON.stringify(state.userData));
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state.userData]);

  // Cargar draft al inicializar
  useEffect(() => {
    const draft = localStorage.getItem('wizard-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        updateUserData(draftData);
      } catch (error) {
        console.error('Error loading wizard draft:', error);
      }
    }
  }, [updateUserData]);

  return {
    // Estado
    ...state,
    
    // Acciones
    updateUserData,
    setCurrentStep,
    setUserProfile,
    setSuggestions,
    setLoading,
    setErrors,
    
    // Navegación
    nextStep,
    prevStep,
    
    // Utilidades
    validateCurrentStep,
    resetWizard,
    loadFromSession,
    
    // Estado derivado
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === 2,
    canProceed: Object.keys(state.errors).length === 0 && !state.isLoading
  };
};