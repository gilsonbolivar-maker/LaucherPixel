import React from 'react';
import { ChevronLeft, Circle, Square } from 'lucide-react';
import { NavStyle } from '../types';
import { playHapticClick } from '../utils/audio';

interface NavigationBarProps {
  navStyle: NavStyle;
  onHome: () => void;
  onBack: () => void;
  onRecents: () => void;
  soundEnabled: boolean;
  isAppOpen: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  navStyle,
  onHome,
  onBack,
  onRecents,
  soundEnabled,
  isAppOpen,
}) => {
  const triggerHaptic = (action: () => void) => {
    playHapticClick(soundEnabled);
    action();
  };

  return (
    <nav
      id="android-nav-bar"
      className="w-full h-11 flex items-center justify-center z-40 select-none bg-black/40 backdrop-blur-md"
    >
      {navStyle === 'gestures' ? (
        // Android Gesture Navigation Pill
        <div className="w-full h-full flex items-center justify-center cursor-pointer group px-12">
          <div
            id="gesture-pill"
            onClick={() => triggerHaptic(onHome)}
            onContextMenu={(e) => {
              e.preventDefault();
              triggerHaptic(onRecents);
            }}
            className="w-32 h-1.5 bg-white/80 group-hover:bg-white group-active:scale-x-90 rounded-full transition-all duration-150 shadow"
            title="Toque para Home • Segure para Recentes"
          />
        </div>
      ) : (
        // Traditional 3-Button Navigation
        <div className="w-full h-full flex items-center justify-around px-8">
          {/* Back Button */}
          <button
            id="nav-btn-back"
            onClick={() => triggerHaptic(onBack)}
            className="p-2 text-white/80 hover:text-white active:scale-75 transition-all"
            title="Voltar"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Home Button */}
          <button
            id="nav-btn-home"
            onClick={() => triggerHaptic(onHome)}
            className="p-2 text-white/80 hover:text-white active:scale-75 transition-all"
            title="Início"
          >
            <Circle className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Recents Button */}
          <button
            id="nav-btn-recents"
            onClick={() => triggerHaptic(onRecents)}
            className="p-2 text-white/80 hover:text-white active:scale-75 transition-all"
            title="Recentes"
          >
            <Square className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </nav>
  );
};
