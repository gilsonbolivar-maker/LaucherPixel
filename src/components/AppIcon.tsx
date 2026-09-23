import React from 'react';
import {
  Phone,
  MessageSquare,
  Compass,
  Camera,
  Calculator,
  Clock,
  FileText,
  Image as ImageIcon,
  Settings,
  ShoppingBag,
  Code,
  Calendar,
  Music,
  Folder,
  MapPin,
  CloudSun,
  Layers,
  Sparkles,
  Terminal,
  GitBranch,
  Send,
  Palette,
  Binary,
  FileCode,
  Globe,
  Activity,
  Cpu,
  Database,
  Workflow,
  Braces,
  Smartphone,
  Github,
  HardDrive,
  Cloud,
} from 'lucide-react';
import { IconShape } from '../types';
import { PixelNexoLogo } from './PixelNexoLogo';

interface AppIconProps {
  name: string;
  iconName: string;
  color?: string;
  gradient?: string;
  shape?: IconShape;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  unreadCount?: number;
  showLabel?: boolean;
  labelColor?: string;
  onClick?: () => void;
  className?: string;
  id?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  MessageSquare,
  Compass,
  Camera,
  Calculator,
  Clock,
  FileText,
  Image: ImageIcon,
  Settings,
  ShoppingBag,
  Code,
  Calendar,
  Music,
  Folder,
  MapPin,
  CloudSun,
  Layers,
  Sparkles,
  Terminal,
  GitBranch,
  Send,
  Palette,
  Binary,
  FileCode,
  Globe,
  Activity,
  Cpu,
  Database,
  Workflow,
  Braces,
  Smartphone,
  Github,
  HardDrive,
  Cloud,
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  iconName,
  color = '#3B82F6',
  gradient,
  shape = 'squircle',
  size = 'md',
  unreadCount,
  showLabel = true,
  labelColor = 'text-white',
  onClick,
  className = '',
  id,
}) => {
  const IconComponent = ICON_MAP[iconName] || Sparkles;

  // Size dimensions
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  // Android adaptive shape classes
  const shapeClasses = {
    circle: 'rounded-full',
    squircle: 'rounded-[22%]',
    rounded: 'rounded-xl',
    teardrop: 'rounded-2xl rounded-tr-none',
  };

  return (
    <button
      id={id || `app-icon-${name.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className={`group flex flex-col items-center justify-start text-center focus:outline-none transition-transform active:scale-90 ${className}`}
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} ${shapeClasses[shape]} flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:brightness-110 relative overflow-hidden ${
            gradient ? `bg-gradient-to-tr ${gradient}` : ''
          }`}
          style={!gradient ? { backgroundColor: color } : undefined}
        >
          {/* Subtle Material You reflection highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/15 pointer-events-none" />
          {iconName === 'PixelNexo' ? (
            <PixelNexoLogo variant="emblem" size="sm" />
          ) : (
            <IconComponent className={`${iconSizes[size]} text-white drop-shadow`} />
          )}
        </div>

        {/* Notification badge */}
        {unreadCount && unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shadow-md border-2 border-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </div>

      {showLabel && (
        <span
          className={`mt-1.5 text-xs font-medium tracking-tight truncate max-w-[70px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${labelColor}`}
        >
          {name}
        </span>
      )}
    </button>
  );
};
