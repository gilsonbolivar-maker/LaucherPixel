import React, { useState, useRef, useEffect } from 'react';
import { Camera, SwitchCamera, Zap, ZapOff, Image as ImageIcon, Check } from 'lucide-react';
import { playCameraShutter } from '../../utils/audio';

interface CameraAppProps {
  soundEnabled: boolean;
  onPhotoTaken?: (photoUrl: string) => void;
}

export const CameraApp: React.FC<CameraAppProps> = ({ soundEnabled, onPhotoTaken }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [flashAnim, setFlashAnim] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.warn('Camera access not granted or not available:', err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const capturePhoto = () => {
    playCameraShutter(soundEnabled);
    setFlashAnim(true);
    setTimeout(() => setFlashAnim(false), 120);

    let photoUrl = '';
    if (videoRef.current && hasPermission) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          photoUrl = canvas.toDataURL('image/jpeg');
        }
      } catch (e) {
        // canvas export error
      }
    }

    if (!photoUrl) {
      // Fallback simulated camera snapshot
      photoUrl = `https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80&sig=${Date.now()}`;
    }

    setCapturedPhotos((prev) => [photoUrl, ...prev]);
    if (onPhotoTaken) {
      onPhotoTaken(photoUrl);
    }
  };

  return (
    <div className="relative h-full bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* Flash effect overlay */}
      {flashAnim && <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-fade-out" />}

      {/* Top Camera Controls */}
      <div className="absolute top-0 inset-x-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={() => setFlash(!flash)}
          className="p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md"
        >
          {flash ? <Zap className="w-5 h-5 text-amber-400" /> : <ZapOff className="w-5 h-5" />}
        </button>

        <span className="text-xs font-semibold tracking-wider text-white/80 uppercase bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          Foto
        </span>

        <button
          onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
          className="p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md"
        >
          <SwitchCamera className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder Center */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />

        {/* Viewfinder grid overlays */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 border border-white/20">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div />
        </div>

        {hasPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-zinc-400 bg-zinc-950/80">
            <Camera className="w-12 h-12 mb-2 text-zinc-500" />
            <p className="text-sm font-medium text-zinc-200">Modo Simulação de Câmera</p>
            <p className="text-xs mt-1 text-zinc-400">
              Permissão de câmera não concedida ou dispositivo sem webcam. O obturador registrará fotos simuladas de alta qualidade.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Shutter & Controls */}
      <div className="p-6 bg-black/90 flex items-center justify-around z-20">
        {/* Gallery preview thumbnail */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 bg-zinc-800 flex items-center justify-center">
          {capturedPhotos.length > 0 ? (
            <img src={capturedPhotos[0]} alt="Última foto" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-zinc-500" />
          )}
        </div>

        {/* Shutter Button */}
        <button
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-95 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-white hover:bg-zinc-200 shadow-inner" />
        </button>

        {/* Mode selector or photo counter */}
        <div className="w-12 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono text-zinc-400 font-bold">{capturedPhotos.length}</span>
          <span className="text-[10px] text-zinc-500">fotos</span>
        </div>
      </div>
    </div>
  );
};
