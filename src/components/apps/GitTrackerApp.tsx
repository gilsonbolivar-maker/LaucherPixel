import React, { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, CheckCircle2, Clock, Play, RefreshCw, Terminal } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface GitTrackerAppProps {
  accentColor: string;
  soundEnabled: boolean;
}

export const GitTrackerApp: React.FC<GitTrackerAppProps> = ({ accentColor, soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<'commits' | 'branches' | 'ci'>('commits');
  const [activeBranch, setActiveBranch] = useState('main');
  const [isDeploying, setIsDeploying] = useState(false);

  const COMMITS = [
    {
      hash: '98f02ac',
      msg: 'feat: implement Material You developer widgets & telemetry',
      author: 'dev@pixel',
      time: '2 horas atrás',
      tag: 'v2.4.1',
    },
    {
      hash: '7a14e9f',
      msg: 'refactor: optimize touch response and Web Audio click synthesizer',
      author: 'dev@pixel',
      time: 'Ontem',
    },
    {
      hash: '4bc182d',
      msg: 'chore: configure AndroidManifest.xml HOME intent categories',
      author: 'octocat',
      time: '3 dias atrás',
    },
    {
      hash: '1df099a',
      msg: 'init: bootstrap DevOS Android Launcher architecture in Kotlin & Compose',
      author: 'dev@pixel',
      time: '5 dias atrás',
    },
  ];

  const PULL_REQUESTS = [
    { id: '#42', title: 'Android 15 Predictive Back Gestures', status: 'Merged', by: 'octocat' },
    { id: '#43', title: 'Monet Dynamic Theme extraction from Wallpaper', status: 'Reviewing', by: 'designer-dev' },
    { id: '#44', title: 'ADB Wireless fast-connect tile in Shade', status: 'Approved', by: 'lead-dev' },
  ];

  const triggerDeploy = () => {
    playHapticClick(soundEnabled);
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
    }, 1800);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      {/* Top Header */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold">DevOS Git &amp; Repos</h2>
            <p className="text-[10px] text-zinc-400">Branch ativa: <span className="text-emerald-400 font-mono">{activeBranch}</span></p>
          </div>
        </div>

        <button
          onClick={triggerDeploy}
          disabled={isDeploying}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow active:scale-95 transition-transform"
        >
          {isDeploying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isDeploying ? 'Deploying...' : 'Build CI/CD'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-2.5 bg-zinc-900/40 border-b border-zinc-800 space-x-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('commits')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'commits' ? 'border-pink-500 text-pink-400' : 'border-transparent text-zinc-500'
          }`}
        >
          Commits
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'branches' ? 'border-pink-500 text-pink-400' : 'border-transparent text-zinc-500'
          }`}
        >
          Pull Requests
        </button>
        <button
          onClick={() => setActiveTab('ci')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'ci' ? 'border-pink-500 text-pink-400' : 'border-transparent text-zinc-500'
          }`}
        >
          CI / Pipelines
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono">
        {activeTab === 'commits' && (
          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
            {COMMITS.map((c, i) => (
              <div key={i} className="flex items-start space-x-3 relative pl-1">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border-2 border-pink-500 flex items-center justify-center text-pink-400 z-10 flex-shrink-0">
                  <GitCommit className="w-3 h-3" />
                </div>
                <div className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl p-2.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="text-amber-400 font-bold">{c.hash}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-xs font-sans font-medium text-white mt-1">{c.msg}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500">
                    <span>{c.author}</span>
                    {c.tag && (
                      <span className="px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-700/60 font-mono">
                        {c.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="space-y-2.5 font-sans">
            <p className="text-xs font-semibold text-zinc-400">Pull Requests Abertos e Mergeados:</p>
            {PULL_REQUESTS.map((pr, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <GitPullRequest className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      <span className="text-purple-400">{pr.id}</span> {pr.title}
                    </p>
                    <p className="text-[10px] text-zinc-400">por {pr.by}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    pr.status === 'Merged'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {pr.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ci' && (
          <div className="space-y-2.5 font-mono text-xs">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pipeline #142 (main)</span>
                </span>
                <span className="text-emerald-400 font-bold text-[11px]">PASSED</span>
              </div>
              <div className="space-y-1 text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
                <p>✓ Run Unit Tests (342 tests) - 1.2s</p>
                <p>✓ Compile Android APK (Gradle assembleRelease) - 4.1s</p>
                <p>✓ Lint &amp; Security Scanners - 320ms</p>
                <p className="text-zinc-500">Deploy automático ativo via Cloud Run Container</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
