import React, { useState } from 'react';
import { Delete, History, RotateCcw, Binary, Cpu } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface CalculatorAppProps {
  accentColor: string;
  soundEnabled: boolean;
}

type BaseMode = 'DEC' | 'HEX' | 'BIN' | 'OCT';

export const CalculatorApp: React.FC<CalculatorAppProps> = ({ accentColor, soundEnabled }) => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [mode, setMode] = useState<BaseMode>('DEC');
  const [isProgrammerMode, setIsProgrammerMode] = useState(true);

  // Compute current numeric integer value for all bases
  const numericValue = parseInt(display, mode === 'HEX' ? 16 : mode === 'BIN' ? 2 : mode === 'OCT' ? 8 : 10) || 0;

  const hexVal = numericValue.toString(16).toUpperCase();
  const decVal = numericValue.toString(10);
  const octVal = numericValue.toString(8);
  const binVal = (numericValue >>> 0).toString(2).padStart(16, '0').replace(/(.{4})/g, '$1 ').trim();

  const handleInput = (char: string) => {
    playHapticClick(soundEnabled);
    if (display === '0' || display === 'Erro') {
      setDisplay(char);
    } else {
      setDisplay(display + char);
    }
  };

  const handleOperator = (op: string) => {
    playHapticClick(soundEnabled);
    setPrevVal(display);
    setOperation(op);
    setDisplay('0');
  };

  const handleBitwiseNot = () => {
    playHapticClick(soundEnabled);
    const val = parseInt(display, 10) || 0;
    const res = (~val) >>> 0;
    setDisplay(res.toString());
  };

  const handleEquals = () => {
    playHapticClick(soundEnabled);
    if (!prevVal || !operation) return;
    const a = parseInt(prevVal, 10);
    const b = parseInt(display, 10);
    let res = 0;

    switch (operation) {
      case '+':
        res = a + b;
        break;
      case '−':
        res = a - b;
        break;
      case '×':
        res = a * b;
        break;
      case '÷':
        res = b !== 0 ? Math.floor(a / b) : NaN;
        break;
      case '%':
        res = a % b;
        break;
      case 'AND':
        res = a & b;
        break;
      case 'OR':
        res = a | b;
        break;
      case 'XOR':
        res = a ^ b;
        break;
      case '<<':
        res = a << b;
        break;
      case '>>':
        res = a >> b;
        break;
    }

    if (isNaN(res)) {
      setDisplay('Erro');
    } else {
      setDisplay(res.toString());
    }
    setPrevVal(null);
    setOperation(null);
  };

  const handleClear = () => {
    playHapticClick(soundEnabled);
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
  };

  const handleDelete = () => {
    playHapticClick(soundEnabled);
    if (display.length <= 1 || display === 'Erro') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white font-mono select-none p-3">
      {/* Top Header Mode Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
        <div className="flex items-center space-x-1.5 text-emerald-400">
          <Cpu className="w-4 h-4" />
          <span className="font-bold">Calculadora Programador</span>
        </div>
        <button
          onClick={() => {
            playHapticClick(soundEnabled);
            setIsProgrammerMode(!isProgrammerMode);
          }}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
            isProgrammerMode
              ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
              : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {isProgrammerMode ? 'Modo 64-bit' : 'Padrão'}
        </button>
      </div>

      {/* Programmer Multi-Base Register Display */}
      {isProgrammerMode && (
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-2.5 space-y-1 text-xs">
          <div
            onClick={() => setMode('HEX')}
            className={`flex items-center justify-between px-2 py-0.5 rounded cursor-pointer ${
              mode === 'HEX' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <span className="text-[10px] opacity-70">HEX</span>
            <span>0x{hexVal}</span>
          </div>
          <div
            onClick={() => setMode('DEC')}
            className={`flex items-center justify-between px-2 py-0.5 rounded cursor-pointer ${
              mode === 'DEC' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <span className="text-[10px] opacity-70">DEC</span>
            <span>{decVal}</span>
          </div>
          <div
            onClick={() => setMode('OCT')}
            className={`flex items-center justify-between px-2 py-0.5 rounded cursor-pointer ${
              mode === 'OCT' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <span className="text-[10px] opacity-70">OCT</span>
            <span>0o{octVal}</span>
          </div>
          <div
            onClick={() => setMode('BIN')}
            className={`flex items-center justify-between px-2 py-0.5 rounded cursor-pointer ${
              mode === 'BIN' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400'
            }`}
          >
            <span className="text-[10px] opacity-70">BIN</span>
            <span className="text-[11px] font-mono tracking-wider">{binVal}</span>
          </div>
        </div>
      )}

      {/* Primary Display Number */}
      <div className="py-2 text-right">
        {prevVal && operation && (
          <p className="text-zinc-500 text-xs">
            {prevVal} {operation}
          </p>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-white truncate">{display}</h2>
      </div>

      {/* Bitwise Row (Programmer mode) */}
      {isProgrammerMode && (
        <div className="grid grid-cols-6 gap-1 pb-1 text-[11px]">
          {['AND', 'OR', 'XOR', 'NOT', '<<', '>>'].map((op) => (
            <button
              key={op}
              onClick={() => (op === 'NOT' ? handleBitwiseNot() : handleOperator(op))}
              className="py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-amber-300 font-bold text-center active:scale-95 transition-transform"
            >
              {op}
            </button>
          ))}
        </div>
      )}

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-rose-400 font-bold text-sm"
        >
          AC
        </button>
        <button
          onClick={handleDelete}
          className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleOperator('%')}
          className="h-11 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-sm"
        >
          %
        </button>
        <button
          onClick={() => handleOperator('÷')}
          className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base"
        >
          ÷
        </button>

        {/* Row 2 */}
        {['7', '8', '9'].map((n) => (
          <button
            key={n}
            onClick={() => handleInput(n)}
            className="h-11 rounded-2xl bg-zinc-850 hover:bg-zinc-750 text-white font-bold text-base shadow"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('×')}
          className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base"
        >
          ×
        </button>

        {/* Row 3 */}
        {['4', '5', '6'].map((n) => (
          <button
            key={n}
            onClick={() => handleInput(n)}
            className="h-11 rounded-2xl bg-zinc-850 hover:bg-zinc-750 text-white font-bold text-base shadow"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('−')}
          className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base"
        >
          −
        </button>

        {/* Row 4 */}
        {['1', '2', '3'].map((n) => (
          <button
            key={n}
            onClick={() => handleInput(n)}
            className="h-11 rounded-2xl bg-zinc-850 hover:bg-zinc-750 text-white font-bold text-base shadow"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleOperator('+')}
          className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleInput('0')}
          className="col-span-2 h-11 rounded-2xl bg-zinc-850 hover:bg-zinc-750 text-white font-bold text-base shadow"
        >
          0
        </button>
        <button
          onClick={() => handleInput('.')}
          className="h-11 rounded-2xl bg-zinc-850 hover:bg-zinc-750 text-white font-bold text-base"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow"
        >
          =
        </button>
      </div>
    </div>
  );
};
