import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Pin, Check, X } from 'lucide-react';
import { NoteItem } from '../../types';
import { playHapticClick } from '../../utils/audio';

interface NotesAppProps {
  soundEnabled: boolean;
  accentColor: string;
}

const NOTE_COLORS = [
  '#27272a', // Zinc dark
  '#7f1d1d', // Red
  '#78350f', // Amber
  '#14532d', // Emerald
  '#1e3a8a', // Blue
  '#581c87', // Purple
];

const INITIAL_NOTES: NoteItem[] = [
  {
    id: '1',
    title: 'Ideias para o Novo Launcher Android',
    content: '1. Suporte a temas Material You dinâmicos\n2. Gestos fluidos para gaveta de aplicativos\n3. Suporte a ícones adaptativos com formatos personalizados',
    color: '#1e3a8a',
    date: 'Hoje, 09:15',
    pinned: true,
  },
  {
    id: '2',
    title: 'Lista de Compras da Semana',
    content: '- Café em grãos\n- Frutas frescas (banana, maçã)\n- Pão artesanal\n- Leite de aveia',
    color: '#14532d',
    date: 'Ontem',
    pinned: false,
  },
];

export const NotesApp: React.FC<NotesAppProps> = ({ soundEnabled, accentColor }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('android_launcher_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<NoteItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('android_launcher_notes', JSON.stringify(notes));
    } catch (e) {
      // ignore
    }
  }, [notes]);

  const handleOpenNewNote = () => {
    playHapticClick(soundEnabled);
    setCurrentNote({
      id: Date.now().toString(),
      title: '',
      content: '',
      color: '#27272a',
      date: 'Agora',
      pinned: false,
    });
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (!currentNote) return;
    if (!currentNote.title.trim() && !currentNote.content.trim()) {
      setIsEditing(false);
      return;
    }
    setNotes((prev) => {
      const existing = prev.findIndex((n) => n.id === currentNote.id);
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = currentNote;
        return copy;
      }
      return [currentNote, ...prev];
    });
    setIsEditing(false);
    setCurrentNote(null);
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playHapticClick(soundEnabled);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (currentNote?.id === id) {
      setIsEditing(false);
      setCurrentNote(null);
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      {/* Top Search & App Bar */}
      <div className="p-4 space-y-3 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">Keep Notes</span>
          <span className="text-xs text-zinc-500">{notes.length} notas salvas</span>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Pesquisar em suas notas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center text-zinc-500 text-xs py-12">
            Nenhuma nota encontrada. Crie sua primeira nota!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  playHapticClick(soundEnabled);
                  setCurrentNote(note);
                  setIsEditing(true);
                }}
                style={{ backgroundColor: note.color }}
                className="rounded-2xl p-4 cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all border border-white/10 shadow-md relative group"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-white">{note.title || 'Sem título'}</h3>
                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-300 mt-2 whitespace-pre-line line-clamp-3">
                  {note.content}
                </p>
                <span className="text-[10px] text-zinc-400 mt-3 block">{note.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={handleOpenNewNote}
          style={{ backgroundColor: accentColor }}
          className="w-14 h-14 rounded-2xl text-zinc-950 flex items-center justify-center shadow-xl hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Note Edit Modal */}
      {isEditing && currentNote && (
        <div className="absolute inset-0 z-50 bg-zinc-950 text-white flex flex-col justify-between p-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              {/* Color dots */}
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrentNote({ ...currentNote, color: c })}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full border-2 ${
                    currentNote.color === c ? 'border-white' : 'border-transparent'
                  }`}
                />
              ))}
              <button
                onClick={handleSaveNote}
                className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white ml-2"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 py-4 flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Título"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              className="bg-transparent text-xl font-bold text-white placeholder-zinc-600 focus:outline-none"
            />
            <textarea
              placeholder="Escreva algo..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
