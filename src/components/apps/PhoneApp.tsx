import React, { useState } from 'react';
import { Phone, Delete, User, PhoneCall, PhoneOff, Mic, Volume2, Grid } from 'lucide-react';
import { playDtmfTone, playHapticClick } from '../../utils/audio';

interface PhoneAppProps {
  soundEnabled: boolean;
  accentColor: string;
}

const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

const SAMPLE_CONTACTS = [
  { name: 'Ana Carolina', number: '(11) 98765-4321', avatar: 'AC' },
  { name: 'Carlos Eduardo', number: '(21) 99887-1122', avatar: 'CE' },
  { name: 'Mariana Silva', number: '(31) 97654-3344', avatar: 'MS' },
  { name: 'Lucas Rocha', number: '(41) 99123-5566', avatar: 'LR' },
];

export const PhoneApp: React.FC<PhoneAppProps> = ({ soundEnabled, accentColor }) => {
  const [activeTab, setActiveTab] = useState<'keypad' | 'contacts' | 'recents'>('keypad');
  const [number, setNumber] = useState('');
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleKeyPress = (char: string) => {
    playHapticClick(soundEnabled);
    if (DTMF_FREQS[char]) {
      playDtmfTone(DTMF_FREQS[char][0], DTMF_FREQS[char][1], soundEnabled);
    }
    setNumber((prev) => prev + char);
  };

  const handleDelete = () => {
    playHapticClick(soundEnabled);
    setNumber((prev) => prev.slice(0, -1));
  };

  const startCall = (targetNum?: string) => {
    const numToCall = targetNum || number;
    if (!numToCall) return;
    setNumber(numToCall);
    setInCall(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setInCall(false);
    setCallDuration(0);
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inCall) {
      timer = setInterval(() => {
        setCallDuration((c) => c + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inCall]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (inCall) {
    return (
      <div className="h-full bg-gradient-to-b from-zinc-900 to-zinc-950 text-white flex flex-col justify-between p-6 items-center select-none">
        <div className="text-center pt-8 space-y-2">
          <div className="w-24 h-24 rounded-full bg-emerald-600/30 text-emerald-400 mx-auto flex items-center justify-center text-3xl font-bold border border-emerald-500/30 shadow-lg">
            <User className="w-12 h-12" />
          </div>
          <p className="text-xl font-bold">{number}</p>
          <p className="text-sm text-zinc-400">Ligando...</p>
          <p className="text-lg font-mono text-emerald-400">{formatSeconds(callDuration)}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
          <button className="flex flex-col items-center space-y-1 text-zinc-400 hover:text-white">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-xs">Mudo</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-zinc-400 hover:text-white">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
              <Grid className="w-6 h-6" />
            </div>
            <span className="text-xs">Teclado</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-zinc-400 hover:text-white">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="text-xs">Alto-falante</span>
          </button>
        </div>

        <div className="pb-8">
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl active:scale-95 transition-all"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      {/* Top Bar / Search input */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-around text-xs font-semibold pb-2 text-zinc-400">
          <button
            onClick={() => setActiveTab('keypad')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'keypad' ? 'border-emerald-500 text-emerald-400' : 'border-transparent'
            }`}
          >
            Teclado
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'contacts' ? 'border-emerald-500 text-emerald-400' : 'border-transparent'
            }`}
          >
            Contatos
          </button>
        </div>

        {activeTab === 'keypad' && (
          <div className="h-16 flex items-center justify-between px-2">
            <span className="text-2xl font-mono tracking-wider truncate text-white">
              {number || <span className="text-zinc-600 text-lg">Digite o número...</span>}
            </span>
            {number && (
              <button onClick={handleDelete} className="p-2 text-zinc-400 hover:text-white">
                <Delete className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'keypad' ? (
        <div className="p-4 flex flex-col justify-end flex-1 max-w-xs mx-auto w-full">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { num: '1', sub: '' },
              { num: '2', sub: 'ABC' },
              { num: '3', sub: 'DEF' },
              { num: '4', sub: 'GHI' },
              { num: '5', sub: 'JKL' },
              { num: '6', sub: 'MNO' },
              { num: '7', sub: 'PQRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: '' },
              { num: '0', sub: '+' },
              { num: '#', sub: '' },
            ].map((btn) => (
              <button
                key={btn.num}
                onClick={() => handleKeyPress(btn.num)}
                className="h-16 rounded-full bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all flex flex-col items-center justify-center border border-zinc-800/60"
              >
                <span className="text-2xl font-bold leading-none">{btn.num}</span>
                {btn.sub && <span className="text-[9px] text-zinc-400 font-semibold tracking-widest">{btn.sub}</span>}
              </button>
            ))}
          </div>

          <div className="flex justify-center pb-2">
            <button
              onClick={() => startCall()}
              disabled={!number}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                number
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Phone className="w-8 h-8" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Contatos Recentes</p>
          {SAMPLE_CONTACTS.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-zinc-900 rounded-2xl border border-zinc-800/80 hover:bg-zinc-850"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-teal-600/30 text-teal-400 font-bold flex items-center justify-center">
                  {c.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-zinc-400 font-mono">{c.number}</p>
                </div>
              </div>
              <button
                onClick={() => startCall(c.number)}
                className="w-10 h-10 rounded-full bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <PhoneCall className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
