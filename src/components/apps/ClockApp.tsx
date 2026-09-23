import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Flag, Timer as TimerIcon, AlarmClock, Globe } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface ClockAppProps {
  soundEnabled: boolean;
  accentColor: string;
}

export const ClockApp: React.FC<ClockAppProps> = ({ soundEnabled, accentColor }) => {
  const [tab, setTab] = useState<'clock' | 'alarm' | 'stopwatch' | 'timer'>('clock');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Timer state
  const [timerDuration, setTimerDuration] = useState(300); // 5 min default
  const [timerLeft, setTimerLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (swRunning) {
      interval = setInterval(() => {
        setSwTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  // Timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerLeft]);

  const formatStopwatch = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  };

  const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const addLap = () => {
    playHapticClick(soundEnabled);
    setLaps((prev) => [swTime, ...prev]);
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      {/* Top Tabs */}
      <div className="flex justify-around items-center py-3 border-b border-zinc-800 text-xs font-semibold text-zinc-400">
        <button
          onClick={() => setTab('clock')}
          className={`flex items-center space-x-1 py-1 px-2.5 rounded-full transition-colors ${
            tab === 'clock' ? 'bg-zinc-800 text-blue-400' : 'hover:text-zinc-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Relógio</span>
        </button>
        <button
          onClick={() => setTab('alarm')}
          className={`flex items-center space-x-1 py-1 px-2.5 rounded-full transition-colors ${
            tab === 'alarm' ? 'bg-zinc-800 text-blue-400' : 'hover:text-zinc-200'
          }`}
        >
          <AlarmClock className="w-3.5 h-3.5" />
          <span>Alarme</span>
        </button>
        <button
          onClick={() => setTab('stopwatch')}
          className={`flex items-center space-x-1 py-1 px-2.5 rounded-full transition-colors ${
            tab === 'stopwatch' ? 'bg-zinc-800 text-blue-400' : 'hover:text-zinc-200'
          }`}
        >
          <TimerIcon className="w-3.5 h-3.5" />
          <span>Cronômetro</span>
        </button>
        <button
          onClick={() => setTab('timer')}
          className={`flex items-center space-x-1 py-1 px-2.5 rounded-full transition-colors ${
            tab === 'timer' ? 'bg-zinc-800 text-blue-400' : 'hover:text-zinc-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Timer</span>
        </button>
      </div>

      {/* Body per Tab */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center">
        {tab === 'clock' && (
          <div className="text-center space-y-4">
            <div className="text-6xl font-light font-mono tracking-tight text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </div>
            <p className="text-sm text-zinc-400 capitalize">
              {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            {/* World Clocks */}
            <div className="pt-6 w-full max-w-xs space-y-2 text-left">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fusos Horários</span>
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">São Paulo (Local)</p>
                  <p className="text-xs text-zinc-500">GMT-3</p>
                </div>
                <span className="text-base font-mono font-medium">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">Nova York</p>
                  <p className="text-xs text-zinc-500">GMT-4</p>
                </div>
                <span className="text-base font-mono font-medium">
                  {new Date(currentTime.getTime() - 1 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">Tóquio</p>
                  <p className="text-xs text-zinc-500">GMT+9</p>
                </div>
                <span className="text-base font-mono font-medium">
                  {new Date(currentTime.getTime() + 12 * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        )}

        {tab === 'alarm' && (
          <div className="w-full max-w-xs space-y-3">
            {[
              { time: '06:30', label: 'Despertador de Trabalho', active: true, days: 'Seg, Ter, Qua, Qui, Sex' },
              { time: '08:00', label: 'Fim de Semana', active: false, days: 'Sáb, Dom' },
              { time: '14:30', label: 'Reunião com Equipe', active: true, days: 'Hoje' },
            ].map((alarm, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex justify-between items-center"
              >
                <div>
                  <span className="text-3xl font-light font-mono text-white">{alarm.time}</span>
                  <p className="text-xs text-zinc-400 mt-1">{alarm.label}</p>
                  <p className="text-[10px] text-zinc-500">{alarm.days}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={alarm.active}
                  className="w-6 h-6 rounded-md accent-blue-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'stopwatch' && (
          <div className="w-full flex flex-col items-center">
            <div className="text-5xl font-mono font-light text-white my-6">
              {formatStopwatch(swTime)}
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => {
                  playHapticClick(soundEnabled);
                  setSwRunning(!swRunning);
                }}
                style={{ backgroundColor: swRunning ? '#EF4444' : accentColor }}
                className="w-16 h-16 rounded-full text-zinc-950 font-bold flex items-center justify-center shadow-lg active:scale-95 transition-all"
              >
                {swRunning ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 ml-1 text-zinc-950" />}
              </button>

              {swRunning && (
                <button
                  onClick={addLap}
                  className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center active:scale-95 transition-all"
                >
                  <Flag className="w-6 h-6" />
                </button>
              )}

              {!swRunning && swTime > 0 && (
                <button
                  onClick={() => {
                    playHapticClick(soundEnabled);
                    setSwTime(0);
                    setLaps([]);
                  }}
                  className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center active:scale-95 transition-all"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Laps List */}
            {laps.length > 0 && (
              <div className="w-full max-w-xs max-h-40 overflow-y-auto space-y-1.5 border-t border-zinc-800 pt-3">
                {laps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-mono text-zinc-400 px-2 py-1 bg-zinc-900/60 rounded-lg">
                    <span>Volta {laps.length - idx}</span>
                    <span className="text-white">{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'timer' && (
          <div className="w-full flex flex-col items-center">
            <div className="text-5xl font-mono font-light text-white my-6">
              {formatTimer(timerLeft)}
            </div>

            <div className="flex space-x-3 mb-6">
              {[60, 300, 600, 900].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    playHapticClick(soundEnabled);
                    setTimerDuration(sec);
                    setTimerLeft(sec);
                    setTimerRunning(false);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border border-zinc-700 ${
                    timerDuration === sec ? 'bg-blue-600 text-white border-blue-500' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {sec / 60}m
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  playHapticClick(soundEnabled);
                  setTimerRunning(!timerRunning);
                }}
                style={{ backgroundColor: timerRunning ? '#EF4444' : accentColor }}
                className="w-16 h-16 rounded-full text-zinc-950 font-bold flex items-center justify-center shadow-lg active:scale-95 transition-all"
              >
                {timerRunning ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 ml-1 text-zinc-950" />}
              </button>
              <button
                onClick={() => {
                  playHapticClick(soundEnabled);
                  setTimerLeft(timerDuration);
                  setTimerRunning(false);
                }}
                className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center active:scale-95 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
