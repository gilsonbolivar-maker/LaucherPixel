import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Sparkles } from 'lucide-react';
import { AppItem, LauncherSettings } from '../types';
import { AppIcon } from './AppIcon';
import { PixelNexoLogo } from './PixelNexoLogo';
import { playHapticClick } from '../utils/audio';
import { NativeApp, launchNativeApp, openNativeAppInfo } from '../native';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  nativeApps?: NativeApp[];
  settings: LauncherSettings;
  onLaunchApp: (app: AppItem) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  apps,
  nativeApps = [],
  settings,
  onLaunchApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNativeApps = nativeApps.filter((app) =>
    app.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group apps alphabetically
  const groupedApps: Record<string, AppItem[]> = {};
  filteredApps.forEach((app) => {
    const letter = app.name.charAt(0).toUpperCase();
    if (!groupedApps[letter]) {
      groupedApps[letter] = [];
    }
    groupedApps[letter].push(app);
  });

  const sortedLetters = Object.keys(groupedApps).sort();

  return (
    <AnimatePresence>
      <motion.div
        id="android-app-drawer"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="absolute inset-0 z-40 bg-[#160424]/95 backdrop-blur-3xl text-white flex flex-col justify-between overflow-hidden select-none"
      >
        {/* Top Search Bar */}
        <div className="p-4 pt-10 border-b border-[#8022B8]/30 space-y-3">
          <div className="flex items-center justify-between px-1">
            <PixelNexoLogo variant="badge" size="sm" />
            <span className="text-[11px] font-mono text-[#F5B942]/90">Gaveta de Apps</span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-purple-300 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Pesquisar aplicativos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#23083B]/80 border border-[#8022B8]/50 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-[#F5B942] shadow-inner"
              autoFocus
            />
          </div>
        </div>

        {/* Apps Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {filteredNativeApps.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-[#F5B942] uppercase tracking-wider px-2">
                Apps do celular
              </div>
              <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                {filteredNativeApps.map((app) => (
                  <button
                    key={app.packageName}
                    onClick={() => {
                      playHapticClick(settings.soundEffects);
                      launchNativeApp(app.packageName);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      openNativeAppInfo(app.packageName);
                    }}
                    className="flex flex-col items-center space-y-1.5 active:scale-95 transition-transform"
                  >
                    <img src={app.icon} alt="" className="w-12 h-12 object-contain" />
                    <span className="text-[11px] text-zinc-200 w-full truncate text-center">{app.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {filteredApps.length === 0 && filteredNativeApps.length === 0 ? (
            <div className="py-16 text-center text-purple-300/60 text-sm">
              Nenhum aplicativo encontrado com &ldquo;{searchTerm}&rdquo;
            </div>
          ) : (
            filteredApps.length > 0 && sortedLetters.map((letter) => (
              <div key={letter} className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#F5B942] uppercase tracking-wider px-2">
                  {letter}
                </div>
                <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                  {groupedApps[letter].map((app) => (
                    <AppIcon
                      key={app.id}
                      name={app.name}
                      iconName={app.iconName}
                      color={app.color}
                      gradient={app.gradient}
                      shape={settings.iconShape}
                      size="md"
                      unreadCount={app.unreadCount}
                      showLabel={true}
                      labelColor="text-zinc-200"
                      onClick={() => {
                        playHapticClick(settings.soundEffects);
                        onLaunchApp(app);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Close Indicator */}
        <div
          onClick={onClose}
          className="py-3 flex flex-col items-center justify-center cursor-pointer hover:bg-[#23083B]/60 border-t border-[#8022B8]/30"
        >
          <div className="w-12 h-1 bg-[#8022B8]/70 rounded-full mb-1" />
          <span className="text-[10px] text-purple-300/60 font-mono">Deslize para baixo ou toque para voltar</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
