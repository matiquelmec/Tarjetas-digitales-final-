'use client';

// Hook simplificado para manejo de estado de Indi - Embajador Intergaláctico
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type IndiState = 'normal' | 'thinking' | 'success' | 'error' | 'greeting' | 'celebrating';

interface IndiContextType {
  currentState: IndiState;
  message: string | null;
  isVisible: boolean;
  
  // Actions
  setState: (state: IndiState) => void;
  setMessage: (message: string, duration?: number) => void;
  clearMessage: () => void;
  show: () => void;
  hide: () => void;
  
  // Contextual actions
  greetUser: (userName?: string) => void;
  celebrate: (achievement: string) => void;
  think: () => void;
  showError: (errorMessage: string) => void;
  showSuccess: (successMessage: string) => void;
}

const IndiContext = createContext<IndiContextType | undefined>(undefined);

// Provider para el contexto de Indi
export const IndiProvider = ({ children }: { children: ReactNode }) => {
  const [currentState, setCurrentStateRaw] = useState<IndiState>('normal');
  const [message, setMessageRaw] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const setState = useCallback((state: IndiState) => {
    setCurrentStateRaw(state);
  }, []);

  const setMessage = useCallback((msg: string, duration = 3000) => {
    setMessageRaw(msg);
    if (duration > 0) {
      setTimeout(() => {
        setMessageRaw(null);
      }, duration);
    }
  }, []);

  const clearMessage = useCallback(() => {
    setMessageRaw(null);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const greetUser = useCallback((userName?: string) => {
    const greeting = userName ? `¡Hola ${userName}! 👋` : '¡Hola terrícola! 👋';
    setCurrentStateRaw('greeting');
    setMessageRaw(greeting);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 3000);
  }, []);

  const celebrate = useCallback((achievement: string) => {
    setCurrentStateRaw('celebrating');
    setMessageRaw(`🎉 ${achievement}`);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 2000);
  }, []);

  const think = useCallback(() => {
    setCurrentStateRaw('thinking');
    setMessageRaw('Analizando datos intergalácticos...');
  }, []);

  const showError = useCallback((errorMessage: string) => {
    setCurrentStateRaw('error');
    setMessageRaw(`¡Ops! ${errorMessage}`);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 4000);
  }, []);

  const showSuccess = useCallback((successMessage: string) => {
    setCurrentStateRaw('success');
    setMessageRaw(`✨ ${successMessage}`);
    setTimeout(() => {
      setCurrentStateRaw('normal');
      setMessageRaw(null);
    }, 3000);
  }, []);

  const value: IndiContextType = {
    currentState,
    message,
    isVisible,
    setState,
    setMessage,
    clearMessage,
    show,
    hide,
    greetUser,
    celebrate,
    think,
    showError,
    showSuccess,
  };

  return (
    <IndiContext.Provider value={value}>
      {children}
    </IndiContext.Provider>
  );
};

// Hook básico para usar Indi en componentes
export const useIndi = () => {
  const context = useContext(IndiContext);
  
  if (!context) {
    throw new Error('useIndi debe ser usado dentro de un IndiProvider');
  }
  
  return context;
};

export default useIndi;