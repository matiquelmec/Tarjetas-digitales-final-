'use client';

import { useEffect, useState } from 'react';

interface LazyAnimationsProps {
  children: React.ReactNode;
  delay?: number;
}

export default function LazyAnimations({ children, delay = 500 }: LazyAnimationsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) {
    return (
      <div style={{ 
        opacity: 0.7,
        filter: 'blur(1px)',
        transition: 'all 0.3s ease'
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      opacity: 1,
      filter: 'none',
      transition: 'all 0.5s ease'
    }}>
      {children}
    </div>
  );
}