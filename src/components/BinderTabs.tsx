import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Sparkles,
  Briefcase,
  Heart,
  Cpu,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import { PhoneEnvironment, EnvironmentId } from '../types';
import { playBinderTabFlip, playHapticClick } from '../utils/audio';

interface BinderTabsProps {
  environments: PhoneEnvironment[];
  activeEnvironmentId: EnvironmentId;
  onSelectEnvironment: (envId: EnvironmentId) => void;
  position?: 'right' | 'left';
  onTogglePosition?: () => void;
  showRings?: boolean;
  onToggleRings?: () => void;
  soundEnabled?: boolean;
}

export const BinderTabs: React.FC<BinderTabsProps> = ({
  environments,
  activeEnvironmentId,
  onSelectEnvironment,
  position = 'right',
  onTogglePosition,
  showRings = true,
  onToggleRings,
  soundEnabled = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredEnvId, setHoveredEnvId] = useState<EnvironmentId | null>(null);

  const activeEnv = environments.find((e) => e.id === activeEnvironmentId) || environments[0];

  const getEnvIcon = (iconName: string, className: string = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  const isRight = position === 'right';

  return (
    <>
      {/* 1. Binder Spine Rings (Furos e Argolas Metálicas de Fichário) */}
      {showRings && (
        <div
          className={`absolute ${
            isRight ? 'left-1' : 'right-1'
          } top-16 bottom-20 z-20 flex flex-col justify-around pointer-events-none select-none`}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex items-center space-x-0.5 opacity-85">
              {/* Binder punched hole with realistic inner depth */}
              <div
                className={`w-3 h-3 rounded-full bg-zinc-950/90 border border-zinc-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center`}
              >
                {/* Metallic ring segment looping through */}
                <div
                  className={`w-1.5 h-5 rounded-sm bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 shadow-sm transform ${
                    isRight ? '-translate-x-1.5' : 'translate-x-1.5'
                  }`}
                  style={{
                    boxShadow: '0 0 3px rgba(255,255,255,0.4)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Side Binder Divider Tabs ("Abas de Fichário") */}
      <nav
        aria-label="Abas de Fichário de Ambientes"
        className={`absolute ${
          isRight ? 'right-0 items-end' : 'left-0 items-start'
        } top-24 z-30 flex flex-col space-y-2 select-none`}
      >
        {/* Toggle / Quick Info trigger at top of tabs */}
        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setIsExpanded(!isExpanded);
          }}
          className={`group flex items-center justify-center h-6 mb-1 text-[10px] font-mono font-bold tracking-wider transition-all duration-200 shadow-md ${
            isRight
              ? 'rounded-l-lg bg-zinc-900/95 border-y border-l border-zinc-700/80 w-7 hover:w-8 text-zinc-300 hover:text-white pr-0.5'
              : 'rounded-r-lg bg-zinc-900/95 border-y border-r border-zinc-700/80 w-7 hover:w-8 text-zinc-300 hover:text-white pl-0.5'
          }`}
          title={isExpanded ? 'Recolher fichário de ambientes' : 'Expandir visão geral de ambientes'}
        >
          {isExpanded ? (
            isRight ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <Sliders className="w-3 h-3 text-zinc-400 group-hover:text-[#F5B942]" />
          )}
        </button>

        {/* Staggered Binder Tabs */}
        {environments.map((env) => {
          const isActive = env.id === activeEnvironmentId;
          const isHovered = env.id === hoveredEnvId;

          return (
            <div
              key={env.id}
              className={`relative flex items-center ${isRight ? 'justify-end' : 'justify-start'}`}
              onMouseEnter={() => setHoveredEnvId(env.id)}
              onMouseLeave={() => setHoveredEnvId(null)}
            >
              {/* Binder Tab Body */}
              <button
                id={`binder-tab-${env.id}`}
                onClick={() => {
                  playBinderTabFlip(soundEnabled);
                  onSelectEnvironment(env.id);
                }}
                className={`relative flex items-center transition-all duration-200 cursor-pointer overflow-hidden ${
                  isRight
                    ? 'rounded-l-xl border-y border-l pl-2 pr-1.5 py-2'
                    : 'rounded-r-xl border-y border-r pr-2 pl-1.5 py-2'
                } ${
                  isActive
                    ? `${env.tabBg} ${env.tabBorder} shadow-[0_4px_16px_rgba(0,0,0,0.6)] ${
                        isRight ? 'w-[50px]' : 'w-[50px]'
                      } z-20`
                    : 'bg-zinc-900/95 border-zinc-700/80 hover:bg-zinc-850 hover:border-zinc-500/80 shadow-md w-9 hover:w-11 z-10 opacity-80 hover:opacity-100'
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 0 14px ${env.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
                title={`Ambiente ${env.name}: ${env.tagline}`}
              >
                {/* Paper texture ribbing line (costura/vinco do fichário) */}
                <div
                  className={`absolute top-0 bottom-0 ${
                    isRight ? 'right-0.5' : 'left-0.5'
                  } w-[2px] pointer-events-none opacity-90`}
                  style={{ backgroundColor: env.color }}
                />

                {/* Tab Content: Icon + Vertical Monospace Label */}
                <div className="flex flex-col items-center justify-center space-y-1 w-full">
                  {/* Environment Color Dot or Icon */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-black/40 text-white shadow-inner'
                        : 'bg-zinc-800/80 text-zinc-400 group-hover:text-zinc-200'
                    }`}
                    style={{
                      color: isActive ? env.color : undefined,
                    }}
                  >
                    {getEnvIcon(env.iconName, 'w-3 h-3')}
                  </div>

                  {/* Vertical Label (Orelha de Fichário) */}
                  <span
                    className={`text-[8.5px] font-mono font-bold tracking-tighter leading-none uppercase ${
                      isActive ? env.tabTextColor : 'text-zinc-400'
                    }`}
                  >
                    {env.shortLabel}
                  </span>

                  {/* Active tab bookmark notch */}
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse mt-0.5 shadow-sm"
                      style={{ backgroundColor: env.color }}
                    />
                  )}
                </div>
              </button>

              {/* Hover Tooltip Peek */}
              <AnimatePresence>
                {isHovered && !isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: isRight ? 10 : -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: isRight ? -8 : 8, scale: 1 }}
                    exit={{ opacity: 0, x: isRight ? 10 : -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute ${
                      isRight ? 'right-full mr-2' : 'left-full ml-2'
                    } z-50 pointer-events-none whitespace-nowrap bg-zinc-950/95 backdrop-blur-xl border border-zinc-700/90 rounded-xl px-3 py-1.5 shadow-2xl text-left`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: env.color }}
                      />
                      <span className="text-xs font-mono font-bold text-white">
                        {env.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                        {env.statusBadge}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
                      {env.tagline}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* 3. Expanded Binder Index Drawer (Visão Detalhada de Ambientes) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute ${
              isRight ? 'right-12' : 'left-12'
            } top-16 z-40 w-72 bg-[#170524]/95 backdrop-blur-2xl border border-[#8022B8]/60 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.85)] p-3.5 select-none font-sans text-white`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#8022B8]/30">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-[#23083B] border border-[#8022B8] flex items-center justify-center text-[#F5B942]">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white tracking-wide">
                    FICHÁRIO DE AMBIENTES
                  </h4>
                  <p className="text-[10px] text-purple-300/70">
                    Alterne abas para trocar de modo
                  </p>
                </div>
              </div>

              {/* Controls: switch side & toggle rings */}
              <div className="flex items-center space-x-1">
                {onTogglePosition && (
                  <button
                    onClick={() => {
                      playHapticClick(soundEnabled);
                      onTogglePosition();
                    }}
                    className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono"
                    title={`Mover abas para a ${isRight ? 'esquerda' : 'direita'}`}
                  >
                    {isRight ? '← Esq' : 'Dir →'}
                  </button>
                )}
                {onToggleRings && (
                  <button
                    onClick={() => {
                      playHapticClick(soundEnabled);
                      onToggleRings();
                    }}
                    className={`p-1 rounded-md text-[10px] font-mono ${
                      showRings
                        ? 'bg-amber-950/70 text-[#F5B942] border border-[#F5B942]/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                    title="Alternar argolas metálicas de fichário"
                  >
                    Argolas
                  </button>
                )}
              </div>
            </div>

            {/* Environments List */}
            <div className="space-y-2">
              {environments.map((env) => {
                const isActive = env.id === activeEnvironmentId;

                return (
                  <div
                    key={env.id}
                    onClick={() => {
                      playBinderTabFlip(soundEnabled);
                      onSelectEnvironment(env.id);
                      setIsExpanded(false);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                      isActive
                        ? `${env.tabBg} ${env.tabBorder} shadow-[0_0_12px_rgba(245,185,66,0.15)] ring-1 ring-white/10`
                        : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-inner"
                        style={{
                          backgroundColor: `${env.color}25`,
                          color: env.color,
                          border: `1px solid ${env.color}50`,
                        }}
                      >
                        {getEnvIcon(env.iconName, 'w-4 h-4')}
                      </div>

                      <div className="text-left leading-tight">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-mono font-bold text-white">
                            {env.name}
                          </span>
                          <span
                            className="text-[9px] font-mono px-1 py-0.2 rounded font-semibold"
                            style={{
                              backgroundColor: `${env.color}20`,
                              color: env.color,
                            }}
                          >
                            {env.shortLabel}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-sans line-clamp-1 mt-0.5">
                          {env.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 pl-2">
                      {isActive ? (
                        <span className="flex items-center space-x-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                          <Check className="w-3 h-3" />
                          <span>Ativo</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300">
                          Ativar
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Environment Telemetry Footer */}
            <div className="mt-3 pt-2 border-t border-[#8022B8]/30 flex items-center justify-between text-[10px] font-mono text-purple-300/80">
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-[#F5B942]" />
                <span>{activeEnv.metricLabel}:</span>
              </span>
              <span className="text-white font-bold">{activeEnv.metricValue}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
