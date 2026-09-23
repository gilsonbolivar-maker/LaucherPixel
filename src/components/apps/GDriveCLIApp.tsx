import React, { useState, useEffect, useRef } from 'react';
import {
  HardDrive,
  Cloud,
  Terminal as TerminalIcon,
  Trash2,
  CornerDownLeft,
  ExternalLink,
  Folder,
  FileText,
  FileCode,
  Package,
  Share2,
  Download,
  Upload,
  CheckCircle2,
  Search,
  Check,
  Copy,
  PieChart,
} from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface GDriveCLIAppProps {
  accentColor: string;
  soundEnabled: boolean;
}

interface DriveFile {
  id: string;
  name: string;
  type: 'doc' | 'sheet' | 'code' | 'zip' | 'apk' | 'folder' | 'pdf';
  size: string;
  sizeBytes: number;
  modified: string;
  shared: boolean;
  contentSnippet?: string;
}

const INITIAL_DRIVE_FILES: DriveFile[] = [
  {
    id: '1',
    name: 'AndroidProjects',
    type: 'folder',
    size: '42 MB',
    sizeBytes: 44040192,
    modified: 'Hoje às 09:15',
    shared: true,
  },
  {
    id: '2',
    name: 'DevOS-v2.5.0-release.apk',
    type: 'apk',
    size: '18.4 MB',
    sizeBytes: 19293798,
    modified: 'Hoje às 08:40',
    shared: true,
    contentSnippet: 'Package: com.devos.launcher | VersionCode: 25 | TargetSDK: 35 (Android 15)',
  },
  {
    id: '3',
    name: 'MainActivity.kt',
    type: 'code',
    size: '8.4 KB',
    sizeBytes: 8601,
    modified: 'Ontem',
    shared: false,
    contentSnippet: 'package com.devos.launcher\n\nclass MainActivity : ComponentActivity() {\n    // DevOS Main Launcher Loop\n}',
  },
  {
    id: '4',
    name: 'Arquitetura_DevOS_Especificacoes.gdoc',
    type: 'doc',
    size: '124 KB',
    sizeBytes: 126976,
    modified: '3 dias atrás',
    shared: true,
    contentSnippet: 'Documento de Especificação Técnica: DevOS Launcher com Material You, CLI Terminais e Jetpack Compose.',
  },
  {
    id: '5',
    name: 'Metrics_Sprint_Q3.gsheet',
    type: 'sheet',
    size: '82 KB',
    sizeBytes: 83968,
    modified: '5 dias atrás',
    shared: false,
    contentSnippet: 'Tabela de Métricas: 142 testes aprovados, FPS 60 estável, consumo de memória 48MB.',
  },
  {
    id: '6',
    name: 'dev-environment-keys-backup.tar.gz',
    type: 'zip',
    size: '4.2 MB',
    sizeBytes: 4404019,
    modified: '1 semana atrás',
    shared: false,
    contentSnippet: 'Archive Tar/Gzip contendo chaves SSH locais, gpg e configurações zshrc.',
  },
  {
    id: '7',
    name: 'Release_Notes_v2.5.pdf',
    type: 'pdf',
    size: '410 KB',
    sizeBytes: 419840,
    modified: '1 semana atrás',
    shared: true,
    contentSnippet: 'DevOS Release Notes v2.5: Novas integrações de terminal com GitHub CLI e Google Drive CLI.',
  },
];

interface HistoryItem {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'system';
  content: React.ReactNode;
}

