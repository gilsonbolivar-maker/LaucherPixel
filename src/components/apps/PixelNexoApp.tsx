import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Palette,
  Download,
  Share2,
  Code2,
  Sliders,
  Smartphone,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { PixelNexoLogo } from '../PixelNexoLogo';
import { playHapticClick } from '../../utils/audio';
import { LauncherSettings } from '../../types';

interface PixelNexoAppProps {
  settings: LauncherSettings;
  onUpdateSettings: (newSettings: Partial<LauncherSettings>) => void;
  soundEnabled: boolean;
}

export const PixelNexoApp: React.FC<PixelNexoAppProps> = ({
  settings,
  onUpdateSettings,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'brand' | 'tokens' | 'code'>('brand');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    playHapticClick(soundEnabled);
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const applyPixelNexoTheme = () => {
    playHapticClick(soundEnabled);
    onUpdateSettings({
      wallpaperId: 'pixel-nexo-core',
      accentColor: '#F5B942',
      iconShape: 'squircle',
      isDarkMode: true,
    });
  };

  const BRAND_COLORS = [
    {
      name: 'Pixel Nexo Gold',
      role: 'Cor Primária / Acentos',
      hex: '#F5B942',
      rgb: 'rgb(245, 185, 66)',
      textColor: 'text-zinc-950',
      bgClass: 'bg-[#F5B942]',
    },
    {
      name: 'Deep Night Violet',
      role: 'Superfície & Fundo Escuro',
      hex: '#23083B',
      rgb: 'rgb(35, 8, 59)',
      textColor: 'text-white',
      bgClass: 'bg-[#23083B]',
    },
    {
      name: 'Neon Violet Border',
      role: 'Bordas, Linhas & Glow',
      hex: '#8022B8',
      rgb: 'rgb(128, 34, 184)',
      textColor: 'text-white',
      bgClass: 'bg-[#8022B8]',
    },
    {
      name: 'Amber Bronze Node',
      role: 'Gradiente do Pixel Matrix',
      hex: '#E09D30',
      rgb: 'rgb(224, 157, 48)',
      textColor: 'text-zinc-950',
      bgClass: 'bg-[#E09D30]',
    },
    {
      name: 'Pixel Pure White',
      role: 'Tipografia PIXEL & Alto Contraste',
      hex: '#FFFFFF',
      rgb: 'rgb(255, 255, 255)',
      textColor: 'text-zinc-950',
      bgClass: 'bg-white',
    },
  ];

  const composeCode = `// PixelNexoTheme.kt - Jetpack Compose Material 3
package com.pixelnexo.launcher.theme

import androidx.compose.ui.graphics.Color

val PixelGold = Color(0xFFF5B942)
val PixelDeepViolet = Color(0xFF23083B)
val PixelNeonViolet = Color(0xFF8022B8)
val PixelBronze = Color(0xFFE09D30)
val PixelWhite = Color(0xFFFFFFFF)

// Material 3 Dark ColorScheme
val PixelNexoDarkColorScheme = darkColorScheme(
    primary = PixelGold,
    onPrimary = PixelDeepViolet,
    primaryContainer = PixelNeonViolet,
    background = PixelDeepViolet,
    surface = Color(0xFF19052A),
    onSurface = PixelWhite
)`;

  const tailwindCode = `// tailwind.config.js - Pixel Nexo Design Tokens
module.exports = {
  theme: {
    extend: {
      colors: {
        pixelnexo: {
          gold: '#F5B942',
          bronze: '#E09D30',
          deep: '#23083B',
          neon: '#8022B8',
          surface: '#180429',
        }
      },
      boxShadow: {
        'nexo-glow': '0 0 20px rgba(128, 34, 184, 0.45)',
        'gold-glow': '0 0 15px rgba(245, 185, 66, 0.35)',
      }
    }
  }
}`;

  return (
    <div className="h-full flex flex-col bg-[#160324] text-white overflow-hidden select-none font-sans">
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#23083B] border-b border-[#8022B8]/40 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <PixelNexoLogo variant="emblem" size="sm" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm">Pixel Nexo Studio</span>
              <span className="px-2 py-0.2 rounded-full bg-[#F5B942]/20 border border-[#F5B942]/60 text-[10px] text-[#F5B942] font-mono">
                OFICIAL
              </span>
            </div>
            <span className="text-[11px] text-purple-300">Identidade Visual, Tokens e Configurações</span>
          </div>
        </div>

        <button
          onClick={applyPixelNexoTheme}
          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F5B942] to-[#E09D30] text-zinc-950 font-bold text-xs shadow-[0_0_12px_rgba(245,185,66,0.4)] flex items-center space-x-1.5 transition-transform active:scale-95 hover:brightness-105"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aplicar Tema</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#8022B8]/30 bg-[#1d0630] px-3 pt-2 space-x-2 text-xs font-mono">
        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setActiveTab('brand');
          }}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'brand'
              ? 'border-[#F5B942] text-[#F5B942]'
              : 'border-transparent text-purple-300/70 hover:text-white'
          }`}
        >
          Marca &amp; Emblema
        </button>
        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setActiveTab('tokens');
          }}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'tokens'
              ? 'border-[#F5B942] text-[#F5B942]'
              : 'border-transparent text-purple-300/70 hover:text-white'
          }`}
        >
          Paleta de Cores
        </button>
        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setActiveTab('code');
          }}
          className={`pb-2 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'code'
              ? 'border-[#F5B942] text-[#F5B942]'
              : 'border-transparent text-purple-300/70 hover:text-white'
          }`}
        >
          Tokens Dev (Kotlin / CSS)
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'brand' && (
          <div className="space-y-4">
            {/* Main Brand Showcase Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#23083B] via-[#1a052e] to-[#2f0c4d] border-[1.5px] border-[#8022B8]/80 shadow-[0_10px_35px_rgba(35,8,59,0.8)] text-center flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#8022B8]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#F5B942]/15 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-mono tracking-widest text-[#F5B942] uppercase font-semibold">
                Badge Oficial Pixel Nexo
              </span>

              {/* Exact Badge from user's image */}
              <div className="py-2">
                <PixelNexoLogo variant="badge" size="lg" />
              </div>

              <p className="text-xs text-purple-200 max-w-sm leading-relaxed">
                Identidade oficial com hexágono de nós com raios dourados, matriz 3x3 de pixels em gradiente âmbar e tipografia de alto impacto.
              </p>

              <div className="pt-1 flex items-center space-x-2">
                <button
                  onClick={applyPixelNexoTheme}
                  className="px-5 py-2.5 rounded-xl bg-[#F5B942] text-zinc-950 font-bold text-xs flex items-center space-x-2 shadow-[0_0_20px_rgba(245,185,66,0.4)] active:scale-95 transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Definir como Tema Padrão do Launcher</span>
                </button>
              </div>
            </div>

            {/* Logo Variants Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                Variações do Emblema
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#23083B]/80 border border-[#8022B8]/40 flex flex-col items-center justify-center space-y-2 text-center">
                  <span className="text-[10px] text-purple-300/80 font-mono">Emblema Puro</span>
                  <div className="p-2">
                    <PixelNexoLogo variant="emblem" size="md" />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#23083B]/80 border border-[#8022B8]/40 flex flex-col items-center justify-center space-y-2 text-center">
                  <span className="text-[10px] text-purple-300/80 font-mono">Ícone Hexágono</span>
                  <div className="p-2">
                    <PixelNexoLogo variant="icon" size="md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                Paleta Cromática Oficial Pixel Nexo
              </h4>
              <span className="text-[11px] text-[#F5B942] font-mono">5 Tokens Definidos</span>
            </div>

            <div className="space-y-2">
              {BRAND_COLORS.map((col) => (
                <div
                  key={col.hex}
                  className="p-3 rounded-2xl bg-[#23083B]/80 border border-[#8022B8]/40 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${col.bgClass} border border-white/20 shadow-md flex-shrink-0`}
                    />
                    <div>
                      <p className="font-bold text-white text-xs">{col.name}</p>
                      <p className="text-[11px] text-purple-300">{col.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 font-mono">
                    <div className="text-right">
                      <p className="text-xs text-[#F5B942] font-bold">{col.hex}</p>
                      <p className="text-[10px] text-purple-400">{col.rgb}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(col.hex, col.hex)}
                      className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-[#8022B8]/40 text-purple-200 transition-colors"
                      title="Copiar HEX"
                    >
                      {copiedCode === col.hex ? (
                        <Check className="w-3.5 h-3.5 text-[#F5B942]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#F5B942] font-bold">Jetpack Compose Kotlin (Android)</span>
                <button
                  onClick={() => copyToClipboard(composeCode, 'compose')}
                  className="text-xs text-purple-300 hover:text-white flex items-center space-x-1 font-mono"
                >
                  {copiedCode === 'compose' ? <Check className="w-3.5 h-3.5 text-[#F5B942]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <pre className="p-3 bg-[#11021c] border border-[#8022B8]/40 rounded-2xl text-[11px] font-mono text-purple-200 overflow-x-auto select-text leading-relaxed">
                {composeCode}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#F5B942] font-bold">Tailwind CSS Tokens</span>
                <button
                  onClick={() => copyToClipboard(tailwindCode, 'tailwind')}
                  className="text-xs text-purple-300 hover:text-white flex items-center space-x-1 font-mono"
                >
                  {copiedCode === 'tailwind' ? <Check className="w-3.5 h-3.5 text-[#F5B942]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar</span>
                </button>
              </div>
              <pre className="p-3 bg-[#11021c] border border-[#8022B8]/40 rounded-2xl text-[11px] font-mono text-purple-200 overflow-x-auto select-text leading-relaxed">
                {tailwindCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
