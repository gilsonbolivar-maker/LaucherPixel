import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  CornerDownLeft,
  Github,
  HardDrive,
} from 'lucide-react';
import { playHapticClick } from '../../utils/audio';
import { GitHubCLIApp } from './GitHubCLIApp';
import { GDriveCLIApp } from './GDriveCLIApp';
import { EnvironmentId } from '../../types';

interface TerminalAppProps {
  accentColor: string;
  soundEnabled: boolean;
  initialTab?: 'bash' | 'gh' | 'gdrive';
  activeEnvironmentId?: EnvironmentId;
  onSwitchEnvironment?: (envId: EnvironmentId) => void;
}

interface CommandHistoryItem {
  type: 'cmd' | 'output' | 'error' | 'system';
  content: string | React.ReactNode;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({
  accentColor,
  soundEnabled,
  initialTab = 'bash',
  activeEnvironmentId,
  onSwitchEnvironment,
}) => {
  const [activeTab, setActiveTab] = useState<'bash' | 'gh' | 'gdrive'>(initialTab);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      type: 'system',
      content: 'Pixel Nexo OS Terminal v2.5.0 (Linux aarch64 Android 15)',
    },
    {
      type: 'system',
      content: 'Acesso direto integrado: Bash, GitHub CLI (gh), Google Drive (gdrive) e Pixel Nexo (nexo).',
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    playHapticClick(soundEnabled);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newHistory: CommandHistoryItem[] = [
      ...history,
      { type: 'cmd', content: trimmed },
    ];

    const lower = trimmed.toLowerCase();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    switch (command) {
      case 'help':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-1 text-zinc-300">
              <p className="text-emerald-400 font-semibold">Comandos DevOS disponíveis:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-[#F5B942]">nexo</span> <span>Identidade &amp; Cores Pixel Nexo</span>
                <span className="text-purple-400">env [nome]</span> <span>Abas de Fichário / Ambientes</span>
                <span className="text-amber-300">gh [cmd]</span> <span>Acessar GitHub CLI Terminal</span>
                <span className="text-amber-300">gdrive [cmd]</span> <span>Acessar Google Drive Terminal</span>
                <span className="text-amber-300">neofetch</span> <span>Info do sistema e specs</span>
                <span className="text-amber-300">git status</span> <span>Status da branch ativa</span>
                <span className="text-amber-300">git log</span> <span>Últimos commits</span>
                <span className="text-amber-300">npm run dev</span> <span>Testar boot do servidor</span>
                <span className="text-amber-300">eval &lt;js&gt;</span> <span>Executar JavaScript</span>
                <span className="text-amber-300">curl &lt;url&gt;</span> <span>Requisição HTTP rápida</span>
                <span className="text-amber-300">matrix</span> <span>Chuva de código Matrix</span>
                <span className="text-amber-300">adb devices</span> <span>Dispositivos em debug</span>
                <span className="text-amber-300">ls</span> <span>Listar repositórios locais</span>
                <span className="text-amber-300">clear</span> <span>Limpar tela</span>
              </div>
            </div>
          ),
        });
        break;

      case 'nexo':
      case 'pixel-nexo':
        newHistory.push({
          type: 'output',
          content: (
            <div className="p-3 my-1 rounded-2xl bg-[#23083B] border border-[#8022B8] text-xs font-mono space-y-2">
              <div className="flex items-center space-x-3">
                <pre className="text-[#F5B942] font-bold leading-tight select-none">
{`   /\\
  /  \\   ■■■
 | *  |  ■■■
  \\  /   ■■■
   \\/`}
                </pre>
                <div>
                  <p className="text-white font-bold text-sm tracking-wider">PIXEL <span className="text-[#F5B942]">NEXO</span></p>
                  <p className="text-purple-300 text-[11px]">Sistema &amp; Identidade Visual Oficial</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#8022B8]/40">
                <div><span className="text-[#F5B942]">Pixel Gold:</span> #F5B942</div>
                <div><span className="text-purple-400">Deep Violet:</span> #23083B</div>
                <div><span className="text-purple-400">Neon Border:</span> #8022B8</div>
                <div><span className="text-white">Pixel White:</span> #FFFFFF</div>
              </div>
            </div>
          ),
        });
        break;

