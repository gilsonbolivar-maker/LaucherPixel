import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  Terminal,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  RotateCw,
  Settings,
  ChevronDown,
  X,
  Play,
  Pause,
  SkipForward,
  MessageSquare,
  Sparkles,
  GitBranch,
  CheckCircle2,
  Cpu,
  Radio,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface QuickSettingsShadeProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  onDismissNotification: (id: string) => void;
}

export const QuickSettingsShade: React.FC<QuickSettingsShadeProps> = ({
  isOpen,
  onClose,
  accentColor,
  isDarkMode,
  onToggleDarkMode,
  onOpenSettings,
  notifications,
  onClearNotifications,
  onDismissNotification,
}) => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [adbWireless, setAdbWireless] = useState(true);
  const [devFocus, setDevFocus] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [brightness, setBrightness] = useState(85);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="quick-settings-shade"
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="absolute inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl text-white flex flex-col justify-between overflow-y-auto select-none"
      >
        <div className="p-4 pt-8 space-y-4">
          {/* Top Bar: Time, Battery, Power & Settings */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
            <div>
              <p className="text-2xl font-bold tracking-tight font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </p>
              <p className="text-xs text-zinc-400 font-mono">
                DevOS 15 • Build 2026.4
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                id="shade-btn-settings"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                title="Configurações"
              >
                <Settings className="w-5 h-5 text-zinc-300" />
              </button>
              <button
                id="shade-btn-close"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                title="Fechar"
              >
                <ChevronDown className="w-5 h-5 text-zinc-300" />
              </button>
            </div>
          </div>

          {/* Quick Settings 2-Column Material You Tiles */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Wi-Fi / Localhost Tile */}
            <button
              id="tile-wifi"
              onClick={() => setWifiEnabled(!wifiEnabled)}
              className={`flex items-center space-x-3 p-3 rounded-2xl transition-all ${
                wifiEnabled
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              <Wifi className="w-5 h-5 flex-shrink-0" />
              <div className="text-left leading-tight truncate">
                <p className="text-xs font-semibold">Wi-Fi DevNet</p>
                <p className="text-[10px] opacity-80 truncate">{wifiEnabled ? '192.168.1.104' : 'Desativado'}</p>
              </div>
            </button>

            {/* ADB Wireless Debugging Tile */}
            <button
              id="tile-adb"
              onClick={() => setAdbWireless(!adbWireless)}
              className={`flex items-center space-x-3 p-3 rounded-2xl transition-all ${
                adbWireless
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              <Terminal className="w-5 h-5 flex-shrink-0" />
              <div className="text-left leading-tight truncate">
                <p className="text-xs font-semibold">ADB Wireless</p>
                <p className="text-[10px] opacity-80 truncate">{adbWireless ? 'tcp:5555 Ativo' : 'Desligado'}</p>
              </div>
            </button>

            {/* Dev Focus Tile */}
            <button
              id="tile-devfocus"
              onClick={() => setDevFocus(!devFocus)}
              className={`flex items-center space-x-3 p-3 rounded-2xl transition-all ${
                devFocus
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              <Radio className="w-5 h-5 flex-shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Modo Foco Dev</p>
                <p className="text-[10px] opacity-80">{devFocus ? 'Silenciando alertas' : 'Normal'}</p>
              </div>
            </button>

            {/* Dark Mode Tile */}
            <button
              id="tile-darkmode"
              onClick={onToggleDarkMode}
              className={`flex items-center space-x-3 p-3 rounded-2xl transition-all ${
                isDarkMode
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              {isDarkMode ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Sun className="w-5 h-5 flex-shrink-0" />}
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Tema Escuro</p>
                <p className="text-[10px] opacity-80">{isDarkMode ? 'Ativado' : 'Desativado'}</p>
              </div>
            </button>

            {/* Sound / Mute */}
            <button
              id="tile-sound"
              onClick={() => setSoundMuted(!soundMuted)}
              className={`flex items-center space-x-3 p-3 rounded-2xl transition-all ${
                !soundMuted
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              {!soundMuted ? <Volume2 className="w-5 h-5 flex-shrink-0" /> : <VolumeX className="w-5 h-5 flex-shrink-0" />}
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Som Háptico</p>
                <p className="text-[10px] opacity-80">{soundMuted ? 'Mudo' : 'Sintetizador ON'}</p>
              </div>
            </button>

            {/* Auto Rotate */}
            <button
              id="tile-autorotate"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center space-x-3 p-3 rounded-2xl transition-all ${
                autoRotate
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
              }`}
            >
              <RotateCw className="w-5 h-5 flex-shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-xs font-semibold">Rotação</p>
                <p className="text-[10px] opacity-80">{autoRotate ? 'Automática' : 'Retrato'}</p>
              </div>
            </button>
          </div>

          {/* Brightness Slider */}
          <div className="bg-zinc-900/90 rounded-2xl p-3.5 flex items-center space-x-3 border border-zinc-800">
            <Sun className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <input
              id="brightness-slider"
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-xs font-mono text-zinc-400 w-8 text-right">{brightness}%</span>
          </div>

          {/* Media Player Tile */}
          <div className="bg-zinc-900/95 border border-zinc-800 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center shadow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Coding Soundtrack (Lo-Fi)</p>
                <p className="text-[11px] text-zinc-400">Dev Beats • 128 BPM Synth</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                id="media-play-pause"
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-colors"
              >
                {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                id="media-next"
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase font-mono">
                Notificações ({notifications.length})
              </span>
              {notifications.length > 0 && (
                <button
                  id="btn-clear-notifications"
                  onClick={onClearNotifications}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs font-mono">
                Nenhum evento ou notificação pendente
              </div>
            ) : (
              <div className="space-y-2 font-mono">
                {notifications.map((n) => {
                  const isGit = n.type === 'git';
                  const isCi = n.type === 'ci';
                  const isAdb = n.type === 'adb';

                  return (
                    <div
                      key={n.id}
                      className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3 flex items-start justify-between space-x-3 shadow-sm"
                    >
                      <div className="flex items-start space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                            isGit
                              ? 'bg-pink-500/20 text-pink-400'
                              : isCi
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isAdb
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}
                        >
                          {isGit ? (
                            <GitBranch className="w-3.5 h-3.5" />
                          ) : isCi ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isAdb ? (
                            <Terminal className="w-3.5 h-3.5" />
                          ) : (
                            <MessageSquare className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-zinc-200">{n.appName}</span>
                            <span className="text-[10px] text-zinc-500">• {n.time}</span>
                          </div>
                          <p className="text-xs font-medium text-white">{n.title}</p>
                          <p className="text-xs text-zinc-400 leading-snug font-sans">{n.body}</p>
                        </div>
                      </div>
                      <button
                        id={`dismiss-notif-${n.id}`}
                        onClick={() => onDismissNotification(n.id)}
                        className="text-zinc-500 hover:text-zinc-300 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Swipe Handle */}
        <div
          onClick={onClose}
          className="w-full py-3 flex flex-col items-center justify-center cursor-pointer border-t border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
        >
          <div className="w-12 h-1 bg-zinc-600 rounded-full" />
          <span className="text-[10px] text-zinc-500 mt-1">Deslize para cima para fechar</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

