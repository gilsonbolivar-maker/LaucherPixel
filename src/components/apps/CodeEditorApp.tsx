import React, { useState } from 'react';
import { Play, Copy, Check, FileCode, RotateCcw, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface CodeEditorAppProps {
  accentColor: string;
  soundEnabled: boolean;
}

interface FileSnippet {
  id: string;
  name: string;
  lang: 'kotlin' | 'typescript' | 'css' | 'json';
  code: string;
}

const DEFAULT_FILES: FileSnippet[] = [
  {
    id: '1',
    name: 'MainActivity.kt',
    lang: 'kotlin',
    code: `package com.devos.launcher

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // DevOS Home Launcher initialization
        setContent {
            MaterialTheme {
                DevLauncherScreen(
                    devMode = true,
                    adbDebug = true
                )
            }
        }
    }
}`,
  },
  {
    id: '2',
    name: 'useLauncher.ts',
    lang: 'typescript',
    code: `// DevOS Hook: Real-time telemetry & git branch state
export function useDevTelemetry() {
  const heapUsage = 0.58;
  const fps = 60;
  const activeBranch = "main";
  
  return {
    isHealthy: true,
    fps,
    memoryMb: Math.round(heapUsage * 8192),
    branch: activeBranch,
    status: "200 OK"
  };
}`,
  },
  {
    id: '3',
    name: 'monet-theme.css',
    lang: 'css',
    code: `:root {
  --color-primary-dev: #10B981;
  --color-surface-ide: #09090b;
  --color-code-keyword: #f43f5e;
  --color-code-string: #10b981;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}`,
  },
];

export const CodeEditorApp: React.FC<CodeEditorAppProps> = ({ accentColor, soundEnabled }) => {
  const [files, setFiles] = useState<FileSnippet[]>(DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [copied, setCopied] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const handleCodeChange = (newCode: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, code: newCode } : f))
    );
  };

  const handleCopy = () => {
    playHapticClick(soundEnabled);
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    playHapticClick(soundEnabled);
    setIsRunning(true);
    setRunOutput('Compilando e executando...');

    setTimeout(() => {
      if (activeFile.lang === 'typescript') {
        try {
          // Safe evaluation of return statement
          setRunOutput(`> Saída de execução:
{
  "isHealthy": true,
  "fps": 60,
  "memoryMb": 4751,
  "branch": "main",
  "status": "200 OK"
}
[Processo concluído com código de saída 0 em 48ms]`);
        } catch (e: unknown) {
          setRunOutput(`Erro: ${(e as Error).message}`);
        }
      } else if (activeFile.lang === 'kotlin') {
        setRunOutput(`[Kotlinc 2.0.20 Target: ART JVM 21]
BUILD SUCCESSFUL in 1.4s
1 actionable task: 1 executed
> Executando com.devos.launcher.MainActivity
✓ DevLauncherScreen inicializado com tema Material You & ADB Debug ativo.`);
      } else {
        setRunOutput(`[CSS Validator]
Tokens validados sem avisos.
Variáveis customizadas exportadas para o tema do DevOS.`);
      }
      setIsRunning(false);
    }, 450);
  };

  const lineCount = activeFile.code.split('\n').length;

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white font-mono select-none">
      {/* File Tabs */}
      <div className="flex items-center px-2 pt-2 bg-zinc-900 border-b border-zinc-800/80 space-x-1 overflow-x-auto text-xs">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => {
              playHapticClick(soundEnabled);
              setActiveFileId(file.id);
              setRunOutput(null);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg transition-colors border-t-2 ${
              file.id === activeFileId
                ? 'bg-zinc-950 border-emerald-400 text-white font-semibold'
                : 'bg-zinc-900/60 border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[100px]">{file.name}</span>
          </button>
        ))}
      </div>

      {/* Editor Toolbar */}
      <div className="px-3 py-2 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-zinc-400 text-[11px]">
          <span className="uppercase text-emerald-400 font-bold">{activeFile.lang}</span>
          <span>•</span>
          <span>{lineCount} linhas</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Copiar código"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-transform active:scale-95"
            title="Executar código"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? 'Rodando...' : 'Executar'}</span>
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line numbers column */}
        <div className="w-10 bg-zinc-900/40 text-zinc-600 select-none text-right pr-2.5 py-3 text-xs font-mono leading-relaxed">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea code editor */}
        <textarea
          value={activeFile.code}
          onChange={(e) => handleCodeChange(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent text-zinc-200 text-xs font-mono p-3 leading-relaxed resize-none focus:outline-none overflow-y-auto whitespace-pre selection:bg-emerald-800 selection:text-white"
        />
      </div>

      {/* Execution Output Console Sheet (If run) */}
      {runOutput && (
        <div className="h-44 bg-zinc-900 border-t border-zinc-750 p-3 flex flex-col justify-between text-xs font-mono animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-zinc-400">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold">Console de Saída</span>
            </div>
            <button
              onClick={() => setRunOutput(null)}
              className="text-zinc-500 hover:text-white"
            >
              Fechar
            </button>
          </div>
          <pre className="flex-1 overflow-y-auto pt-2 text-zinc-300 text-[11px] leading-relaxed whitespace-pre-wrap">
            {runOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
