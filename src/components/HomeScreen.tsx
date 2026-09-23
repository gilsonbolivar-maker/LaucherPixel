import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitBranch,
  Terminal,
  Activity,
  Sparkles,
  Camera,
  Play,
  CheckCircle2,
  Code2,
  Cpu,
  ArrowRight,
  BookOpen,
  Briefcase,
  Heart,
  Sliders,
} from 'lucide-react';
import { AppItem, LauncherSettings, PhoneEnvironment, EnvironmentId } from '../types';
import { AppIcon } from './AppIcon';
import { PixelNexoLogo } from './PixelNexoLogo';
import { playHapticClick } from '../utils/audio';

interface HomeScreenProps {
  apps: AppItem[];
  settings: LauncherSettings;
  activeEnvironment?: PhoneEnvironment;
  onSwitchEnvironment?: (envId: EnvironmentId) => void;
  onLaunchApp: (app: AppItem) => void;
  onOpenBrowserWithQuery: (query: string) => void;
  onOpenClock: () => void;
  onOpenSettings: () => void;
  onOpenInstallGuide?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  apps,
  settings,
  activeEnvironment,
  onSwitchEnvironment,
  onLaunchApp,
  onOpenBrowserWithQuery,
  onOpenClock,
  onOpenSettings,
  onOpenInstallGuide,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWidgetTab, setActiveWidgetTab] = useState<'nexo' | 'git' | 'telemetry'>('nexo');

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    if (query === 'pixel-nexo' || query === 'nexo' || query === 'brand' || query === '> nexo') {
      const nexoApp = apps.find((a) => a.componentId === 'pixel_nexo') || apps[0];
      onLaunchApp(nexoApp);
    } else if (['instalar', 'install', 'pwa', 'apk'].includes(query.toLowerCase())) {
      if (onOpenInstallGuide) onOpenInstallGuide();
    } else if (query.startsWith('env ') || query.startsWith('ambiente ')) {
      const targetEnv = query.replace('env ', '').replace('ambiente ', '').trim().toLowerCase() as EnvironmentId;
      if (['dev', 'nexo', 'work', 'personal', 'ops'].includes(targetEnv) && onSwitchEnvironment) {
        onSwitchEnvironment(targetEnv);
      }
    } else if (query.startsWith('gh ') || query === 'gh') {
      const ghApp = apps.find((a) => a.componentId === 'gh_terminal') || apps[0];
      onLaunchApp(ghApp);
    } else if (query.startsWith('gdrive') || query.startsWith('drive') || query === 'drive') {
      const driveApp = apps.find((a) => a.componentId === 'gdrive_terminal') || apps[0];
      onLaunchApp(driveApp);
    } else if (query.startsWith('>') || ['neofetch', 'git', 'npm', 'curl', 'eval', 'ls'].some(cmd => query.startsWith(cmd))) {
      // Direct command execution -> launch Terminal
      const terminalApp = apps.find((a) => a.componentId === 'terminal') || {
        id: 'terminal',
        name: 'Terminal CLI',
        iconName: 'Terminal',
        color: '#10B981',
        category: 'dev' as const,
        componentId: 'terminal',
      };
      onLaunchApp(terminalApp);
    } else if (query.startsWith('gh:')) {
      onOpenBrowserWithQuery(`https://github.com/search?q=${encodeURIComponent(query.replace('gh:', '').trim())}`);
    } else if (query.startsWith('npm:')) {
      onOpenBrowserWithQuery(`https://www.npmjs.com/search?q=${encodeURIComponent(query.replace('npm:', '').trim())}`);
    } else if (query.startsWith('so:')) {
      onOpenBrowserWithQuery(`https://stackoverflow.com/search?q=${encodeURIComponent(query.replace('so:', '').trim())}`);
    } else {
      onOpenBrowserWithQuery(query);
    }
    setSearchQuery('');
  };

  // Grid classes based on settings
  const gridColsClass = {
    '4x4': 'grid-cols-4 gap-y-6',
    '4x5': 'grid-cols-4 gap-y-5',
    '5x5': 'grid-cols-5 gap-y-4',
  }[settings.gridSize];

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-2 select-none overflow-y-auto">
      {/* Top: Dev At a Glance Widget */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div
            onClick={onOpenClock}
            className="cursor-pointer group flex flex-col items-start"
          >
            <div className="flex items-center space-x-2 text-white/95 drop-shadow">
              <span className="text-xl font-mono font-bold tracking-tight">
                {currentDate.toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#23083B] border border-[#8022B8]/80 text-[#F5B942] font-mono flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5B942] animate-ping" />
                <span>localhost:3000</span>
              </span>
            </div>

            {/* Git Branch & CI Status badge */}
            <div className="flex items-center space-x-2 text-xs font-mono text-white/90 mt-1 drop-shadow">
              <div className="flex items-center space-x-1 text-pink-400">
                <GitBranch className="w-3.5 h-3.5" />
                <span className="font-semibold">main</span>
              </div>
              <span className="text-zinc-500">•</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>CI: passing (2.1s)</span>
              </span>
            </div>
          </div>

          {/* Pixel Nexo Interactive Brand Badge */}
          <div
            onClick={() => {
              playHapticClick(settings.soundEffects);
              const nexoApp = apps.find((a) => a.componentId === 'pixel_nexo') || apps[0];
              onLaunchApp(nexoApp);
            }}
            className="cursor-pointer transition-transform active:scale-95"
            title="Abrir Pixel Nexo Studio"
          >
            <PixelNexoLogo variant="badge" size="sm" />
          </div>
        </div>

        {/* Interactive Developer / Digital Creator Tile */}
        <div className="bg-[#1b052d]/75 backdrop-blur-xl border border-[#8022B8]/40 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_4px_20px_rgba(27,5,45,0.6)]">
          <div
            onClick={() => {
              playHapticClick(settings.soundEffects);
              setActiveWidgetTab(
                activeWidgetTab === 'nexo'
                  ? 'git'
                  : activeWidgetTab === 'git'
                  ? 'telemetry'
                  : 'nexo'
              );
            }}
            className="flex items-center space-x-2.5 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-[#23083B] border border-[#8022B8]/60 flex items-center justify-center shadow">
              {activeWidgetTab === 'nexo' ? (
                <PixelNexoLogo variant="icon" size="sm" />
              ) : activeWidgetTab === 'git' ? (
                <Code2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Cpu className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div className="text-left leading-tight">
              {activeWidgetTab === 'nexo' ? (
                <>
                  <p className="text-xs font-mono font-bold text-[#F5B942] truncate max-w-[170px]">
                    PIXEL NEXO OS v2.5
                  </p>
                  <p className="text-[10px] text-purple-300/80 font-sans">Node Matrix &amp; Cyber Violet</p>
                </>
              ) : activeWidgetTab === 'git' ? (
                <>
                  <p className="text-xs font-mono font-semibold text-emerald-300 truncate max-w-[170px]">
                    commit 98f02a (v2.4.1)
                  </p>
                  <p className="text-[10px] text-zinc-400 font-sans">Adaptive shapes &amp; haptics</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-mono font-semibold text-cyan-300">
                    60 FPS • Heap 58%
                  </p>
                  <p className="text-[10px] text-zinc-400 font-sans">8 Cores • 31.4°C Estável</p>
                </>
              )}
            </div>
          </div>

          {/* Quick launch button */}
          {activeWidgetTab === 'nexo' ? (
            <button
              onClick={() => {
                playHapticClick(settings.soundEffects);
                const nexoApp = apps.find((a) => a.componentId === 'pixel_nexo') || apps[0];
                onLaunchApp(nexoApp);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#23083B] border border-[#F5B942]/60 hover:bg-[#350d57] text-[#F5B942] flex items-center space-x-1 text-[11px] font-mono shadow transition-transform active:scale-95"
              title="Abrir Pixel Nexo Studio"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>NEXO</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playHapticClick(settings.soundEffects);
                const terminal = apps.find((a) => a.componentId === 'terminal') || apps[0];
                onLaunchApp(terminal);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 hover:bg-emerald-900/90 text-emerald-300 flex items-center space-x-1 text-[11px] font-mono shadow transition-transform active:scale-95"
              title="Abrir Terminal CLI"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>CLI</span>
            </button>
          )}
        </div>
      </div>

      {/* Binder Divider Environment Header */}
      {activeEnvironment && (
        <div className="flex items-center justify-between px-2 pt-1 pb-0.5 border-b border-white/10 text-[11px] font-mono select-none">
          <div className="flex items-center space-x-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shadow-sm"
              style={{ backgroundColor: activeEnvironment.color }}
            />
            <span className="font-bold text-white tracking-wide uppercase">
              {activeEnvironment.name}
            </span>
            <span
              className="text-[9px] px-1.5 py-0.2 rounded font-semibold"
              style={{
                backgroundColor: `${activeEnvironment.color}20`,
                color: activeEnvironment.color,
              }}
            >
              {activeEnvironment.shortLabel}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400">
            {apps.length} {apps.length === 1 ? 'app' : 'apps'}
          </span>
        </div>
      )}

      {/* Main Apps Grid with Binder Page Turn Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEnvironment?.id || 'default-grid'}
          initial={{ opacity: 0, x: 12, rotateY: 3 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -12, rotateY: -3 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`grid ${gridColsClass} gap-x-2 px-1 py-3 my-auto`}
        >
          {apps.map((app) => (
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
              labelColor="text-white font-medium"
              onClick={() => {
                playHapticClick(settings.soundEffects);
                onLaunchApp(app);
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Developer Omnibar (Search & Command Runner) */}
      <div className="pb-1 pt-1 space-y-1.5">
        {/* Quick Tag Selector */}
        <div className="flex items-center space-x-1 px-2 text-[10px] font-mono text-zinc-400 overflow-x-auto">
          <span className="text-zinc-500">Atalhos:</span>
          {['> nexo', 'env: dev', 'env: work', 'gh repo list', 'gdrive quota', '> neofetch'].map((shortcut) => (
            <button
              key={shortcut}
              onClick={() => {
                playHapticClick(settings.soundEffects);
                if (shortcut.startsWith('env: ') && onSwitchEnvironment) {
                  const targetEnv = shortcut.replace('env: ', '').trim() as EnvironmentId;
                  onSwitchEnvironment(targetEnv);
                } else {
                  setSearchQuery(shortcut);
                }
              }}
              className="px-2 py-0.5 rounded bg-[#23083B]/80 hover:bg-[#350d57] border border-[#8022B8]/40 text-[#F5B942] whitespace-nowrap transition-colors font-semibold"
            >
              {shortcut}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="w-full h-12 bg-[#1b052d]/90 backdrop-blur-xl rounded-full px-4 flex items-center justify-between shadow-[0_4px_25px_rgba(27,5,45,0.8)] border border-[#8022B8]/50"
        >
          {/* Terminal / Dev Prompt Icon */}
          <div className="flex items-center space-x-2 flex-1">
            <span className="font-mono text-xs font-bold text-[#F5B942] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B942] inline-block" />
              <span>nexo: ~</span>
            </span>
            <input
              type="text"
              placeholder="Digite comando dev, gh, drive ou busque..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-purple-300/40 focus:outline-none w-full font-mono"
            />
          </div>

          {/* Action icon */}
          <div className="flex items-center space-x-1.5 text-purple-300">
            <button
              type="button"
              onClick={() => {
                playHapticClick(settings.soundEffects);
                onLaunchApp(apps.find((a) => a.id === 'camera') || apps[0]);
              }}
              className="p-1.5 hover:text-[#F5B942] transition-colors"
              title="Scanner de QR / Câmera"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="p-1.5 rounded-full bg-gradient-to-tr from-[#F5B942] to-[#E09D30] hover:brightness-110 text-zinc-950 font-bold transition-all shadow-[0_0_10px_rgba(245,185,66,0.4)]"
              title="Executar ou Buscar"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

