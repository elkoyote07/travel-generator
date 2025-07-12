'use client';

import { useEffect, useRef, useState } from 'react';
import { Plane } from 'lucide-react';

interface EntryAnimationGSAPProps {
  children: React.ReactNode;
}

export default function EntryAnimationGSAP({ children }: EntryAnimationGSAPProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const planeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem('hasSeenEntryAnimation');
    
    if (hasSeenAnimation) {
      setHasAnimated(true);
      return;
    }

    const animateWithoutGSAP = () => {
      if (!planeRef.current) return;

      const plane = planeRef.current;
      
      plane.style.opacity = '0';
      plane.style.transform = 'translateY(100vh) rotate(45deg) scale(0.5)';
      plane.style.transition = 'none';
      
      plane.offsetHeight;
      
      plane.style.transition = 'all 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      plane.style.opacity = '0.8';
      plane.style.transform = 'translateY(-15vh) rotate(45deg) scale(1)';
      
      setTimeout(() => {
        plane.style.transition = 'all 2s cubic-bezier(0.55, 0.055, 0.675, 0.19)';
        plane.style.opacity = '0';
        plane.style.transform = 'translateY(-60vh) rotate(45deg) scale(0.6)';
      }, 2500);
      
      setTimeout(() => {
        setHasAnimated(true);
        localStorage.setItem('hasSeenEntryAnimation', 'true');
      }, 4500);
    };

    const useGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        
        if (!planeRef.current) return;

        const tl = gsap.timeline({
          onComplete: () => {
            setHasAnimated(true);
            localStorage.setItem('hasSeenEntryAnimation', 'true');
          }
        });

        gsap.set(planeRef.current, {
          opacity: 0,
          y: '100vh',
          rotation: 45,
          scale: 0.5
        });

        tl.to(planeRef.current, {
          opacity: 0.8,
          y: '-15vh',
          rotation: 45,
          scale: 1,
          duration: 3,
          ease: 'power2.out'
        })
        .to(planeRef.current, {
          opacity: 0,
          y: '-60vh',
          rotation: 45,
          scale: 0.6,
          duration: 2,
          ease: 'power2.in'
        }, '-=1');

        if (particlesRef.current) {
          gsap.to(particlesRef.current.children, {
            opacity: 0,
            scale: 0,
            duration: 0,
            ease: 'power2.out'
          });
          
          gsap.to(particlesRef.current.children, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power2.out',
            repeat: -1,
            yoyo: true
          });
        }

        if (trailRef.current) {
          gsap.to(trailRef.current, {
            scaleX: 0,
            opacity: 0,
            duration: 0,
            ease: 'power2.out'
          });
          
          gsap.to(trailRef.current, {
            scaleX: 1,
            opacity: 0.6,
            duration: 2,
            ease: 'power2.out',
            repeat: -1,
            yoyo: true
          });
        }

      } catch (error) {
        console.log('GSAP not available, using CSS animations');
        animateWithoutGSAP();
      }
    };

    const timer = setTimeout(useGSAP, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (hasAnimated) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Contenido de fondo (translúcido) */}
      <div className="opacity-25 pointer-events-none">
        {children}
      </div>
      
      {/* Avión animado */}
      <div
        ref={planeRef}
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          filter: 'blur(0.3px)',
        }}
      >
        <div className="relative">
          {/* Avión principal */}
          <Plane 
            className="w-28 h-28 text-blue-500 drop-shadow-xl"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(59, 130, 246, 0.4))',
            }}
          />
          
          {/* Efecto de estela */}
          <div 
            ref={trailRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-40 h-1 bg-gradient-to-r from-blue-400/70 via-blue-300/50 to-transparent rounded-full"></div>
          </div>
          
          {/* Partículas de estela */}
          <div 
            ref={particlesRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
                style={{
                  left: `${-30 + i * 6}px`,
                  top: `${-3 + (i % 3) * 3}px`,
                }}
              />
            ))}
          </div>
          
          {/* Efecto de ondas */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-32 h-32 border-2 border-blue-300/30 rounded-full animate-ping"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay de carga con efecto de desvanecimiento */}
      <div className="fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-40">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Preparing your journey...</p>
          <p className="text-gray-500 text-sm mt-2">Loading amazing destinations</p>
        </div>
      </div>
    </div>
  );
} 