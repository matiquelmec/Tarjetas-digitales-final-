'use client';

import React, { useState, useEffect } from 'react';
import IndiLogo from '@/components/ui/IndiLogo';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const loadingMessages = [
    "🆔 Conectando con servidores empresariales...",
    "💼 Procesando datos profesionales...", 
    "📊 Calibrando herramientas de presentación...",
    "✨ Preparando experiencia inmersiva...",
    "🚀 ¡Listo para impresionar!"
  ];

  useEffect(() => {
    const duration = 2000; // 2 segundos total
    const interval = 50; // Actualizar cada 50ms
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    let messageIndex = 0;
    
    const progressTimer = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));
      
      // Cambiar mensaje cada 20% de progreso
      const newMessageIndex = Math.floor(currentProgress / 20);
      if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
        messageIndex = newMessageIndex;
        setCurrentMessage(messageIndex);
      }
      
      if (currentProgress >= 100) {
        clearInterval(progressTimer);
        // Pequeña pausa antes de completar
        setTimeout(() => {
          onLoadingComplete();
        }, 300);
      }
    }, interval);

    return () => clearInterval(progressTimer);
  }, [onLoadingComplete, loadingMessages.length]);

  return (
    <div className="loading-screen">
      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(-45deg, #0f0c29, #24243e, #302b63, #1a1a2e);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
        }
        
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .loading-content {
          text-align: center;
          color: white;
          max-width: 90%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .loading-logo {
          margin-bottom: 2rem;
          animation: logoFloat 2s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(0, 246, 255, 0.8));
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        .loading-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          font-family: 'Montserrat', sans-serif;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #ffffff, #00f6ff, #ffffff);
          background-size: 200% 200%;
          animation: titleShimmer 2s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes titleShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .loading-message {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          font-weight: 600;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          min-height: 1.5rem;
          animation: messageSlide 0.5s ease-out;
        }
        
        @keyframes messageSlide {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 0.9; 
            transform: translateY(0px); 
          }
        }
        
        .progress-container {
          width: 100%;
          max-width: 400px;
          margin-bottom: 1rem;
        }
        
        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #00f6ff, #0072ff, #8e2de2);
          border-radius: 10px;
          transition: width 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: progressShine 1.5s ease-in-out infinite;
        }
        
        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .progress-text {
          text-align: center;
          margin-top: 0.5rem;
          font-size: 1rem;
          font-weight: 700;
          color: #00f6ff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        
        .loading-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          font-size: 1.5rem;
          animation: particleFloat 8s ease-in-out infinite;
          opacity: 0.6;
        }
        
        .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 30%; left: 80%; animation-delay: -1s; }
        .particle-3 { top: 60%; left: 15%; animation-delay: -2s; }
        .particle-4 { top: 70%; left: 70%; animation-delay: -3s; }
        .particle-5 { top: 40%; left: 50%; animation-delay: -4s; }
        .particle-6 { bottom: 20%; left: 30%; animation-delay: -5s; }
        .particle-7 { bottom: 30%; right: 20%; animation-delay: -6s; }
        
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3; 
          }
          25% { 
            transform: translateY(-20px) rotate(90deg); 
            opacity: 0.8; 
          }
          50% { 
            transform: translateY(-10px) rotate(180deg); 
            opacity: 0.6; 
          }
          75% { 
            transform: translateY(-25px) rotate(270deg); 
            opacity: 0.4; 
          }
        }
        
        .loading-subtitle {
          font-size: 1rem;
          opacity: 0.8;
          margin-top: 1rem;
          font-weight: 500;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .loading-screen {
            padding: 1rem;
            min-height: 100vh;
            min-height: 100dvh; /* Para móviles modernos */
          }
          
          .loading-content {
            max-width: 95%;
            padding: 1rem;
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .loading-logo {
            font-size: 3rem;
            margin-bottom: 1.5rem;
          }
          
          .loading-title {
            font-size: 1.8rem;
            line-height: 1.2;
            margin-bottom: 1rem;
          }
          
          .loading-message {
            font-size: 1rem;
            margin-bottom: 1.5rem;
            line-height: 1.4;
            padding: 0 1rem;
          }
          
          .progress-container {
            max-width: 280px;
            width: 90%;
          }
          
          .particle {
            font-size: 1rem;
            opacity: 0.6;
          }
          
          .progress-text {
            font-size: 0.9rem;
          }
        }
        
        /* Para móviles muy pequeños */
        @media (max-width: 480px) {
          .loading-logo {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .loading-title {
            font-size: 1.5rem;
          }
          
          .loading-message {
            font-size: 0.9rem;
            padding: 0 0.5rem;
          }
          
          .progress-container {
            max-width: 250px;
          }
        }
      `}</style>
      
      {/* Partículas de fondo */}
      <div className="loading-particles">
        <div className="particle particle-1">🆔</div>
        <div className="particle particle-2">💼</div>
        <div className="particle particle-3">📊</div>
        <div className="particle particle-4">✨</div>
        <div className="particle particle-5">🚀</div>
        <div className="particle particle-6">💫</div>
        <div className="particle particle-7">🌟</div>
      </div>
      
      <div className="loading-content">
        <div className="loading-logo">
          <IndiLogo
            variant="hero"
            size="lg"
            animated={true}
            interactive={false}
            showName={false}
            state="normal"
          />
        </div>
        
        <h1 className="loading-title">
          Indi Platform
        </h1>
        
        <div className="loading-message">
          {loadingMessages[currentMessage]}
        </div>
        
        <div className="progress-container">
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            {Math.round(progress)}%
          </div>
        </div>
        
        <div className="loading-subtitle">
          Tarjetas digitales • CVs profesionales • Presentaciones premium
        </div>
      </div>
    </div>
  );
}