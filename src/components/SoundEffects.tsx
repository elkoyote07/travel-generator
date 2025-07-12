'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundEffectsProps {
  onPlay?: () => void;
}

export default function SoundEffects({ onPlay }: SoundEffectsProps) {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createSoundEffect = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      if (isMuted) return;
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    const playPlaneSound = () => {
      if (isMuted) return;
      
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          createSoundEffect(800 - i * 50, 0.1, 'sine');
        }, i * 100);
      }
    };

    const playClickSound = () => {
      if (isMuted) return;
      createSoundEffect(600, 0.05, 'square');
    };

    const playSuccessSound = () => {
      if (isMuted) return;
      
      const notes = [523, 659, 784, 1047];
      notes.forEach((note, index) => {
        setTimeout(() => {
          createSoundEffect(note, 0.3, 'sine');
        }, index * 150);
      });
    };

    (window as any).playPlaneSound = playPlaneSound;
    (window as any).playClickSound = playClickSound;
    (window as any).playSuccessSound = playSuccessSound;

    return () => {
      audioContext.close();
    };
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
      title={isMuted ? "Enable sound effects" : "Disable sound effects"}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5 text-gray-600" />
      ) : (
        <Volume2 className="h-5 w-5 text-blue-600" />
      )}
    </button>
  );
}

export const useSoundEffects = () => {
  const playPlaneSound = () => {
    if ((window as any).playPlaneSound) {
      (window as any).playPlaneSound();
    }
  };

  const playClickSound = () => {
    if ((window as any).playClickSound) {
      (window as any).playClickSound();
    }
  };

  const playSuccessSound = () => {
    if ((window as any).playSuccessSound) {
      (window as any).playSuccessSound();
    }
  };

  return { playPlaneSound, playClickSound, playSuccessSound };
}; 