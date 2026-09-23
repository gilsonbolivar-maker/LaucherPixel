import React, { useState } from 'react';
import { Send, User, ChevronLeft, Phone, MoreVertical } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface Chat {
  id: string;
  contactName: string;
  avatar: string;
  messages: Message[];
}

const INITIAL_CHATS: Chat[] = [
  {
    id: '1',
    contactName: 'Google Pixel Suporte',
    avatar: 'G',
    messages: [
      { id: '1', sender: 'them', text: 'Olá! Bem-vindo ao seu novo launcher Android. Como podemos ajudar hoje?', time: '09:00' },
      { id: '2', sender: 'me', text: 'Adorei a interface Material You e a rapidez dos gestos!', time: '09:05' },
      { id: '3', sender: 'them', text: 'Excelente! Você pode personalizar cores e papéis de parede nas Configurações.', time: '09:06' },
    ],
  },
  {
    id: '2',
    contactName: 'Mariana Silva',
    avatar: 'MS',
    messages: [
      { id: '1', sender: 'them', text: 'Ei, você viu o código Kotlin do launcher na aba de Desenvolvedor?', time: 'Ontem' },
      { id: '2', sender: 'me', text: 'Sim! Tem o manifest com CATEGORY_HOME completo para compilar no Android Studio.', time: 'Ontem' },
    ],
  },
];

export const MessagesApp: React.FC<{ soundEnabled: boolean; accentColor: string }> = ({
  soundEnabled,
  accentColor,
}) => {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChat) return;
    playHapticClick(soundEnabled);

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...selectedChat.messages, newMsg];
    const updatedChat = { ...selectedChat, messages: updatedMessages };

    setSelectedChat(updatedChat);
    setChats((prev) => prev.map((c) => (c.id === selectedChat.id ? updatedChat : c)));
    setInputText('');

    // Simulated auto-reply
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'them',
        text: 'Mensagem recebida com sucesso no Android Launcher!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const withReply = { ...updatedChat, messages: [...updatedMessages, replyMsg] };
      setSelectedChat(withReply);
      setChats((prev) => prev.map((c) => (c.id === selectedChat.id ? withReply : c)));
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      {selectedChat ? (
        // Active Chat Screen
        <div className="h-full flex flex-col justify-between">
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedChat(null)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                {selectedChat.avatar}
              </div>
              <span className="font-semibold text-sm">{selectedChat.contactName}</span>
            </div>
            <div className="flex items-center space-x-1 text-zinc-400">
              <button className="p-2 hover:text-white">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedChat.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-blue-600 text-white rounded-br-none shadow'
                      : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 border-t border-zinc-800 flex items-center space-x-2 bg-zinc-900/40">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              style={{ backgroundColor: accentColor }}
              className="w-9 h-9 rounded-full text-zinc-950 flex items-center justify-center hover:brightness-110 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Chat List
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="text-lg font-bold">Mensagens</h2>
            <span className="text-xs text-zinc-500">{chats.length} conversas</span>
          </div>

          <div className="space-y-2">
            {chats.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    playHapticClick(soundEnabled);
                    setSelectedChat(c);
                  }}
                  className="flex items-center space-x-3 p-3 bg-zinc-900 rounded-2xl border border-zinc-800/80 cursor-pointer hover:bg-zinc-850 active:scale-[0.99] transition-all"
                >
                  <div className="w-11 h-11 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center flex-shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-semibold truncate text-white">{c.contactName}</p>
                      <span className="text-[10px] text-zinc-500">{last?.time}</span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{last?.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
