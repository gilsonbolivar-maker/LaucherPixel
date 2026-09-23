import React, { useState } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallGuideModal } from './InstallGuideModal';
import { playHapticClick } from '../utils/audio';

interface PWAInstallButtonProps {
  variant?: 'toolbar' | 'button' | 'compact';
  className?: string;
  soundEnabled?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'toolbar',
  className = '',
  soundEnabled = true,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    playHapticClick(soundEnabled);
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled && variant !== 'toolbar') {
    return (
      <div className={`flex items-center space-x-1.5 text-emerald-400 font-mono text-xs ${className}`}>
        <Check className="w-3.5 h-3.5" />
        <span>Instalado no Celular</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#23083B] border border-[#F5B942]/60 text-[#F5B942] text-[10px] font-mono hover:bg-[#320c54] transition-colors cursor-pointer ${className}`}
          title="Instalar no celular"
        >
          <Smartphone className="w-3 h-3" />
          <span>Instalar</span>
        </button>
        <InstallGuideModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          soundEnabled={soundEnabled}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`px-3 py-1.5 rounded-full bg-gradient-to-r from-[#23083B] via-[#350d54] to-[#23083B] border border-[#F5B942]/80 text-[#F5B942] hover:brightness-110 flex items-center space-x-1.5 transition-all font-mono text-xs font-semibold shadow-[0_0_12px_rgba(245,185,66,0.25)] cursor-pointer active:scale-95 ${className}`}
        title="Como instalar no celular (PWA e APK)"
      >
        <Download className="w-3.5 h-3.5 text-[#F5B942]" />
        <span>Instalar no Celular</span>
      </button>

      <InstallGuideModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        soundEnabled={soundEnabled}
      />
    </>
  );
};
