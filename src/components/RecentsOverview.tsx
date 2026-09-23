import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Camera, ExternalLink } from 'lucide-react';
import { AppItem } from '../types';
import { playHapticClick } from '../utils/audio';

interface RecentsOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  recentApps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  onClearAll: () => void;
  onCloseApp: (appId: string) => void;
  soundEnabled: boolean;
}

export const RecentsOverview: React.FC<RecentsOverviewProps> = ({
  isOpen,
  onClose,
  recentApps,
  onSelectApp,
  onClearAll,
  onCloseApp,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="recents-overview"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl text-white flex flex-col justify-between p-4 pt-12 select-none"
      >
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Aplicativos Recentes
          </span>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white p-1"
          >
            Fechar
          </button>
        </div>

        {/* Carousel of Cards */}
        <div className="flex-1 flex items-center justify-start overflow-x-auto py-6 space-x-4 px-4 snap-x">
          {recentApps.length === 0 ? (
            <div className="w-full text-center text-zinc-500 text-sm">
              Nenhum aplicativo aberto recentemente
            </div>
          ) : (
            recentApps.map((app) => (
              <motion.div
                key={app.id}
                layout
                className="w-56 h-84 flex-shrink-0 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between snap-center relative group cursor-pointer"
                onClick={() => {
                  playHapticClick(soundEnabled);
                  onSelectApp(app);
                }}
              >
                {/* Header with App Name & Close */}
                <div className="p-3 bg-zinc-850 flex justify-between items-center border-b border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: app.color }}
                    >
                      {app.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold truncate">{app.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playHapticClick(soundEnabled);
                      onCloseApp(app.id);
                    }}
                    className="text-zinc-400 hover:text-red-400 p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated App Screenshot View */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center bg-zinc-950/60">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                    style={{ backgroundColor: app.color }}
                  >
                    {app.name.charAt(0)}
                  </div>
                  <p className="text-xs text-zinc-400 mt-3 font-medium">Toque para alternar</p>
                </div>

                {/* Bottom Card Bar */}
                <div className="p-2.5 bg-zinc-900 flex justify-around text-[10px] text-zinc-400 border-t border-zinc-800">
                  <span className="hover:text-white">Captura</span>
                  <span>•</span>
                  <span className="hover:text-white">Dividir Tela</span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center pb-4">
          {recentApps.length > 0 && (
            <button
              onClick={() => {
                playHapticClick(soundEnabled);
                onClearAll();
              }}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-semibold flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Limpar Tudo</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
