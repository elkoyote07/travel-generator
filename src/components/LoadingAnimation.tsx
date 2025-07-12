'use client';

import { useState, useEffect } from 'react';
import { Plane, Search, Globe, Zap } from 'lucide-react';

interface LoadingAnimationProps {
  isVisible: boolean;
}

export default function LoadingAnimation({ isVisible }: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  const steps = [
    { icon: Search, text: 'Buscando destinos increíbles' },
    { icon: Plane, text: 'Calculando rutas de vuelo' },
    { icon: Globe, text: 'Consultando precios en tiempo real' },
    { icon: Zap, text: '¡Casi listo!' }
  ];

  useEffect(() => {
    if (!isVisible) return;

    // Animar los puntos
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Cambiar de paso
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  }, [isVisible, steps.length]);

  if (!isVisible) return null;

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {/* Animación del avión */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 animate-bounce">
              <Plane className="w-full h-full text-blue-500 transform rotate-45" />
            </div>
            <div className="absolute inset-0 animate-pulse">
              <div className="w-full h-full bg-blue-200 rounded-full opacity-30"></div>
            </div>
          </div>
          
          {/* Línea de vuelo animada */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
        </div>

        {/* Texto del paso actual */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <CurrentIcon className="h-6 w-6 text-blue-600 mr-2 animate-pulse" />
            <span className="text-lg font-semibold text-gray-800">
              {steps[currentStep].text}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {dots}
          </div>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              animation: 'pulse 2s infinite'
            }}
          ></div>
        </div>

        {/* Mensajes divertidos */}
        <div className="text-sm text-gray-600">
          {currentStep === 0 && "🌍 Explorando el mundo..."}
          {currentStep === 1 && "✈️ Encontrando las mejores rutas..."}
          {currentStep === 2 && "💰 Buscando las mejores ofertas..."}
          {currentStep === 3 && "🎉 ¡Preparando tu aventura!"}
        </div>

        {/* Iconos flotantes */}
        <div className="absolute top-4 left-4 animate-bounce">
          <Globe className="h-4 w-4 text-green-500" />
        </div>
        <div className="absolute top-4 right-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <Zap className="h-4 w-4 text-yellow-500" />
        </div>
        <div className="absolute bottom-4 left-4 animate-bounce" style={{ animationDelay: '1s' }}>
          <Search className="h-4 w-4 text-purple-500" />
        </div>
        <div className="absolute bottom-4 right-4 animate-bounce" style={{ animationDelay: '1.5s' }}>
          <Plane className="h-4 w-4 text-blue-500" />
        </div>
      </div>
    </div>
  );
} 