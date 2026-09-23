import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, BatteryCharging, MessageSquare, ShieldCheck } from 'lucide-react';

interface StatusBarProps {
  onToggleQuickSettings: () => void;
  textColor?: string;
  isDarkTheme?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  onToggleQuickSettings,
  textColor = 'text-white',
}) => {
  const [time, setTime] = useState<string>('');
  const [batteryLevel] = useState<number>(88);
  const [isCharging] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="android-status-bar"
      onClick={onToggleQuickSettings}
      className={`w-full h-8 px-5 flex items-center justify-between select-none cursor-pointer z-40 transition-colors ${textColor}`}
      title="Toque para abrir as Configurações Rápidas"
    >
      {/* Left: Time & notification icons */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold tracking-wide">{time || '12:00'}</span>
        <div className="flex items-center space-x-1.5 opacity-80 pl-1">
          <MessageSquare className="w-3 h-3" />
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
        </div>
      </div>

      {/* Center: Camera punch hole simulation for mobile container */}
      <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner border border-zinc-800" />

      {/* Right: Connectivity & Battery */}
      <div className="flex items-center space-x-2 text-xs font-medium">
        <Wifi className="w-3.5 h-3.5 opacity-90" />
        <div className="flex items-center">
          <span className="text-[9px] font-bold mr-0.5">5G</span>
          <Signal className="w-3.5 h-3.5 opacity-90" />
        </div>
        <div className="flex items-center space-x-1 pl-1">
          <span className="text-[11px] font-semibold">{batteryLevel}%</span>
          {isCharging ? (
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          ) : (
            <Battery className="w-4 h-4 opacity-90" />
          )}
        </div>
      </div>
    </header>
  );
};
