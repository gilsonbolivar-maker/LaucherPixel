import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, ShieldAlert, CheckCircle2, Play, Pause, Trash2 } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface SystemProfilerAppProps {
  accentColor: string;
  soundEnabled: boolean;
}

interface LogEntry {
  id: number;
  time: string;
  tag: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, time: '12:00:01.102', tag: 'DevOSLauncher', level: 'INFO', message: 'Launcher initialized in singleTask mode with Material You Monet' },
  { id: 2, time: '12:00:01.144', tag: 'Choreographer', level: 'DEBUG', message: 'RenderThread vsync locked at 60 FPS. Frame drop count: 0' },
  { id: 3, time: '12:00:01.210', tag: 'PackageManager', level: 'INFO', message: 'Querying resolveInfo for ACTION_MAIN category HOME -> [OK]' },
  { id: 4, time: '12:00:01.320', tag: 'AdbManager', level: 'DEBUG', message: 'Wireless debugging listening on tcp:5555' },
  { id: 5, time: '12:00:01.450', tag: 'MemoryTrim', level: 'DEBUG', message: 'TrimLevel: COMPLETE_BACKGROUND. Heap 58% utilized' },
];

export const SystemProfilerApp: React.FC<SystemProfilerAppProps> = ({ accentColor, soundEnabled }) => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [filter, setFilter] = useState<'ALL' | 'INFO' | 'DEBUG' | 'WARN'>('ALL');
  const [isStreaming, setIsStreaming] = useState(true);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const sampleMessages = [
        { tag: 'ViteHost', level: 'INFO' as const, message: 'HMR ping acknowledged in 8ms' },
        { tag: 'AudioSynth', level: 'DEBUG' as const, message: 'Web Audio context clock synced' },
        { tag: 'TouchDriver', level: 'DEBUG' as const, message: 'MotionEvent.ACTION_UP dispatched to HomeDock' },
        { tag: 'BatteryThermal', level: 'INFO' as const, message: 'Temperature: 31.4°C. Thermal state: NOMINAL' },
      ];
      const randomItem = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      setLogs((prev) => [...prev.slice(-40), { id: Date.now(), time: timeStr, ...randomItem }]);
      setFps(59 + Math.round(Math.random()));
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredLogs = logs.filter((l) => (filter === 'ALL' ? true : l.level === filter));

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white font-mono select-none">
      {/* Real-time Hardware Metrics HUD */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px]">Taxa FPS</span>
          </div>
          <p className="text-xl font-bold mt-1 text-white">{fps} <span className="text-[10px] text-zinc-500 font-normal">Hz</span></p>
          <span className="text-[9px] text-emerald-400">Estável 16.6ms</span>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-blue-400">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[10px]">CPU Load</span>
          </div>
          <p className="text-xl font-bold mt-1 text-white">18%</p>
          <span className="text-[9px] text-zinc-400">8 Cores Act.</span>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-2 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-amber-400">
            <HardDrive className="w-3.5 h-3.5" />
            <span className="text-[10px]">RAM Heap</span>
          </div>
          <p className="text-xl font-bold mt-1 text-white">4.8 <span className="text-[10px] text-zinc-500 font-normal">GB</span></p>
          <span className="text-[9px] text-amber-400">58% Usado</span>
        </div>
      </div>

      {/* Logcat Controls */}
      <div className="px-3 py-2 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="text-zinc-500 text-[11px]">Logcat:</span>
          {(['ALL', 'INFO', 'DEBUG', 'WARN'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                playHapticClick(soundEnabled);
                setFilter(lvl);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                filter === lvl
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              playHapticClick(soundEnabled);
              setIsStreaming(!isStreaming);
            }}
            className="p-1 rounded hover:text-white text-zinc-400"
            title={isStreaming ? 'Pausar streaming' : 'Retomar streaming'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              playHapticClick(soundEnabled);
              setLogs([]);
            }}
            className="p-1 rounded hover:text-white text-zinc-400"
            title="Limpar logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Log Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 text-[11px] font-mono leading-tight">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start space-x-2 border-b border-zinc-900/60 pb-1">
            <span className="text-zinc-600 whitespace-nowrap">{log.time}</span>
            <span
              className={`font-bold px-1 rounded text-[9px] ${
                log.level === 'INFO'
                  ? 'bg-blue-950 text-blue-400'
                  : log.level === 'WARN'
                  ? 'bg-amber-950 text-amber-400'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {log.level}
            </span>
            <span className="text-emerald-400 font-semibold">{log.tag}:</span>
            <span className="text-zinc-300 break-all">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
