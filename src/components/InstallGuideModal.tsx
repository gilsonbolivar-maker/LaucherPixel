import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  Check,
  Copy,
  QrCode,
  Sparkles,
  ExternalLink,
  Layers,
  Terminal,
  ShieldCheck,
  Apple,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { playHapticClick } from '../utils/audio';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  soundEnabled = true,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa-android' | 'pwa-ios' | 'native-apk'>('pwa-android');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // App URL: Use current location or fallback
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-6ma2wuynovmczurcuujlru-81455012440.us-west2.run.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=F5B942&bgcolor=23083B&margin=10&data=${encodeURIComponent(
    shareUrl
  )}`;

  const handleCopyLink = () => {
    playHapticClick(soundEnabled);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleNativeInstallClick = async () => {
    playHapticClick(soundEnabled);
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-[#170524] border border-[#8022B8]/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden text-white flex flex-col max-h-[92vh]"
        >
          {/* Header Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#23083B] via-[#370d56] to-[#23083B] border-b border-[#8022B8]/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F5B942]/10 border border-[#F5B942]/60 flex items-center justify-center text-[#F5B942] shadow-[0_0_15px_rgba(245,185,66,0.25)]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                    Como Instalar no Celular
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5B942]/20 border border-[#F5B942]/50 text-[#F5B942] font-semibold">
                    PWA & APK
                  </span>
                </div>
                <p className="text-xs text-purple-300/80 font-sans">
                  Guia rápido para Android, iPhone e compilação nativa
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playHapticClick(soundEnabled);
                onClose();
              }}
              className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Install Bar (if browser supports 1-click install) */}
          {isInstallable && (
            <div className="mx-4 mt-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/50 flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-emerald-300">
                    Dispositivo Compatível com 1-Clique!
                  </p>
                  <p className="text-[11px] text-zinc-300">
                    Seu navegador suporta instalação imediata na tela inicial.
                  </p>
                </div>
              </div>
              <button
                onClick={handleNativeInstallClick}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs flex items-center space-x-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar Agora</span>
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#8022B8]/30 px-4 pt-3 bg-zinc-950/40 text-xs font-mono">
            <button
              onClick={() => {
                playHapticClick(soundEnabled);
                setActiveTab('pwa-android');
              }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'pwa-android'
                  ? 'border-[#F5B942] text-[#F5B942]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android (Chrome)</span>
            </button>

            <button
              onClick={() => {
                playHapticClick(soundEnabled);
                setActiveTab('pwa-ios');
              }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'pwa-ios'
                  ? 'border-[#F5B942] text-[#F5B942]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Apple className="w-3.5 h-3.5 text-zinc-300" />
              <span>iPhone (iOS Safari)</span>
            </button>

            <button
              onClick={() => {
                playHapticClick(soundEnabled);
                setActiveTab('native-apk');
              }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'native-apk'
                  ? 'border-[#F5B942] text-[#F5B942]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>APK Nativo (Kotlin)</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-sans">
            {/* TAB 1: Android PWA (Chrome) */}
            {activeTab === 'pwa-android' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Step 1 */}
                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#F5B942] text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-white text-xs">
                        Abra o link no celular
                      </h4>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Abra no <strong>Google Chrome</strong> do seu smartphone Android.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#F5B942] text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-white text-xs">
                        Toque no menu do Chrome
                      </h4>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Toque nos <strong>3 pontinhos verticais (⋮)</strong> no canto superior direito.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#F5B942] text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-white text-xs">
                        Instalar Aplicativo
                      </h4>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-emerald-300 text-xs">
                        Experiência Nativa Completa
                      </h4>
                      <p className="text-zinc-300 text-[11px] mt-0.5">
                        O ícone Pixel Nexo é adicionado à tela inicial e abre em tela cheia, sem barra de navegação!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scan QR Code Card */}
                <div className="p-3.5 rounded-2xl bg-[#23083B]/80 border border-[#8022B8]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-1.5 bg-[#170524] rounded-xl border border-[#8022B8]/80 shadow-inner shrink-0">
                      <img
                        src={qrUrl}
                        alt="QR Code para abrir no celular"
                        className="w-20 h-20 rounded-lg object-contain"
                        onError={(e) => {
                          // Fallback if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <QrCode className="w-3.5 h-3.5 text-[#F5B942]" />
                        <span className="font-mono font-bold text-white text-xs">
                          Escaneie com a Câmera do Celular
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[11px] mt-1">
                        Aponte a câmera do seu smartphone para o QR Code para abrir o launcher no seu aparelho imediatamente.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center justify-center space-x-2 border border-zinc-600 transition-colors shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Link Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#F5B942]" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: iPhone (iOS Safari) */}
            {activeTab === 'pwa-ios' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-white text-xs">
                        Abra no Safari
                      </h4>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        No iPhone/iPad, você deve utilizar o navegador nativo <strong>Safari</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-white text-xs">
                        Botão Compartilhar
                      </h4>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima na barra inferior).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-white text-xs">
                        Adicionar à Tela de Início
                      </h4>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Role a lista de opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 font-mono font-bold flex items-center justify-center shrink-0">
                      ✓
                    </span>
                    <div>
                      <h4 className="font-mono font-bold text-emerald-300 text-xs">
                        Confirmar e Concluir
                      </h4>
                      <p className="text-zinc-300 text-[11px] mt-0.5">
                        Toque em <strong>"Adicionar"</strong> no canto superior direito. O launcher abrirá em modo app!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Apple className="w-4 h-4 text-zinc-200" />
                    <span>Compatível com iOS 14, 15, 16, 17 e 18+</span>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-xl bg-[#F5B942]/10 border border-[#F5B942]/60 text-[#F5B942] font-mono font-bold text-xs flex items-center space-x-1.5 hover:bg-[#F5B942]/20 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copiado' : 'Copiar URL'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Native APK (Kotlin / Android Studio) */}
            {activeTab === 'native-apk' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-mono font-bold text-white text-xs">
                        Código-fonte Kotlin Android Incluído
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300">
                      Android 14+ (API 34)
                    </span>
                  </div>

                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    Este launcher inclui toda a arquitetura Kotlin para se registrar no Android como o <strong>Launcher padrão do sistema</strong> (<code>CATEGORY_HOME</code> e <code>CATEGORY_DEFAULT</code>).
                  </p>

                  <div className="space-y-2 text-[11px] font-mono text-zinc-300 bg-black/50 p-3 rounded-xl border border-zinc-800">
                    <div className="flex items-start space-x-2">
                      <span className="text-[#F5B942] font-bold">1.</span>
                      <span>Baixe o ZIP com os arquivos completos do projeto abaixo ou no botão do cabeçalho.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-[#F5B942] font-bold">2.</span>
                      <span>Abra a pasta <code>android-template/</code> no <strong>Android Studio</strong> ou importe para um projeto novo.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-[#F5B942] font-bold">3.</span>
                      <span>Os arquivos <code>MainActivity.kt</code> e <code>AndroidManifest.xml</code> já vêm prontos.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-[#F5B942] font-bold">4.</span>
                      <span>Execute <code>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</code> e instale no aparelho via USB ou ADB!</span>
                    </div>
                  </div>

                  {/* ZIP Download Card */}
                  <a
                    href="/pixel-nexo-launcher.zip"
                    download="pixel-nexo-launcher.zip"
                    onClick={() => playHapticClick(soundEnabled)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#23083B] to-[#3a0c5c] border border-[#F5B942] text-white hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(245,185,66,0.2)] group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F5B942]/20 border border-[#F5B942]/60 text-[#F5B942] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-[#F5B942]">
                          Baixar Arquivo ZIP do Projeto (.zip)
                        </p>
                        <p className="text-[10px] text-zinc-300">
                          Inclui código Kotlin Android, PWA, Assets e Guia (360 KB)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#F5B942] text-zinc-950 flex items-center space-x-1 shrink-0">
                      <span>Download</span>
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3.5 sm:p-4 bg-zinc-950 border-t border-[#8022B8]/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Funciona 100% offline via Service Worker &amp; Cache Web</span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <a
                href="/pixel-nexo-launcher.zip"
                download="pixel-nexo-launcher.zip"
                onClick={() => playHapticClick(soundEnabled)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 font-mono text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Baixar ZIP</span>
              </a>

              <button
                onClick={() => {
                  playHapticClick(soundEnabled);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-[#23083B] to-[#3b0d5c] border border-[#F5B942]/60 text-[#F5B942] font-mono font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
