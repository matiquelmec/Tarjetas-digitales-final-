'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface IndiLogoProps {
  variant?: 'navbar' | 'hero' | 'floating' | 'favicon';
  state?: 'normal' | 'thinking' | 'success' | 'error' | 'greeting';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  interactive?: boolean;
  message?: string;
  showName?: boolean;
  href?: string;
  className?: string;
}

const IndiLogo: React.FC<IndiLogoProps> = ({
  variant = 'navbar',
  state = 'normal',
  size = 'md',
  animated = true,
  interactive = true,
  message,
  showName = true,
  href = '/',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'indi-logo-sm';
      case 'md': return 'indi-logo-md';
      case 'lg': return 'indi-logo-lg';
      case 'xl': return 'indi-logo-xl';
      default: return 'indi-logo-md';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'navbar': return 'indi-navbar';
      case 'hero': return 'indi-hero';
      case 'floating': return 'indi-floating';
      case 'favicon': return 'indi-favicon';
      default: return 'indi-navbar';
    }
  };

  const getStateClasses = () => {
    switch (state) {
      case 'thinking': return 'indi-thinking';
      case 'success': return 'indi-success';
      case 'error': return 'indi-error';
      case 'greeting': return 'indi-greeting';
      default: return 'indi-normal';
    }
  };

  const logoClasses = `
    indi-logo 
    ${getSizeClasses()} 
    ${getVariantClasses()} 
    ${getStateClasses()}
    ${animated ? 'indi-animated' : ''}
    ${interactive ? 'indi-interactive' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const LogoContent = () => (
    <div className={logoClasses}>
      <div className="indi-container">
        <Image
          src="/logo.png"
          alt="Indi - Tu Embajador Intergaláctico"
          width={variant === 'navbar' ? 80 : variant === 'hero' ? 100 : 80}
          height={variant === 'navbar' ? 80 : variant === 'hero' ? 100 : 80}
          className="indi-image"
          priority={variant === 'navbar' || variant === 'hero'}
        />
        {showName && variant !== 'favicon' && (
          <span className="indi-name">indi</span>
        )}
      </div>
      {message && (
        <div className="indi-message">
          <span className="indi-bubble">{message}</span>
        </div>
      )}
      
      <style jsx>{`
        .indi-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          width: 100%;
        }
        
        .indi-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .indi-image {
          transition: all 0.3s ease;
          border-radius: 50%;
        }
        
        .indi-name {
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 2rem;
          background: linear-gradient(135deg, #00f6ff, #0072ff, #8e2de2);
          background-size: 200% 200%;
          animation: gradientShift 3s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: lowercase;
          letter-spacing: -1px;
          filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.3));
          text-align: center;
          margin-top: 0.25rem;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Size variants */
        .indi-logo-sm .indi-name { 
          font-size: 2rem; 
          filter: drop-shadow(0 0 6px rgba(0, 246, 255, 0.25));
        }
        .indi-logo-md .indi-name { 
          font-size: 2.5rem; 
          filter: drop-shadow(0 0 8px rgba(0, 246, 255, 0.3));
        }
        .indi-logo-lg .indi-name { 
          font-size: 3.2rem; 
          filter: drop-shadow(0 0 12px rgba(0, 246, 255, 0.4));
        }
        .indi-logo-xl .indi-name { 
          font-size: 4rem; 
          filter: drop-shadow(0 0 20px rgba(0, 246, 255, 0.6));
        }
        
        /* Interactive states */
        .indi-interactive:hover {
          transform: translateY(-4px) scale(1.05);
        }
        
        .indi-interactive:hover .indi-image {
          filter: drop-shadow(0 0 25px rgba(0, 246, 255, 0.8)) 
                  drop-shadow(0 0 40px rgba(142, 45, 226, 0.4));
          transform: rotate(5deg);
        }
        
        .indi-interactive:hover .indi-name {
          filter: drop-shadow(0 0 15px rgba(0, 246, 255, 0.6))
                  drop-shadow(0 0 25px rgba(142, 45, 226, 0.3));
          transform: scale(1.1);
        }
        
        /* Animated states */
        .indi-animated .indi-image {
          animation: indiIdle 3s ease-in-out infinite;
        }
        
        @keyframes indiIdle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        /* State animations */
        .indi-thinking .indi-image {
          animation: indiThinking 2s ease-in-out infinite;
        }
        
        @keyframes indiThinking {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05) rotate(2deg); }
          75% { transform: scale(1.05) rotate(-2deg); }
        }
        
        .indi-success .indi-image {
          animation: indiCelebrate 1s ease-out;
        }
        
        @keyframes indiCelebrate {
          0% { transform: scale(1); }
          25% { transform: scale(1.2) rotate(10deg); }
          50% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.15) rotate(5deg); }
          100% { transform: scale(1); }
        }
        
        .indi-greeting .indi-image {
          animation: indiWave 2s ease-in-out infinite;
        }
        
        @keyframes indiWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-10deg); }
        }
        
        /* Variant styles */
        .indi-navbar {
          cursor: pointer;
        }
        
        .indi-hero {
          justify-content: center;
          text-align: center;
        }
        
        .indi-floating {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          padding: 1rem;
          border: 1px solid rgba(0, 246, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        /* Message bubble */
        .indi-message {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 0.5rem;
          opacity: 0;
          animation: messageAppear 0.3s ease-out forwards;
        }
        
        .indi-bubble {
          background: rgba(0, 246, 255, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          position: relative;
        }
        
        .indi-bubble::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: rgba(0, 246, 255, 0.9);
        }
        
        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .indi-floating {
            bottom: 1rem;
            right: 1rem;
            padding: 0.75rem;
          }
          
          .indi-hero .indi-name {
            display: none;
          }
          
          .indi-navbar .indi-name {
            font-size: 1.5rem;
          }
          
          .indi-message {
            display: none; /* Ocultar mensajes en móvil */
          }
          
          .indi-interactive:hover {
            transform: translateY(-2px) scale(1.02);
          }
        }
        
        @media (max-width: 576px) {
          .indi-navbar .indi-name {
            font-size: 1.3rem;
          }
          
          .indi-logo {
            gap: 0.5rem;
          }
          
          .indi-interactive:hover {
            transform: translateY(-1px) scale(1.01);
          }
        }
        
        @media (max-width: 480px) {
          .indi-navbar .indi-name {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );

  if (href && interactive) {
    return (
      <Link href={href} className="text-decoration-none">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default IndiLogo;