export const GDriveCLIApp: React.FC<GDriveCLIAppProps> = ({ accentColor, soundEnabled }) => {
  const [files, setFiles] = useState<DriveFile[]>(INITIAL_DRIVE_FILES);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'h-init',
      type: 'system',
      content: (
        <div className="space-y-1 text-zinc-400">
          <div className="flex items-center space-x-2 text-white font-bold">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>Google Drive CLI (gdrive v3.1.2)</span>
          </div>
          <p className="text-zinc-500 text-xs">
            Conectado a <span className="text-blue-400 font-semibold">gilsonbolivar@gmail.com</span> • Armazenamento em nuvem Google Drive
          </p>
          <p className="text-zinc-500 text-[11px]">
            Digite <span className="text-emerald-400 font-semibold">help</span> para comandos ou toque nos atalhos rápidos abaixo.
          </p>
        </div>
      ),
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isUploading]);

  const copyText = (text: string, id: string) => {
    playHapticClick(soundEnabled);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const executeCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    playHapticClick(soundEnabled);
    const cmdId = Date.now().toString();

    const normalized = trimmed.startsWith('gdrive ') ? trimmed.slice(7).trim() : trimmed;
    const parts = normalized.split(/\s+/);
    const command = parts[0]?.toLowerCase() || '';
    const arg = parts.slice(1).join(' ');

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${cmdId}`,
        type: 'cmd',
        content: (
          <div className="flex items-center space-x-2 text-zinc-200 font-mono">
            <span className="text-amber-400 font-bold">drive:</span>
            <span className="text-cyan-400">~</span>
            <span className="text-white">$ gdrive {normalized}</span>
          </div>
        ),
      },
    ]);

    setInput('');

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    if (command === 'help') {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono">
              <p className="text-amber-400 font-bold">Comandos Google Drive CLI disponíveis:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-zinc-300">
                <div><span className="text-emerald-400 font-semibold">gdrive list</span> - Listar arquivos na raiz do Drive</div>
                <div><span className="text-emerald-400 font-semibold">gdrive quota</span> - Espaço ocupado e limites (df)</div>
                <div><span className="text-emerald-400 font-semibold">gdrive tree</span> - Árvore hierárquica de pastas</div>
                <div><span className="text-emerald-400 font-semibold">gdrive search &lt;termo&gt;</span> - Filtrar arquivos por nome/tipo</div>
                <div><span className="text-emerald-400 font-semibold">gdrive cat &lt;arquivo&gt;</span> - Pré-visualizar conteúdo de arquivo</div>
                <div><span className="text-emerald-400 font-semibold">gdrive upload &lt;nome&gt;</span> - Simular upload em nuvem</div>
                <div><span className="text-emerald-400 font-semibold">gdrive mkdir &lt;pasta&gt;</span> - Criar nova pasta no Drive</div>
                <div><span className="text-emerald-400 font-semibold">gdrive share &lt;id/nome&gt;</span> - Gerar link compartilhável</div>
                <div><span className="text-emerald-400 font-semibold">gdrive auth status</span> - Info da conta e escopos OAuth</div>
                <div><span className="text-emerald-400 font-semibold">gdrive open</span> - Abrir Google Drive no navegador</div>
                <div><span className="text-emerald-400 font-semibold">clear</span> - Limpar tela</div>
              </div>
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'auth' || (command === 'account' && arg === 'status')) {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Google Drive Cloud: Conectado</span>
              </div>
              <p className="text-zinc-300">✓ Usuário: <strong className="text-white">gilsonbolivar@gmail.com</strong></p>
              <p className="text-zinc-400">✓ Provedor: Google Workspace / Cloud Identity (Google Drive API v3)</p>
              <p className="text-zinc-400">✓ Escopos OAuth: <code className="text-amber-300 text-[11px]">https://www.googleapis.com/auth/drive.readonly, drive.file</code></p>
              <p className="text-zinc-400">✓ Token Expira em: 3584 segundos (auto-refresh via Android AccountManager)</p>
              <p className="text-zinc-500 text-[11px]">✓ Latência de API: 22ms (Google Cloud South America - sa-east-1)</p>
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'quota' || command === 'df') {
      const usedGb = 4.8;
      const totalGb = 15.0;
      const percent = Math.round((usedGb / totalGb) * 100);

      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-xs font-mono bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Cota de Armazenamento do Google Drive</span>
                </span>
                <span className="text-zinc-400">{usedGb} GB de {totalGb} GB ({percent}%)</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: '22%' }} title="Google Drive: 3.3 GB" />
                <div className="bg-rose-500 h-full" style={{ width: '7%' }} title="Gmail: 1.0 GB" />
                <div className="bg-amber-500 h-full" style={{ width: '3%' }} title="Google Fotos: 0.5 GB" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="flex items-center space-x-1.5 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Drive: 3.3 GB</span>
                </div>
                <div className="flex items-center space-x-1.5 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Gmail: 1.0 GB</span>
                </div>
                <div className="flex items-center space-x-1.5 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Fotos: 0.5 GB</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 pt-1">
                Plano: Padrão Gratuito Google (15 GB) • Espaço livre: 10.2 GB
              </p>
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'list' || command === 'ls') {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Arquivos em &quot;/Meu Drive&quot; ({files.length} itens):</span>
                <span className="text-[10px] text-zinc-500">Formato: ID | TIPO | NOME | TAMANHO | MODIFICADO</span>
              </div>

              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-2 bg-zinc-900 border border-zinc-800/80 rounded-lg flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 truncate max-w-[70%]">
                      <span className="text-zinc-600 text-[10px]">#{file.id}</span>
                      {file.type === 'folder' && <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                      {file.type === 'code' && <FileCode className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      {file.type === 'doc' && <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                      {file.type === 'sheet' && <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                      {file.type === 'apk' && <Package className="w-4 h-4 text-green-400 flex-shrink-0" />}
                      {file.type === 'zip' && <Package className="w-4 h-4 text-purple-400 flex-shrink-0" />}
                      {file.type === 'pdf' && <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      <span className="text-zinc-200 font-semibold truncate">{file.name}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-zinc-400 flex-shrink-0">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                        {file.size}
                      </span>
                      {file.shared && (
                        <span className="text-cyan-400" title="Compartilhado">
                          <Share2 className="w-3 h-3" />
                        </span>
                      )}
                      <span className="text-zinc-500 text-[10px] hidden sm:inline">{file.modified}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'tree') {
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono leading-relaxed space-y-1">
              <p className="text-amber-400 font-bold">/Meu Drive/</p>
              <pre className="text-zinc-300 select-text overflow-x-auto">
{`├── 📁 AndroidProjects/
│   ├── 📄 MainActivity.kt (8.4 KB)
│   ├── 📦 DevOS-v2.5.0-release.apk (18.4 MB)
│   └── 📄 AndroidManifest.xml (4.1 KB)
├── 📁 CloudBackups/
│   ├── 📦 dev-environment-keys-backup.tar.gz (4.2 MB)
│   └── 📄 keystore-release.jks (2.8 KB)
├── 📁 Documentos/
│   ├── 📝 Arquitetura_DevOS_Especificacoes.gdoc (124 KB)
│   ├── 📊 Metrics_Sprint_Q3.gsheet (82 KB)
│   └── 📑 Release_Notes_v2.5.pdf (410 KB)
└── 📁 DesignAssets/
    ├── 🎨 monet_palette_tokens.json (14 KB)
    └── 🖼️ wallpaper_matrix.png (1.2 MB)`}
              </pre>
              <p className="text-[10px] text-zinc-500">4 diretórios, 11 arquivos</p>
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'search') {
      const term = arg.toLowerCase();
      if (!term) {
        setHistory((prev) => [
          ...prev,
          { id: `err-${cmdId}`, type: 'error', content: 'Uso: gdrive search <termo>' },
        ]);
        return;
      }

      const results = files.filter(
        (f) => f.name.toLowerCase().includes(term) || f.type.toLowerCase().includes(term)
      );

      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono">
              <p className="text-emerald-400 font-bold">
                Resultados para &quot;{term}&quot; ({results.length} encontrados):
              </p>
              {results.length === 0 ? (
                <p className="text-zinc-500">Nenhum arquivo correspondente encontrado.</p>
              ) : (
                results.map((f) => (
                  <div key={f.id} className="p-2 bg-zinc-900 border border-zinc-800 rounded flex justify-between">
                    <span className="text-zinc-200">{f.name}</span>
                    <span className="text-zinc-400 text-[11px]">{f.size}</span>
                  </div>
                ))
              )}
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'cat' || command === 'view') {
      const term = arg.toLowerCase();
      const targetFile = files.find(
        (f) => f.name.toLowerCase().includes(term) || f.id === term
      );

      if (!targetFile) {
        setHistory((prev) => [
          ...prev,
          {
            id: `err-${cmdId}`,
            type: 'error',
            content: `Arquivo "${arg}" não encontrado no Google Drive.`,
          },
        ]);
        return;
      }

      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                <span className="text-emerald-400 font-bold">{targetFile.name}</span>
                <span className="text-zinc-500 text-[10px]">{targetFile.size} • Modificado {targetFile.modified}</span>
              </div>
              <pre className="text-zinc-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                {targetFile.contentSnippet || 'Conteúdo binário ou documento protegido do Google Docs.'}
              </pre>
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'upload') {
      const fileName = arg || 'dev-snapshot-backup.tar.gz';
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);

            const newFile: DriveFile = {
              id: (files.length + 1).toString(),
              name: fileName,
              type: fileName.endsWith('.apk') ? 'apk' : fileName.endsWith('.kt') ? 'code' : 'zip',
              size: '3.6 MB',
              sizeBytes: 3774873,
              modified: 'Agora',
              shared: false,
              contentSnippet: `Arquivo enviado com sucesso pelo DevOS Google Drive Terminal CLI em ${new Date().toLocaleTimeString()}.`,
            };

            setFiles((curr) => [newFile, ...curr]);

            setHistory((old) => [
              ...old,
              {
                id: `upload-ok-${Date.now()}`,
                type: 'output',
                content: (
                  <div className="space-y-1 text-xs font-mono text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/60">
                    <p className="font-bold">✓ Upload concluído com sucesso!</p>
                    <p className="text-zinc-300">Arquivo: <strong className="text-white">{fileName}</strong> (3.6 MB)</p>
                    <p className="text-zinc-400">ID Drive: <code className="text-cyan-400">1zK9Xm_{Date.now().toString().slice(-6)}</code></p>
                    <p className="text-zinc-400">Link: <span className="text-blue-400 underline">https://drive.google.com/file/d/devos_{fileName}</span></p>
                  </div>
                ),
              },
            ]);

            return 100;
          }
          return prev + 25;
        });
      }, 150);
      return;
    }

    if (command === 'mkdir') {
      const folderName = arg || 'NovaPasta_Dev';
      const newFolder: DriveFile = {
        id: (files.length + 1).toString(),
        name: folderName,
        type: 'folder',
        size: '0 KB',
        sizeBytes: 0,
        modified: 'Agora',
        shared: false,
      };

      setFiles((curr) => [newFolder, ...curr]);
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="text-xs font-mono text-emerald-400">
              ✓ Diretório &quot;{folderName}&quot; criado em /Meu Drive/ com sucesso.
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'share') {
      const targetFile = files.find((f) => f.name.toLowerCase().includes(arg.toLowerCase())) || files[0];
      const link = `https://drive.google.com/file/d/1X9${targetFile.id}ABc_devos/view?usp=sharing`;

      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono space-y-1.5">
              <p className="text-emerald-400 font-bold">Link de Compartilhamento Gerado:</p>
              <div className="flex items-center justify-between p-2 bg-zinc-950 rounded border border-zinc-850">
                <span className="text-blue-400 truncate max-w-[80%] text-[11px]">{link}</span>
                <button
                  onClick={() => copyText(link, `share-${cmdId}`)}
                  className="text-zinc-400 hover:text-white p-1"
                  title="Copiar link"
                >
                  {copiedId === `share-${cmdId}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-zinc-500">Permissão: Qualquer pessoa com o link pode visualizar.</p>
            </div>
          ),
        },
      ]);
      return;
    }

    if (command === 'open') {
      window.open('https://drive.google.com', '_blank');
      setHistory((prev) => [
        ...prev,
        {
          id: `out-${cmdId}`,
          type: 'output',
          content: (
            <div className="text-xs text-emerald-400 flex items-center space-x-2 font-mono">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrindo Google Drive Web em nova aba...</span>
            </div>
          ),
        },
      ]);
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `err-${cmdId}`,
        type: 'error',
        content: (
          <div className="text-xs text-rose-400 font-mono">
            gdrive: comando desconhecido &quot;{normalized}&quot;. Digite <strong className="text-white">help</strong> para obter suporte.
          </div>
        ),
      },
    ]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white font-mono select-none relative overflow-hidden">
      {/* Top Header */}
      <div className="px-3.5 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-xs">Google Drive CLI</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-950 border border-amber-700/60 text-[10px] text-amber-300 font-mono">
                gdrive v3.1
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans">Acesso a arquivos em nuvem, cota, uploads e sync</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              playHapticClick(soundEnabled);
              executeCommand('gdrive quota');
            }}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono transition-colors"
            title="Ver Cota de Espaço"
          >
            quota
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

      {/* Terminal Output History */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs font-mono relative">
        {history.map((item) => (
          <div key={item.id} className="leading-relaxed">
            {item.content}
          </div>
        ))}

        {isUploading && (
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg space-y-1 text-xs">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span>Enviando arquivo para o Google Drive...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Quick Action Chips for Fast Mobile Terminal Control */}
      <div className="px-2 py-1.5 bg-zinc-900/80 border-t border-zinc-800/80 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <span className="text-zinc-500 pl-1 text-[10px]">Atalhos gdrive:</span>
        {[
          'gdrive list',
          'gdrive quota',
          'gdrive tree',
          'gdrive search .apk',
          'gdrive cat MainActivity.kt',
          'gdrive upload DevOS_Build.zip',
          'gdrive share DevOS-v2.5.0-release.apk',
          'gdrive auth status',
          'help',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[11px] whitespace-nowrap active:scale-95 transition-transform"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Input Form */}
      <form
        onSubmit={handleFormSubmit}
        className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2"
      >
        <span className="text-amber-400 font-bold text-xs">drive:</span>
        <span className="text-cyan-400 font-bold text-xs">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="list, quota, tree, cat, upload, share..."
          className="flex-1 bg-transparent text-white text-xs font-mono focus:outline-none placeholder-zinc-600"
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-40 disabled:hover:bg-amber-600 transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
