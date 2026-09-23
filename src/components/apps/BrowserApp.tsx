import React, { useState } from 'react';
import { Search, Globe, ArrowLeft, ArrowRight, RotateCw, Home, ExternalLink } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

export const BrowserApp: React.FC<{ soundEnabled: boolean }> = ({ soundEnabled }) => {
  const [url, setUrl] = useState('https://google.com');
  const [inputUrl, setInputUrl] = useState('https://google.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (targetUrl: string) => {
    playHapticClick(soundEnabled);
    setIsLoading(true);
    let finalUrl = targetUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
    }
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setTimeout(() => setIsLoading(false), 400);
  };

  const bookmarks = [
    { name: 'Google', url: 'https://google.com', icon: '🔍' },
    { name: 'Android Dev', url: 'https://developer.android.com', icon: '🤖' },
    { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📖' },
  ];

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      {/* Top Address & Controls */}
      <div className="p-2 border-b border-zinc-800 bg-zinc-900 flex items-center space-x-2">
        <button
          onClick={() => handleNavigate('https://google.com')}
          className="p-1.5 rounded-full text-zinc-400 hover:text-white"
        >
          <Home className="w-4 h-4" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNavigate(inputUrl);
          }}
          className="flex-1 relative"
        >
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700/80 rounded-full py-1.5 pl-7 pr-7 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          <button
            type="button"
            onClick={() => handleNavigate(inputUrl)}
            className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </form>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-start bg-zinc-900/30">
        <div className="w-full max-w-sm space-y-6 pt-4 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-500 via-amber-400 to-emerald-500 mx-auto flex items-center justify-center shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">Google Chrome</h3>
            <p className="text-xs text-zinc-400">Navegação rápida e segura</p>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {bookmarks.map((bm, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigate(bm.url)}
                className="flex flex-col items-center space-y-1.5 p-2 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-95 transition-all"
              >
                <span className="text-2xl">{bm.icon}</span>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-full">{bm.name}</span>
              </button>
            ))}
          </div>

          {/* Simulated Web Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-left space-y-2 shadow">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Artigo em Destaque</span>
            <h4 className="text-sm font-semibold text-white">Como funcionam os Launchers no Android nativo</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No Android, qualquer aplicativo pode se tornar a tela inicial registrando a intent filter com
              <code className="text-amber-400 mx-1">CATEGORY_HOME</code> no AndroidManifest.xml.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
