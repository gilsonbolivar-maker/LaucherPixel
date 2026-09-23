import React from 'react';

interface PixelNexoLogoProps {
  variant?: 'badge' | 'horizontal' | 'emblem' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const PixelNexoLogo: React.FC<PixelNexoLogoProps> = ({
  variant = 'badge',
  size = 'md',
  className = '',
  onClick,
}) => {
  // Scaling factors based on size
  const scale = {
    sm: { scale: 0.75, height: 'h-8', textPixel: 'text-[11px]', textNexo: 'text-[13px]', gap: 'gap-1.5', px: 'px-2.5 py-1' },
    md: { scale: 1, height: 'h-10', textPixel: 'text-[13px]', textNexo: 'text-[16px]', gap: 'gap-2', px: 'px-3.5 py-1.5' },
    lg: { scale: 1.35, height: 'h-14', textPixel: 'text-[17px]', textNexo: 'text-[21px]', gap: 'gap-3', px: 'px-5 py-2.5' },
    xl: { scale: 1.7, height: 'h-18', textPixel: 'text-[22px]', textNexo: 'text-[28px]', gap: 'gap-4', px: 'px-6 py-3.5' },
  }[size];

  // The Hexagon emblem with 6-spoke node core (Golden-yellow)
  const HexagonEmblem = (
    <svg
      width={28 * scale.scale}
      height={32 * scale.scale}
      viewBox="0 0 28 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 drop-shadow-[0_0_8px_rgba(245,185,66,0.35)]"
    >
      {/* Outer Hexagon */}
      <polygon
        points="14,2 26,8.9 26,23.1 14,30 2,23.1 2,8.9"
        stroke="#F5B942"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="rgba(245, 185, 66, 0.05)"
      />
      {/* Central 6-spoke inner rays */}
      <line x1="14" y1="16" x2="14" y2="3" stroke="#F5B942" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="16" x2="25" y2="9.5" stroke="#F5B942" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="16" x2="25" y2="22.5" stroke="#F5B942" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="16" x2="14" y2="29" stroke="#F5B942" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="16" x2="3" y2="22.5" stroke="#F5B942" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="16" x2="3" y2="9.5" stroke="#F5B942" strokeWidth="2" strokeLinecap="round" />
      {/* Glowing Center Hub */}
      <circle cx="14" cy="16" r="3.2" fill="#F5B942" />
    </svg>
  );

  // The 3x3 Pixel matrix in gradient gold & amber tones
  const PixelMatrix = (
    <div
      className="grid grid-cols-3 gap-[3px] flex-shrink-0"
      style={{
        width: `${24 * scale.scale}px`,
        height: `${24 * scale.scale}px`,
      }}
    >
      {/* 9 rounded pixel blocks matching the brand image */}
      <div className="rounded-[2.5px] bg-[#F5B942]" />
      <div className="rounded-[2.5px] bg-[#F5B942]" />
      <div className="rounded-[2.5px] bg-[#E09D30]" />

      <div className="rounded-[2.5px] bg-[#F5B942]" />
      <div className="rounded-[2.5px] bg-[#FCD34D]" />
      <div className="rounded-[2.5px] bg-[#9D681C]" />

      <div className="rounded-[2.5px] bg-[#B98124]" />
      <div className="rounded-[2.5px] bg-[#E5A835]" />
      <div className="rounded-[2.5px] bg-[#F5B942]" />
    </div>
  );

  // Typography: PIXEL (White) & NEXO (Gold)
  const BrandTypography = (
    <div className="flex flex-col justify-center leading-none select-none text-left">
      <span
        className={`font-sans font-bold text-white tracking-[0.22em] ${scale.textPixel} uppercase`}
        style={{ letterSpacing: '0.2em' }}
      >
        PIXEL
      </span>
      <span
        className={`font-sans font-extrabold text-[#F5B942] tracking-[0.16em] ${scale.textNexo} uppercase mt-0.5`}
        style={{ letterSpacing: '0.14em' }}
      >
        NEXO
      </span>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} onClick={onClick}>
        {HexagonEmblem}
      </div>
    );
  }

  if (variant === 'emblem') {
    return (
      <div
        className={`inline-flex items-center ${scale.gap} ${className}`}
        onClick={onClick}
      >
        {HexagonEmblem}
        {PixelMatrix}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div
        className={`inline-flex items-center ${scale.gap} ${className}`}
        onClick={onClick}
      >
        {HexagonEmblem}
        {PixelMatrix}
        <div className="w-[1px] h-6 bg-purple-800/60 mx-1" />
        {BrandTypography}
      </div>
    );
  }

  // Default: 'badge' (the exact pill enclosure from the user's reference image)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${scale.gap} ${scale.px} rounded-2xl bg-[#23083B] border-[1.5px] border-[#8022B8] shadow-[0_4px_20px_rgba(35,8,59,0.7),0_0_15px_rgba(128,34,184,0.35)] transition-transform active:scale-98 cursor-default ${className}`}
    >
      <div className="flex items-center space-x-2">
        {HexagonEmblem}
        {PixelMatrix}
      </div>
      <div className="pl-1">
        {BrandTypography}
      </div>
    </div>
  );
};
