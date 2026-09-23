import React, { useState } from 'react';
import { Image as ImageIcon, X, Download, Share2, Heart } from 'lucide-react';
import { playHapticClick } from '../../utils/audio';

interface GalleryAppProps {
  photos: string[];
  soundEnabled: boolean;
}

const DEFAULT_GALLERY_PHOTOS = [
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
];

export const GalleryApp: React.FC<GalleryAppProps> = ({ photos, soundEnabled }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  const allPhotos = [...photos, ...DEFAULT_GALLERY_PHOTOS];

  return (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-white select-none">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Google Fotos</h2>
          <p className="text-xs text-zinc-400">{allPhotos.length} fotos salvas</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-3 gap-1.5">
          {allPhotos.map((url, idx) => (
            <div
              key={idx}
              onClick={() => {
                playHapticClick(soundEnabled);
                setSelectedPhoto(url);
                setLiked(false);
              }}
              className="aspect-square bg-zinc-900 overflow-hidden cursor-pointer hover:opacity-90 active:scale-95 transition-all relative rounded-lg"
            >
              <img src={url} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col justify-between animate-fade-in">
          <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="p-2 rounded-full bg-black/40 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-full bg-black/40 ${liked ? 'text-red-500' : 'text-white'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-black/40 text-white">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-2">
            <img src={selectedPhoto} alt="Visualização" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>

          <div className="p-4 text-center text-xs text-zinc-400 bg-gradient-to-t from-black/80 to-transparent">
            Tirada com a Câmera do Android Launcher
          </div>
        </div>
      )}
    </div>
  );
};
