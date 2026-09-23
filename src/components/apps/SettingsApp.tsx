import React from 'react';
import {
  Palette,
  Image as ImageIcon,
  Grid,
  Shapes,
  Navigation,
  Smartphone,
  Volume2,
  RefreshCw,
  Moon,
  Sun,
  Check,
  Download,
  QrCode,
} from 'lucide-react';
import { LauncherSettings, GridSize, IconShape, NavStyle } from '../../types';
import { WALLPAPERS, ACCENT_PALETTES, DEFAULT_SETTINGS } from '../../data/launcherData';
import { playHapticClick } from '../../utils/audio';

interface SettingsAppProps {
  settings: LauncherSettings;
  onUpdateSettings: (newSettings: Partial<LauncherSettings>) => void;
  onOpenDevGuide: () => void;
  onOpenInstallGuide?: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  onUpdateSettings,
  onOpenDevGuide,
  onOpenInstallGuide,
}) => {
  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      {/* Top Bar */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-bold">Configurações do Launcher</h2>
        <p className="text-xs text-zinc-400">Personalize o visual e comportamento do Android</p>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Wallpapers Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-300">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Papel de Parede</h3>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                onClick={() => {
                  playHapticClick(settings.soundEffects);
                  onUpdateSettings({ wallpaperId: wp.id, accentColor: wp.accentColor });
                }}
                className={`relative aspect-[9/16] rounded-2xl overflow-hidden border-2 transition-all active:scale-95 group ${
                  settings.wallpaperId === wp.id ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-transparent hover:border-zinc-700'
                }`}
              >
                <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-medium text-white leading-tight">{wp.name}</span>
                </div>
                {settings.wallpaperId === wp.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Material You Accent Color */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-300">
            <Palette className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Cores Material You (Monet)</h3>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {ACCENT_PALETTES.map((pal) => (
              <button
                key={pal.hex}
                onClick={() => {
                  playHapticClick(settings.soundEffects);
                  onUpdateSettings({ accentColor: pal.hex });
                }}
                style={{ backgroundColor: pal.hex }}
                className={`h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                  settings.accentColor === pal.hex ? 'ring-2 ring-white scale-105' : 'opacity-80 hover:opacity-100'
                }`}
                title={pal.name}
              >
                {settings.accentColor === pal.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* App Grid Size */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-300">
            <Grid className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Grade de Aplicativos</h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['4x4', '4x5', '5x5'] as GridSize[]).map((size) => (
              <button
                key={size}
                onClick={() => {
                  playHapticClick(settings.soundEffects);
                  onUpdateSettings({ gridSize: size });
                }}
                className={`py-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                  settings.gridSize === size
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Shape */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-300">
            <Shapes className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Formato dos Ícones</h3>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { id: 'squircle', label: 'Squircle' },
                { id: 'circle', label: 'Círculo' },
                { id: 'rounded', label: 'Quadrado' },
                { id: 'teardrop', label: 'Gota' },
              ] as { id: IconShape; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  playHapticClick(settings.soundEffects);
                  onUpdateSettings({ iconShape: s.id });
                }}
                className={`py-2 px-1 rounded-2xl border text-xs font-semibold transition-all text-center ${
                  settings.iconShape === s.id
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Style */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-300">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Barra de Navegação</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: 'gestures', label: 'Navegação por Gestos' },
                { id: '3-button', label: '3 Botões Tradicionais' },
              ] as { id: NavStyle; label: string }[]
            ).map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  playHapticClick(settings.soundEffects);
                  onUpdateSettings({ navStyle: n.id });
                }}
                className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                  settings.navStyle === n.id
                    ? 'bg-cyan-600 border-cyan-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles (Device Frame, Sounds, Dock Labels) */}
        <div className="space-y-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-xs font-semibold">Moldura de Celular</p>
                <p className="text-[10px] text-zinc-500">Exibir carcaça de smartphone Android</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.showDeviceFrame}
              onChange={(e) => {
                playHapticClick(settings.soundEffects);
                onUpdateSettings({ showDeviceFrame: e.target.checked });
              }}
              className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-xs font-semibold">Sons e Feedback Tátil</p>
                <p className="text-[10px] text-zinc-500">Efeitos sonoros ao tocar nos ícones</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
              className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <div className="flex items-center space-x-3">
              <Sun className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="text-xs font-semibold">Legendas na Barra Dock</p>
                <p className="text-[10px] text-zinc-500">Mostrar nomes dos apps no dock inferior</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.showDockLabels}
              onChange={(e) => onUpdateSettings({ showDockLabels: e.target.checked })}
              className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Mobile PWA & Native Install Section */}
        {onOpenInstallGuide && (
          <div
            onClick={() => {
              playHapticClick(settings.soundEffects);
              onOpenInstallGuide();
            }}
            className="bg-gradient-to-r from-[#23083B] via-[#350d54] to-[#23083B] border border-[#F5B942]/70 rounded-2xl p-4 cursor-pointer hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(245,185,66,0.15)] group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5B942]/20 text-[#F5B942] border border-[#F5B942]/60 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-bold text-white font-mono">Como Instalar no Celular</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#F5B942]/20 text-[#F5B942] font-semibold">
                    1-Clique
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 mt-0.5">
                  Toque para ver o QR Code e instruções para Android (Chrome) e iPhone (iOS).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Native Kotlin Guide Banner */}
        <div
          onClick={onOpenDevGuide}
          className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 cursor-pointer hover:bg-emerald-950/60 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300">Quer compilar para seu celular Android real?</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Toque aqui para abrir o código Kotlin e o AndroidManifest.</p>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              playHapticClick(true);
              onUpdateSettings(DEFAULT_SETTINGS);
            }}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-2xl text-xs font-semibold border border-zinc-800 flex items-center justify-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar Padrões de Fábrica</span>
          </button>
        </div>
      </div>
    </div>
  );
};
