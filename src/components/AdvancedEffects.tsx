'use client';

import { useEffect, useRef, useState } from 'react';

interface AdvancedEffectsProps {
  children: React.ReactNode;
}

export default function AdvancedEffects({ children }: AdvancedEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Contenido principal con animaciones CSS */}
      <div
        className={`transition-all duration-800 ease-out ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {children}
      </div>

      {/* Efectos de partículas flotantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AnimatedButton({ 
  children, 
  onClick, 
  className = "",
  disabled = false 
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95 ${className}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        boxShadow: isPressed 
          ? '0 2px 4px rgba(59, 130, 246, 0.3)' 
          : '0 4px 8px rgba(59, 130, 246, 0.3)',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      }}
    >
      {children}
    </button>
  );
}

export function AnimatedCard({ 
  children, 
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-600 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0, 0, 0, 0.1)' 
          : '0 10px 25px rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </div>
  );
} 