      case 'gh':
      case 'github':
        setActiveTab('gh');
        return;

      case 'gdrive':
      case 'drive':
        setActiveTab('gdrive');
        return;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'neofetch':
        newHistory.push({
          type: 'output',
          content: (
            <div className="flex items-start space-x-4 text-xs font-mono py-1">
              <pre className="text-[#F5B942] font-bold leading-tight select-none">
{`    /\\    ■■■
   /  \\   ■■■
  | *  |  ■■■
   \\  /  
    \\/   
PIXEL NEXO`}
              </pre>
              <div className="space-y-0.5 text-zinc-300">
                <p><span className="text-[#F5B942] font-bold">dev</span>@<span className="text-purple-400">pixel-nexo-android</span></p>
                <p className="text-[#8022B8]">-------------------------</p>
                <p><span className="text-[#F5B942] font-semibold">OS:</span> Pixel Nexo Android 15 (Material You)</p>
                <p><span className="text-[#F5B942] font-semibold">Brand:</span> Pixel Nexo (Violet &amp; Gold)</p>
                <p><span className="text-[#F5B942] font-semibold">Kernel:</span> Linux 6.6.21-nexo-aarch64</p>
                <p><span className="text-[#F5B942] font-semibold">Launcher:</span> Jetpack Compose 1.7.0</p>
                <p><span className="text-[#F5B942] font-semibold">Node.js:</span> v22.14.0 LTS</p>
                <p><span className="text-[#F5B942] font-semibold">Memory:</span> 4820MiB / 8192MiB (58%)</p>
                <p><span className="text-[#F5B942] font-semibold">CLI Shell:</span> zsh 5.9 (nexo-term)</p>
              </div>
            </div>
          ),
        });
        break;

      case 'git':
        if (args === 'status' || !args) {
          newHistory.push({
            type: 'output',
            content: (
              <div className="space-y-1 text-xs font-mono">
                <p className="text-emerald-400 font-bold">On branch main</p>
                <p className="text-zinc-400">Your branch is up to date with &apos;origin/main&apos;.</p>
                <p className="text-zinc-300 mt-1">Changes not staged for commit:</p>
                <p className="text-amber-400 pl-2">modified: src/components/Launcher.kt</p>
                <p className="text-emerald-400 pl-2">untracked: src/ui/MonetPalette.ts</p>
                <p className="text-zinc-500 text-[11px] mt-1">no changes added to commit (use &quot;git add&quot; to stage)</p>
              </div>
            ),
          });
        } else if (args === 'log') {
          newHistory.push({
            type: 'output',
            content: (
              <div className="space-y-1.5 text-xs font-mono">
                <div>
                  <p className="text-amber-400">commit 98f02ac34 (HEAD -&gt; main, origin/main)</p>
                  <p className="text-zinc-400 text-[11px]">Author: dev &lt;dev@pixel.internal&gt; - 2 hours ago</p>
                  <p className="text-zinc-200">feat: implement adaptive Material You icon shapes &amp; haptic</p>
                </div>
                <div>
                  <p className="text-amber-400">commit 7a14e9f12</p>
                  <p className="text-zinc-400 text-[11px]">Author: dev &lt;dev@pixel.internal&gt; - 1 day ago</p>
                  <p className="text-zinc-200">refactor: optimize app drawer search and grid recycling</p>
                </div>
              </div>
            ),
          });
        } else {
          newHistory.push({
            type: 'output',
            content: `git: comando "${args}" simulado com sucesso. Repositório sincronizado.`,
          });
        }
        break;

