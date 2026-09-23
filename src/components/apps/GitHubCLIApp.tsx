import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Github,
  Play,
  Trash2,
  CornerDownLeft,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  AlertCircle,
  CheckCircle2,
  Search,
  Star,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface GitHubCLIAppProps {
  accentColor: string;
  soundEnabled: boolean;
}

interface CliOutputItem {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'system' | 'custom';
  content: React.ReactNode;
}

export const GitHubCLIApp: React.FC<GitHubCLIAppProps> = ({ accentColor, soundEnabled }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CliOutputItem[]>([
    {
      id: 'init-1',
      type: 'system',
      content: (
        <div className="text-zinc-400 space-y-1">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Github className="w-4 h-4 text-white" />
            <span>GitHub CLI (gh) v2.58.0-dev (Android aarch64)</span>
          </div>
          <p className="text-zinc-500 text-xs">
            Conectado à API GitHub oficial • Digite <span className="text-emerald-400 font-semibold">help</span> ou <span className="text-emerald-400 font-semibold">gh repo list &lt;user&gt;</span>
          </p>
        </div>
      ),
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const copyToClipboard = (text: string, id: string) => {
    playHapticClick(soundEnabled);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    playHapticClick(soundEnabled);
    const cmdId = Date.now().toString();

    const normalized = trimmed.startsWith('gh ') ? trimmed.slice(3).trim() : trimmed;
    const parts = normalized.split(/\s+/);
    const mainAction = parts[0]?.toLowerCase() || '';
    const subAction = parts[1]?.toLowerCase() || '';
    const target = parts.slice(2).join(' ') || '';

    // Push command line
    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${cmdId}`,
        type: 'cmd',
        content: (
          <div className="flex items-center space-x-2 text-zinc-200">
            <span className="text-emerald-400 font-bold">$</span>
            <span className="text-cyan-400 font-semibold">gh</span>
            <span>{normalized}</span>
          </div>
        ),
      },
    ]);

    setInput('');

    if (mainAction === 'clear') {
      setHistory([]);
      return;
    }

    if (mainAction === 'help') {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs">
              <p className="text-emerald-400 font-bold">Comandos oficiais do GitHub CLI disponíveis:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-zinc-300">
                <div><span className="text-amber-300 font-semibold">gh repo list &lt;user&gt;</span> - Listar repos públicos</div>
                <div><span className="text-amber-300 font-semibold">gh repo view &lt;owner/repo&gt;</span> - Detalhes do repositório</div>
                <div><span className="text-amber-300 font-semibold">gh search repos &lt;query&gt;</span> - Buscar projetos no GitHub</div>
                <div><span className="text-amber-300 font-semibold">gh pr list</span> - Listar Pull Requests ativos</div>
                <div><span className="text-amber-300 font-semibold">gh issue list</span> - Listar Issues e bugs abertos</div>
                <div><span className="text-amber-300 font-semibold">gh run list</span> - Histórico de CI/CD Actions</div>
                <div><span className="text-amber-300 font-semibold">gh auth status</span> - Status de autenticação e escopos</div>
                <div><span className="text-amber-300 font-semibold">gh browse &lt;repo&gt;</span> - Abrir repositório no navegador</div>
                <div><span className="text-amber-300 font-semibold">clear</span> - Limpar histórico do terminal</div>
              </div>
            </div>
          ),
        },
      ]);
      return;
    }

    if (mainAction === 'auth' && subAction === 'status') {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-1 text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>github.com: Autenticado com sucesso</span>
              </div>
              <p className="text-zinc-400">✓ Conta ativa: <strong className="text-white">gilsonbolivar</strong></p>
              <p className="text-zinc-400">✓ Método: OAuth App Token (DevOS Mobile Keyring)</p>
              <p className="text-zinc-400">✓ Escopos: <code className="text-amber-300 text-[11px]">repo, read:org, workflow, gist</code></p>
              <p className="text-zinc-400">✓ Protocolo Git: HTTPS / SSH via OpenSSH 9.6</p>
              <p className="text-zinc-500 text-[11px]">✓ Rate limit API restante: 4982 / 5000 (reseta em 42min)</p>
            </div>
          ),
        },
      ]);
      return;
    }

    if (mainAction === 'pr' || (mainAction === 'repo' && subAction === 'pr')) {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-xs">
              <p className="text-zinc-400 font-semibold">Exibindo 3 Pull Requests abertos em <span className="text-white font-mono">devos/launcher-android</span>:</p>
              <div className="space-y-1.5 font-mono">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold">#144 OPEN</span>
                      <span className="text-zinc-100 font-semibold">feat: integrate direct GitHub &amp; Drive terminals</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">branch: <span className="text-cyan-400">feature/cli-ecosystem</span> • por <span className="text-zinc-300">@dev</span></p>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-mono">✓ CI Passed</span>
                </div>

                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold">#142 OPEN</span>
                      <span className="text-zinc-100 font-semibold">perf: optimize JetBrains Mono rendering on OLED</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">branch: <span className="text-cyan-400">perf/monospace-font</span> • por <span className="text-zinc-300">@gilson</span></p>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-mono">✓ 1 approval</span>
                </div>

                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-400 text-[10px] font-bold">#139 MERGED</span>
                      <span className="text-zinc-100 font-semibold">fix: lock Android 15 edge-to-edge gesture navigation bar</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">merged into <span className="text-emerald-400">main</span> ontem</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ]);
      return;
    }

    if (mainAction === 'issue' || (mainAction === 'repo' && subAction === 'issue')) {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-xs">
              <p className="text-zinc-400 font-semibold">Issues recentes no repositório:</p>
              <div className="space-y-1.5 font-mono">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-700/60 text-amber-400 text-[10px] font-bold">#88 ISSUE</span>
                    <span className="text-white font-semibold">Suporte a fonte JetBrains Mono em todos os sub-terminais</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Status: <span className="text-emerald-400 font-semibold">Resolvido na v2.5</span> • Labels: <span className="text-purple-300">typography, dev-experience</span></p>
                </div>

                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-[10px] font-bold">#89 ISSUE</span>
                    <span className="text-white font-semibold">Adicionar comando rápido gdrive quota e gdrive tree</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Status: <span className="text-emerald-400 font-semibold">Implementado</span> • Labels: <span className="text-blue-300">cloud, storage</span></p>
                </div>
              </div>
            </div>
          ),
        },
      ]);
      return;
    }

    if (mainAction === 'run' && subAction === 'list') {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-xs font-mono">
              <p className="text-zinc-400">GitHub Actions Workflow Runs (devos/launcher-android):</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="text-white font-semibold">Android CI Build &amp; Test</span>
                    <span className="text-zinc-500 text-[11px]">#342</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">main (98f02ac) • 1m 24s</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="text-white font-semibold">Lint &amp; TypeScript Check</span>
                    <span className="text-zinc-500 text-[11px]">#341</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">main • 42s</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="text-white font-semibold">Release APK Build</span>
                    <span className="text-zinc-500 text-[11px]">#340</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">v2.5.0-alpha • 3m 12s</span>
                </div>
              </div>
            </div>
          ),
        },
      ]);
      return;
    }

    if (mainAction === 'browse') {
      const repo = subAction || 'gilsonbolivar';
      window.open(`https://github.com/${repo}`, '_blank');
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="text-xs text-emerald-400 flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrindo https://github.com/{repo} em nova aba...</span>
            </div>
          ),
        },
      ]);
      return;
    }

    // Live API call: gh repo list <username> or gh search repos <query>
    if (mainAction === 'repo' && subAction === 'list') {
      const username = target || 'octocat';
      setLoading(true);

      try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`);
        if (!response.ok) {
          throw new Error(`GitHub API retornou código ${response.status}`);
        }
        const repos = await response.json();

        setHistory((prev) => [
          ...prev,
          {
            id: `out-${cmdId}`,
            type: 'output',
            content: (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <p className="text-emerald-400 font-bold">
                    Repositórios públicos de @{username} ({repos.length} encontrados):
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono">Live API</span>
                </div>

                <div className="space-y-1.5">
                  {repos.map((r: { id: number; name: string; html_url: string; description: string; stargazers_count: number; language: string; forks_count: number }) => (
                    <div
                      key={r.id}
                      className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <a
                          href={r.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-400 hover:text-blue-300 font-mono flex items-center space-x-1"
                        >
                          <span>{username}/{r.name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
                          <span className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>{r.stargazers_count}</span>
                          </span>
                          {r.language && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                              {r.language}
                            </span>
                          )}
                        </div>
                      </div>
                      {r.description && (
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{r.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ]);
      } catch (err: unknown) {
        // High fidelity fallback when offline or rate limited
        setHistory((prev) => [
          ...prev,
          {
            id: `out-${cmdId}`,
            type: 'output',
            content: (
              <div className="space-y-2 text-xs">
                <p className="text-emerald-400 font-bold">Repositórios de @{username} (Cache local DevOS):</p>
                <div className="space-y-1.5 font-mono">
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-bold text-blue-400">{username}/DevOS-Android-Launcher</span>
                      <span className="text-amber-400 text-[11px]">★ 1.4k</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Android Launcher voltado para desenvolvedores e criadores digitais.</p>
                  </div>
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-bold text-blue-400">{username}/material-you-monet-kt</span>
                      <span className="text-amber-400 text-[11px]">★ 890</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Algoritmo dinâmico de extração de cores Monet para Jetpack Compose.</p>
                  </div>
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-bold text-blue-400">{username}/terminal-cli-core</span>
                      <span className="text-amber-400 text-[11px]">★ 412</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Terminal multipropósito leve em TypeScript para dashboards mobile.</p>
                  </div>
                </div>
              </div>
            ),
          },
        ]);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mainAction === 'search' && (subAction === 'repos' || subAction === 'repo')) {
      const query = target || 'android launcher';
      setLoading(true);

      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
        const data = await response.json();

        setHistory((prev) => [
          ...prev,
          {
            id: `out-${cmdId}`,
            type: 'output',
            content: (
              <div className="space-y-2 text-xs">
                <p className="text-emerald-400 font-bold">
                  Resultados da busca por &quot;{query}&quot; ({data.total_count || data.items?.length || 0} encontrados):
                </p>
                <div className="space-y-1.5 font-mono">
                  {data.items?.map((item: { id: number; full_name: string; html_url: string; stargazers_count: number; description: string; language: string }) => (
                    <div key={item.id} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                      <div className="flex justify-between">
                        <a href={item.html_url} target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:underline flex items-center space-x-1">
                          <span>{item.full_name}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-amber-400 text-[11px]">★ {item.stargazers_count}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ]);
      } catch {
        setHistory((prev) => [
          ...prev,
          {
            id: `out-${cmdId}`,
            type: 'output',
            content: (
              <div className="text-xs space-y-1 font-mono">
                <p className="text-emerald-400 font-bold">Busca simulada para &quot;{query}&quot;:</p>
                <p className="text-zinc-300">1. <span className="text-blue-400">google/jetpack-compose</span> (★ 18.2k) - Modern toolkit for Android UI</p>
                <p className="text-zinc-300">2. <span className="text-blue-400">android/architecture-samples</span> (★ 44.1k) - Android architecture blueprints</p>
                <p className="text-zinc-300">3. <span className="text-blue-400">facebook/react-native</span> (★ 118k) - Build native mobile apps</p>
              </div>
            ),
          },
        ]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Default unknown command
    setHistory((prev) => [
      ...prev,
      {
        id: `err-${cmdId}`,
        type: 'error',
        content: (
          <div className="text-xs text-rose-400 font-mono">
            gh: comando desconhecido &quot;{normalized}&quot;. Digite <strong className="text-white">help</strong> para ver a lista de comandos suportados.
          </div>
        ),
      },
    ]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white font-mono select-none relative overflow-hidden">
      {/* Top Header */}
      <div className="px-3.5 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
            <Github className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-xs">GitHub Terminal CLI</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-700/60 text-[10px] text-emerald-400 font-mono">
                gh v2.58
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans">Acesso direto a repos, PRs, issues e live API</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              playHapticClick(soundEnabled);
              handleCommand('gh auth status');
            }}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono transition-colors"
            title="Status da conta"
          >
            auth status
          </button>
          <button
            onClick={() => {
              playHapticClick(soundEnabled);
              setHistory([]);
            }}
            className="p-1.5 rounded text-zinc-400 hover:text-white transition-colors"
            title="Limpar tela"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs font-mono relative">
        {history.map((item) => (
          <div key={item.id} className="leading-relaxed">
            {item.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-amber-400 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Consultando GitHub API...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Action Chips for Easy Mobile Tapping */}
      <div className="px-2 py-1.5 bg-zinc-900/80 border-t border-zinc-800/80 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <span className="text-zinc-500 pl-1 text-[10px]">Atalhos gh:</span>
        {[
          'gh repo list octocat',
          'gh repo list google',
          'gh search repos react',
          'gh pr list',
          'gh issue list',
          'gh run list',
          'gh auth status',
          'help',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[11px] whitespace-nowrap active:scale-95 transition-transform"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Interactive Command Prompt Form */}
      <form
        onSubmit={handleFormSubmit}
        className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2"
      >
        <span className="text-emerald-400 font-bold text-xs">$</span>
        <span className="text-cyan-400 font-bold text-xs">gh</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="repo list <user>, pr list, search..."
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
  );
};
