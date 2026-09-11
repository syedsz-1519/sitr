import React from 'react';

interface SitrLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const SitrLogo: React.FC<SitrLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const iconDimensions = {
    sm: 18,
    md: 22,
    lg: 26,
    xl: 36,
  };

  const dim = iconDimensions[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Royal Squircle Shield Icon with Crescent Moon */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Ambient warm gold and emerald back-glow */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-600/30 via-amber-500/30 to-emerald-400/20 rounded-2xl blur-md"></div>

        {/* Shield Container */}
        <div
          className={`${sizeMap[size]} relative rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0D3827] via-[#082318] to-[#04140E] border border-amber-400/50 flex items-center justify-center shadow-[0_0_16px_rgba(212,175,55,0.3)] overflow-hidden`}
        >
          {/* Subtle inner shield highlight overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-emerald-500/10 to-transparent pointer-events-none"></div>

          {/* Precision SVG Emblem: Sculpted Shield with Islamic Crescent & Morning Star */}
          <svg
            width={dim}
            height={dim}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
          >
            <defs>
              <linearGradient id="shieldBorder" x1="5" y1="4" x2="35" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF8DB" />
                <stop offset="35%" stopColor="#F3DC87" />
                <stop offset="70%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              <linearGradient id="crescentGrad" x1="12" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FFF4D0" />
                <stop offset="80%" stopColor="#F5D061" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>

              <linearGradient id="goldStar" x1="22" y1="12" x2="26" y2="16" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Sculpted Outer Shield Silhouette */}
            <path
              d="M20 5C24.5 7.8 30 8.2 33 8.8C33 19.5 28.5 28.5 20 34C11.5 28.5 7 19.5 7 8.8C10 8.2 15.5 7.8 20 5Z"
              fill="#061F15"
              stroke="url(#shieldBorder)"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Inner Shield Contouring line */}
            <path
              d="M20 8C23.5 10.2 27.5 10.6 30 11.1C30 19.2 26.5 26.2 20 30.5C13.5 26.2 10 19.2 10 11.1C12.5 10.6 16.5 10.2 20 8Z"
              fill="none"
              stroke="#D4AF37"
              strokeOpacity="0.4"
              strokeWidth="1"
            />

            {/* Islamic Crescent Moon (Hilal of Taqwa) */}
            <path
              d="M22.5 12.5C16.8 12.8 13.5 17 14 22.2C14.5 26.8 18.5 29.5 22.8 28.8C20 27.8 18.2 25.5 18 22.5C17.8 18.8 20.2 15 22.5 12.5Z"
              fill="url(#crescentGrad)"
              filter="drop-shadow(0 0 3px rgba(212, 175, 55, 0.7))"
            />

            {/* Glowing Taqwa Star / Dawn Spark */}
            <circle cx="23.5" cy="18" r="1.4" fill="url(#goldStar)" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-lg tracking-wider text-amber-50">SITR</span>
            <span className="font-arabic text-2xl text-amber-400 font-bold leading-none select-none drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              سِتْر
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-300/80 font-semibold font-metric mt-0.5">
            Guard Your Gaze
          </span>
        </div>
      )}
    </div>
  );
};
