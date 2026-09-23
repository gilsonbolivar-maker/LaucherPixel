import React, { useState } from 'react';
import { Palette, Copy, Check, Sparkles, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface PaletteStudioAppProps {
  accentColor: string;
  soundEnabled: boolean;
}

interface ColorToken {
  name: string;
  hex: string;
  role: string;
}

const PRESET_SYSTEMS: { name: string; colors: ColorToken[] }[] = [
  {
    name: 'Material You (Monet Dev)',
    colors: [
      { name: 'Primary', hex: '#10B981', role: 'Destaque e Ações' },
      { name: 'Primary Container', hex: '#064E3B', role: 'Superfícies de destaque' },
      { name: 'Secondary', hex: '#06B6D4', role: 'Badges e filtros' },
      { name: 'Surface', hex: '#09090B', role: 'Fundo principal' },
      { name: 'Surface Variant', hex: '#18181B', role: 'Cards e Docks' },
      { name: 'On Surface', hex: '#F4F4F5', role: 'Texto primário' },
    ],
  },
  {
    name: 'Tokyo Night (IDE Dark)',
    colors: [
      { name: 'Primary', hex: '#7AA2F7', role: 'Keywords e Links' },
      { name: 'Accent', hex: '#BB9AF7', role: 'Funções e Variáveis' },
      { name: 'Success', hex: '#9ECE6A', role: 'Strings e Status' },
      { name: 'Surface', hex: '#1A1B26', role: 'Editor Canvas' },
      { name: 'Panel', hex: '#24283B', role: 'Sidebar / Status' },
      { name: 'Foreground', hex: '#C0CAF5', role: 'Texto Editor' },
    ],
  },
  {
    name: 'Cyberpunk Neon Matrix',
    colors: [
      { name: 'Neon Green', hex: '#00FF66', role: 'Terminal Glow' },
      { name: 'Cyan Laser', hex: '#00F0FF', role: 'Accent Lines' },
      { name: 'Magenta Glitch', hex: '#FF0055', role: 'Critical Error' },
      { name: 'Obsidian Void', hex: '#05050A', role: 'Fundo Absoluto' },
      { name: 'Grid Steel', hex: '#14142B', role: 'Bordas e Containers' },
      { name: 'Signal Amber', hex: '#FFE600', role: 'Warning / Tags' },
    ],
  },
];

export const PaletteStudioApp: React.FC<PaletteStudioAppProps> = ({ accentColor, soundEnabled }) => {
  const [selectedSystemIdx, setSelectedSystemIdx] = useState(0);
  const [activeColors, setActiveColors] = useState<ColorToken[]>(PRESET_SYSTEMS[0].colors);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [customHex, setCustomHex] = useState('#10B981');

  const handleSelectSystem = (idx: number) => {
    playHapticClick(soundEnabled);
    setSelectedSystemIdx(idx);
    setActiveColors(PRESET_SYSTEMS[idx].colors);
  };

  const handleCopy = (text: string, id: string) => {
    playHapticClick(soundEnabled);
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const getCssVariablesExport = () => {
    return `:root {\n` +
      activeColors.map((c) => `  --color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n') +
      `\n}`;
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Top Header */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold">Design Tokens &amp; Paletas</h2>
            <p className="text-[10px] text-zinc-400">Para criadores digitais e UI/UX</p>
          </div>
        </div>

        <button
          onClick={() => handleCopy(getCssVariablesExport(), 'all-css')}
          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-200 flex items-center space-x-1"
        >
          {copiedToken === 'all-css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedToken === 'all-css' ? 'Copiado!' : 'CSS Tokens'}</span>
        </button>
      </div>

      {/* Preset Theme Pills */}
      <div className="p-2.5 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center space-x-2 overflow-x-auto text-xs">
        {PRESET_SYSTEMS.map((system, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectSystem(idx)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition-colors ${
              idx === selectedSystemIdx
                ? 'bg-purple-600 text-white font-semibold shadow'
                : 'bg-zinc-850 text-zinc-400 hover:text-white'
            }`}
          >
            {system.name}
          </button>
        ))}
      </div>

      {/* Main Colors Grid */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          {activeColors.map((color, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 space-y-2 relative group overflow-hidden"
            >
              <div
                className="w-full h-12 rounded-lg shadow-inner flex items-end justify-end p-1.5 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: color.hex }}
              >
                <button
                  onClick={() => handleCopy(color.hex, `hex-${idx}`)}
                  className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center space-x-1"
                >
                  {copiedToken === `hex-${idx}` ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{color.hex}</span>
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-white">{color.name}</p>
                <p className="text-[10px] text-zinc-400">{color.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live UI Mockup Preview Component */}
        <div className="mt-4 p-3 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-2.5">
          <p className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Pré-visualização do Componente UI</span>
          </p>
          <div
            className="p-3 rounded-xl border flex items-center justify-between"
            style={{
              backgroundColor: activeColors[3]?.hex || '#09090b',
              borderColor: activeColors[4]?.hex || '#27272a',
              color: activeColors[5]?.hex || '#ffffff',
            }}
          >
            <div>
              <p className="text-xs font-bold" style={{ color: activeColors[0]?.hex }}>Card Component</p>
              <p className="text-[10px] opacity-80">Renderizado com os tokens da paleta ativa.</p>
            </div>
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-950 shadow"
              style={{ backgroundColor: activeColors[0]?.hex || '#10B981' }}
            >
              Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