      case 'npm':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono">
              <p className="text-blue-400">&gt; devos-app@2.4.0 dev</p>
              <p className="text-zinc-300">&gt; vite --host 0.0.0.0 --port 3000</p>
              <p className="text-emerald-400 font-bold mt-1">VITE v6.2.3  ready in 142 ms</p>
              <p className="text-zinc-300">➜  Local:   <span className="text-cyan-400 underline">http://localhost:3000/</span></p>
              <p className="text-zinc-300">➜  Network: <span className="text-cyan-400 underline">http://192.168.1.104:3000/</span></p>
              <p className="text-zinc-500">press h + enter to show help</p>
            </div>
          ),
        });
        break;

      case 'eval':
        if (!args) {
          newHistory.push({ type: 'error', content: 'Uso: eval <expressão javascript>' });
        } else {
          try {
            // eslint-disable-next-line no-eval
            const result = eval(args);
            newHistory.push({
              type: 'output',
              content: (
                <div className="text-xs font-mono">
                  <span className="text-emerald-400">&lt;= </span>
                  <span className="text-white">{typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}</span>
                </div>
              ),
            });
          } catch (err: unknown) {
            newHistory.push({
              type: 'error',
              content: `Erro de execução: ${(err as Error).message}`,
            });
          }
        }
        break;

      case 'matrix':
        setIsMatrixActive(!isMatrixActive);
        newHistory.push({
          type: 'output',
          content: !isMatrixActive ? 'Iniciando efeito Matrix Rain...' : 'Efeito Matrix desativado.',
        });
        break;

      case 'adb':
        newHistory.push({
          type: 'output',
          content: (
            <div className="text-xs font-mono space-y-1">
              <p className="text-zinc-300">List of devices attached</p>
              <p className="text-emerald-400">emulator-5554        device (Pixel 8 Pro - API 35)</p>
              <p className="text-cyan-400">192.168.1.104:5555   device (Wi-Fi ADB Debugging)</p>
            </div>
          ),
        });
        break;

      case 'ls':
        newHistory.push({
          type: 'output',
          content: (
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <span className="text-blue-400 font-bold">src/</span>
              <span className="text-blue-400 font-bold">android/</span>
              <span className="text-blue-400 font-bold">gradle/</span>
              <span className="text-zinc-300">package.json</span>
              <span className="text-zinc-300">tsconfig.json</span>
              <span className="text-zinc-300">README.md</span>
              <span className="text-amber-400">AndroidManifest.xml</span>
              <span className="text-purple-400">server.ts</span>
              <span className="text-emerald-400">vite.config.ts</span>
            </div>
          ),
        });
        break;

      case 'curl':
        newHistory.push({
          type: 'output',
          content: (
            <div className="text-xs font-mono space-y-1">
              <p className="text-zinc-400">HTTP/2 200 OK</p>
              <p className="text-zinc-500">content-type: application/json; charset=utf-8</p>
              <pre className="text-emerald-300 bg-zinc-900 p-2 rounded mt-1 overflow-x-auto">
{`{
  "status": "online",
  "endpoint": "${args || 'https://api.devos.internal/v1/health'}",
  "latencyMs": 28,
  "service": "DevLauncher Host Core",
  "timestamp": "${new Date().toISOString()}"
}`}
              </pre>
            </div>
          ),
        });
        break;

      case 'env':
      case 'ambiente':
        if (!args || args === 'list' || args === 'ls') {
          newHistory.push({
            type: 'output',
            content: (
              <div className="space-y-2 text-xs font-mono py-1">
                <p className="text-purple-400 font-bold">Abas de Fichário (Ambientes Pixel Nexo):</p>
                <div className="grid grid-cols-1 gap-1">
                  <div className="p-1.5 rounded bg-purple-950/60 border border-purple-800/60 flex items-center justify-between">
                    <span className="text-[#F5B942] font-bold">1. nexo</span>
                    <span className="text-zinc-300">Pixel Nexo Studio (Identidade &amp; Cores)</span>
                    <span className="text-[10px] text-purple-300">#F5B942</span>
                  </div>
                  <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between">
                    <span className="text-emerald-400 font-bold">2. dev</span>
                    <span className="text-zinc-300">Workspace de Código &amp; CLI</span>
                    <span className="text-[10px] text-emerald-300">#10b981</span>
                  </div>
                  <div className="p-1.5 rounded bg-blue-950/60 border border-blue-800/60 flex items-center justify-between">
                    <span className="text-blue-400 font-bold">3. work</span>
                    <span className="text-zinc-300">Produtividade &amp; Workspace</span>
                    <span className="text-[10px] text-blue-300">#3b82f6</span>
                  </div>
                  <div className="p-1.5 rounded bg-pink-950/60 border border-pink-800/60 flex items-center justify-between">
                    <span className="text-pink-400 font-bold">4. social</span>
                    <span className="text-zinc-300">Social, Mensagens &amp; Câmera</span>
                    <span className="text-[10px] text-pink-300">#ec4899</span>
                  </div>
                  <div className="p-1.5 rounded bg-amber-950/60 border border-amber-800/60 flex items-center justify-between">
                    <span className="text-amber-400 font-bold">5. ops</span>
                    <span className="text-zinc-300">SysAdmin, Monitor &amp; ADB</span>
                    <span className="text-[10px] text-amber-300">#f59e0b</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Use <span className="text-purple-300">env &lt;nome&gt;</span> ou clique nas abas laterais do celular.
                </p>
              </div>
            ),
          });
        } else {
          const rawArg = args.toLowerCase().trim();
          let targetId: EnvironmentId | undefined;
          if (rawArg === 'nexo' || rawArg === 'pixel-nexo') targetId = 'nexo';
          else if (rawArg === 'dev' || rawArg === 'desenvolvedor') targetId = 'dev';
          else if (rawArg === 'work' || rawArg === 'trabalho') targetId = 'work';
          else if (rawArg === 'social' || rawArg === 'pessoal' || rawArg === 'personal') targetId = 'personal';
          else if (rawArg === 'ops' || rawArg === 'sysops') targetId = 'ops';

          if (targetId) {
            if (onSwitchEnvironment) {
              onSwitchEnvironment(targetId);
            }
            newHistory.push({
              type: 'system',
              content: `Virando página do fichário para o ambiente [${targetId.toUpperCase()}]...`,
            });
          } else {
            newHistory.push({
              type: 'error',
              content: `Ambiente "${args}" desconhecido. Válidos: nexo, dev, work, social (ou personal), ops.`,
            });
          }
        }
        break;

      case 'install':
      case 'instalar':
      case 'pwa':
      case 'apk':
        newHistory.push({
          type: 'output',
          content: (
            <div className="space-y-2 text-xs font-mono py-1">
              <p className="text-[#F5B942] font-bold">Instalação no Celular (Pixel Nexo DevOS):</p>
              <div className="p-2 rounded bg-purple-950/40 border border-purple-800/60 space-y-1 text-zinc-300">
                <p className="text-white font-semibold">1. Android (Google Chrome):</p>
                <p className="text-[11px] text-zinc-400 pl-2">
                  Abra o link no Chrome, toque em <span className="text-[#F5B942]">Menu (⋮) &gt; Instalar aplicativo</span>.
                </p>
                <p className="text-white font-semibold pt-1">2. iPhone (iOS Safari):</p>
                <p className="text-[11px] text-zinc-400 pl-2">
                  Abra no Safari, toque em <span className="text-[#F5B942]">Compartilhar (⎋) &gt; Adicionar à Tela de Início</span>.
                </p>
                <p className="text-white font-semibold pt-1">3. APK Nativo (Android Studio):</p>
                <p className="text-[11px] text-zinc-400 pl-2">
                  Abra o app "Código Kotlin", compile com <span className="text-emerald-400">./gradlew assembleDebug</span> e instale via ADB.
                </p>
              </div>
            </div>
          ),
        });
        break;

      default:
        newHistory.push({
          type: 'error',
          content: `devos: comando não encontrado: "${command}". Digite "help" para obter auxílio.`,
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white font-mono select-none relative overflow-hidden">
      {/* Matrix rain background effect toggle */}
      {isMatrixActive && (
        <div className="absolute inset-0 opacity-15 pointer-events-none z-0 overflow-hidden text-emerald-500 text-[10px] leading-tight select-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                position: 'absolute',
                left: `${(i / 40) * 100}%`,
                top: `${(i % 10) * 10}%`,
              }}
            >
              01011001011010101010100101010101010101010101
            </div>
          ))}
        </div>
      )}

      {/* Sub-terminal Tab Switcher */}
      <div className="flex items-center px-2 pt-2 bg-zinc-900 border-b border-zinc-800 text-xs relative z-20 space-x-1 overflow-x-auto">
        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setActiveTab('bash');
          }}
          className={`px-3 py-1.5 rounded-t-lg font-mono flex items-center space-x-1.5 transition-colors border-t-2 ${
            activeTab === 'bash'
              ? 'bg-zinc-950 border-emerald-400 text-emerald-400 font-bold'
              : 'bg-zinc-900/60 border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>DevOS Bash</span>
        </button>

        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setActiveTab('gh');
          }}
          className={`px-3 py-1.5 rounded-t-lg font-mono flex items-center space-x-1.5 transition-colors border-t-2 ${
            activeTab === 'gh'
              ? 'bg-zinc-950 border-blue-400 text-blue-400 font-bold'
              : 'bg-zinc-900/60 border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub CLI</span>
        </button>

        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setActiveTab('gdrive');
          }}
          className={`px-3 py-1.5 rounded-t-lg font-mono flex items-center space-x-1.5 transition-colors border-t-2 ${
            activeTab === 'gdrive'
              ? 'bg-zinc-950 border-amber-400 text-amber-400 font-bold'
              : 'bg-zinc-900/60 border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Google Drive</span>
        </button>
      </div>

      {activeTab === 'gh' && (
        <div className="flex-1 overflow-hidden">
          <GitHubCLIApp accentColor={accentColor} soundEnabled={soundEnabled} />
        </div>
      )}

      {activeTab === 'gdrive' && (
        <div className="flex-1 overflow-hidden">
          <GDriveCLIApp accentColor={accentColor} soundEnabled={soundEnabled} />
        </div>
      )}

      {activeTab === 'bash' && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Terminal Top Info */}
          <div className="px-4 py-2 border-b border-zinc-850 bg-zinc-900/90 flex items-center justify-between text-xs text-zinc-400 relative z-10">
            <div className="flex items-center space-x-2">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-zinc-200">dev@pixel: ~</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-[10px] text-emerald-400 font-mono">
                git:main
              </span>
            </div>
            <button
              onClick={() => {
                playHapticClick(soundEnabled);
                setHistory([]);
              }}
              className="p-1 hover:text-zinc-200 transition-colors"
              title="Limpar tela"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Output Console Log Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs relative z-10 font-mono">
            {history.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                {item.type === 'cmd' && (
                  <div className="flex items-center space-x-2 text-zinc-200 font-semibold">
                    <span className="text-emerald-400">➜</span>
                    <span className="text-cyan-400">~</span>
                    <span>{item.content}</span>
                  </div>
                )}
                {item.type === 'output' && (
                  <div className="pl-4 text-zinc-300">{item.content}</div>
                )}
                {item.type === 'error' && (
                  <div className="pl-4 text-rose-400 font-semibold">{item.content}</div>
                )}
                {item.type === 'system' && (
                  <div className="text-zinc-500 italic">{item.content}</div>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick Dev Action Buttons for Phone Ergonomics */}
          <div className="px-2 py-1.5 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center space-x-1.5 overflow-x-auto text-[11px] relative z-10 font-mono">
            <span className="text-zinc-500 pl-1 text-[10px]">Atalhos:</span>
            {['gh', 'gdrive', 'neofetch', 'git status', 'npm run dev', 'adb devices', 'matrix', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] whitespace-nowrap active:scale-95 transition-transform"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Input Prompt Form */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2 relative z-10"
          >
            <span className="text-emerald-400 font-bold text-xs">➜</span>
            <span className="text-cyan-400 font-bold text-xs">~</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite um comando ou gh, gdrive..."
              className="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none placeholder-zinc-600"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
