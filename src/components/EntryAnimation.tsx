'use client';

import { useEffect, useRef, useState } from 'react';
import { Plane } from 'lucide-react';

interface EntryAnimationProps {
  children: React.ReactNode;
}

export default function EntryAnimation({ children }: EntryAnimationProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const planeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem('hasSeenEntryAnimation');
    
    if (hasSeenAnimation) {
      setHasAnimated(true);
      return;
    }

    const animatePlane = () => {
      if (!planeRef.current) return;

      const plane = planeRef.current;
      
      plane.style.opacity = '0';
      plane.style.transform = 'translateY(100vh) rotate(45deg)';
      plane.style.transition = 'none';
      
      plane.offsetHeight;
      
      plane.style.transition = 'all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      plane.style.opacity = '0.7';
      plane.style.transform = 'translateY(-20vh) rotate(45deg)';
      
      setTimeout(() => {
        plane.style.transition = 'all 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)';
        plane.style.opacity = '0';
        plane.style.transform = 'translateY(-50vh) rotate(45deg) scale(0.8)';
      }, 2000);
      
      setTimeout(() => {
        setHasAnimated(true);
        localStorage.setItem('hasSeenEntryAnimation', 'true');
      }, 3500);
    };

    const timer = setTimeout(animatePlane, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (hasAnimated) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Contenido de fondo (translúcido) */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
      
      {/* Avión animado */}
      <div
        ref={planeRef}
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          filter: 'blur(0.5px)',
        }}
      >
        <div className="relative">
          {/* Avión principal */}
          <Plane 
            className="w-24 h-24 text-blue-500 drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            }}
          />
          
          {/* Efecto de estela */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400/60 to-transparent rounded-full animate-pulse"></div>
          </div>
          
          {/* Partículas de estela */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-300 rounded-full animate-ping"
                style={{
                  left: `${-20 + i * 8}px`,
                  top: `${-2 + (i % 2) * 4}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay de carga */}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Preparing your journey...</p>
        </div>
      </div>
    </div>
  );
} 