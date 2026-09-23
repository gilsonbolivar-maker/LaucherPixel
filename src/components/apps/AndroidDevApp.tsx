import React, { useState } from 'react';
import { Code, Copy, Check, Download, BookOpen, Smartphone, Layers, Terminal } from 'lucide-react';
import { KOTLIN_ANDROID_CODE } from '../../data/launcherData';
import { playHapticClick } from '../../utils/audio';

export const AndroidDevApp: React.FC<{ soundEnabled: boolean }> = ({ soundEnabled }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tutorial' | 'kotlin' | 'manifest'>('tutorial');

  const handleCopy = (text: string) => {
    playHapticClick(soundEnabled);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const manifestSnippet = `<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        
        <!-- Define o App como Tela Inicial (Launcher) -->
        <category android:name="android.intent.category.HOME" />
        <category android:name="android.intent.category.DEFAULT" />
    </intent-filter>
</activity>`;

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      {/* Top Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Guia Launcher Nativo</h2>
            <p className="text-[10px] text-zinc-400">Como criar no Android Studio (Kotlin)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/pixel-nexo-launcher.zip"
            download="pixel-nexo-launcher.zip"
            onClick={() => playHapticClick(soundEnabled)}
            className="flex items-center space-x-1.5 text-xs bg-[#23083B] border border-[#F5B942]/60 hover:bg-[#320c54] px-3 py-1.5 rounded-full text-[#F5B942] font-mono cursor-pointer transition-colors"
            title="Baixar projeto completo em ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar ZIP</span>
          </a>

          <button
            onClick={() => handleCopy(KOTLIN_ANDROID_CODE)}
            className="flex items-center space-x-1 text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-full text-zinc-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Tudo'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-3 border-b border-zinc-800/60 space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tutorial')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'tutorial' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500'
          }`}
        >
          Passo a Passo
        </button>
        <button
          onClick={() => setActiveTab('kotlin')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'kotlin' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500'
          }`}
        >
          MainActivity.kt
        </button>
        <button
          onClick={() => setActiveTab('manifest')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'manifest' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500'
          }`}
        >
          AndroidManifest.xml
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-zinc-300">
        {activeTab === 'tutorial' && (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-2xl p-3.5 text-emerald-300">
              <span className="font-bold block mb-1">Sim! É 100% possível criar um launcher para Android:</span>
              Você pode usá-lo tanto aqui nesta interface web/PWA interativa quanto compilar um aplicativo nativo em Kotlin usando o Android Studio!
            </div>

            <div className="space-y-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
                <span className="font-bold text-white text-sm">1. O Segredo: CATEGORY_HOME</span>
                <p className="text-zinc-400">
                  Para o sistema Android reconhecer seu aplicativo como Launcher, basta adicionar no seu
                  <code className="text-amber-400 font-mono mx-1">&lt;intent-filter&gt;</code> a categoria:
                </p>
                <div className="bg-black/80 rounded-xl p-2 font-mono text-[11px] text-emerald-400 my-1 overflow-x-auto">
                  &lt;category android:name=&quot;android.intent.category.HOME&quot; /&gt;
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
                <span className="font-bold text-white text-sm">2. Como Listar Apps Instalados</span>
                <p className="text-zinc-400">
                  Use o <code className="text-amber-400 font-mono mx-1">PackageManager</code> com a query de atividades para a ação
                  <code className="text-amber-400 font-mono mx-1">ACTION_MAIN</code> e categoria <code className="text-amber-400 font-mono mx-1">CATEGORY_LAUNCHER</code>.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
                <span className="font-bold text-white text-sm">3. Como Abrir Qualquer App</span>
                <p className="text-zinc-400">
                  Para abrir o app tocado pelo usuário:
                </p>
                <div className="bg-black/80 rounded-xl p-2 font-mono text-[11px] text-blue-400 my-1 overflow-x-auto">
                  val intent = context.packageManager.getLaunchIntentForPackage(packageName)<br />
                  context.startActivity(intent)
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-1">
                <span className="font-bold text-white text-sm">4. Como Definir como Padrão no Celular</span>
                <p className="text-zinc-400">
                  Vá em: <strong>Configurações do Android &gt; Aplicativos &gt; Aplicativos padrão &gt; App de início</strong> e selecione seu Launcher!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kotlin' && (
          <div className="space-y-2">
            <p className="text-zinc-400">Código Jetpack Compose para listar e iniciar aplicativos instalados:</p>
            <pre className="bg-black/90 p-3.5 rounded-2xl font-mono text-[11px] text-zinc-200 overflow-x-auto border border-zinc-800 leading-normal">
              {KOTLIN_ANDROID_CODE}
            </pre>
          </div>
        )}

        {activeTab === 'manifest' && (
          <div className="space-y-2">
            <p className="text-zinc-400">Trecho obrigatório no AndroidManifest.xml:</p>
            <pre className="bg-black/90 p-3.5 rounded-2xl font-mono text-[11px] text-emerald-400 overflow-x-auto border border-zinc-800 leading-normal">
              {manifestSnippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
