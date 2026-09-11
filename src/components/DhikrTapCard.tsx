import React, { useState } from 'react';
import { RefreshCw, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSitrStore } from '../store/useSitrStore';
import { DHIKR_OPTIONS } from '../data/dhikr';
import { dhikrAmbientAudio } from '../utils/ambientAudioEngine';

interface DhikrTapCardProps {
  compact?: boolean;
  forcedType?: string;
  onSessionComplete?: () => void;
}

export const DhikrTapCard: React.FC<DhikrTapCardProps> = ({
  compact = false,
  forcedType,
  onSessionComplete,
}) => {
  const {
    dhikrCount,
    dhikrTarget,
    selectedDhikrType,
    incrementDhikr,
    resetDhikr,
  } = useSitrStore();

  const [isPressing, setIsPressing] = useState(false);

  // Pick current dhikr info
  const activeType = forcedType || selectedDhikrType;
  const currentDhikr =
    DHIKR_OPTIONS.find((d) => d.id === activeType) || DHIKR_OPTIONS[0];

  const radius = compact ? 54 : 66;
  const strokeWidth = compact ? 6 : 7;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, dhikrCount / dhikrTarget);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const isComplete = dhikrCount >= dhikrTarget;
  const remaining = Math.max(0, dhikrTarget - dhikrCount);

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const willComplete = dhikrCount + 1 >= dhikrTarget;

    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (willComplete) {
          navigator.vibrate([35, 50, 60]);
        } else {
          navigator.vibrate(20);
        }
      } catch {
        // Silently ignore if vibrations not supported
      }
    }

    // Subtle acoustic misbaha bead click
    dhikrAmbientAudio.playBeadClick();

    incrementDhikr();

    if (willComplete && !isComplete) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#A78BFA', '#F59E0B', '#10B981', '#DDD6FE'],
      });
      if (onSessionComplete) {
        onSessionComplete();
      }
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#061D14] border border-amber-500/30 p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
      {/* Soft atmospheric ambient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Prompt */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-300 font-metric">
          Tap {dhikrTarget} times — let it calm your chest
        </span>
      </div>

      {/* Arabic Dhikr Calligraphy */}
      <h3 className="font-arabic text-2xl sm:text-3xl text-amber-50 my-2 leading-relaxed tracking-wide select-none drop-shadow-sm">
        {currentDhikr.arabic}
      </h3>

      {/* Transliteration & Meaning */}
      <p className="text-xs text-emerald-200/80 font-medium max-w-xs leading-normal opacity-90 mb-4">
        <span className="text-amber-300 font-semibold">{currentDhikr.transliteration}</span>
        <span className="mx-1.5 opacity-60">•</span>
        <span>{currentDhikr.meaning}</span>
      </p>

      {/* Circular Interactive Misbaha Tap Counter */}
      <div className="relative flex items-center justify-center my-2">
        <button
          onClick={handleTap}
          aria-label="Tap to increment Dhikr"
          className={`relative rounded-full flex flex-col items-center justify-center bg-[#08261A] shadow-[0_0_24px_rgba(212,175,55,0.25)] transition-transform duration-100 focus:outline-none cursor-pointer group ${
            compact ? 'w-36 h-36' : 'w-44 h-44'
          } ${isPressing ? 'scale-95' : 'active:scale-95'}`}
          type="button"
        >
          {/* SVG Animated Progress Arc */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 160 160"
          >
            {/* Background Track */}
            <circle
              className="text-[#04160E]"
              cx="80"
              cy="80"
              fill="none"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
            />
            {/* Dynamic Fill Circle */}
            <circle
              className={`transition-all duration-200 ${
                isComplete ? 'text-amber-400' : 'text-emerald-500'
              }`}
              cx="80"
              cy="80"
              fill="none"
              r={radius}
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              style={{
                filter: isComplete
                  ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.7))'
                  : 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))',
              }}
            />
          </svg>

          {/* Inner Soft Tactile Core */}
          <div
            className={`rounded-full bg-gradient-to-b from-[#0B3824] to-[#04160E] border border-amber-500/30 flex flex-col items-center justify-center shadow-inner pointer-events-none group-active:from-emerald-900/40 ${
              compact ? 'w-24 h-24' : 'w-30 h-30'
            }`}
          >
            {isComplete ? (
              <div className="flex flex-col items-center justify-center">
                <Check className="w-8 h-8 text-amber-300 stroke-[3] animate-bounce" />
                <span className="text-[10px] font-bold text-amber-200 mt-1 uppercase font-metric tracking-wider">
                  MashaAllah
                </span>
              </div>
            ) : (
              <>
                <span className="font-metric text-4xl sm:text-5xl font-bold text-white leading-none">
                  {dhikrCount}
                </span>
                <span className="text-xs text-amber-300/80 font-metric mt-1">
                  / {dhikrTarget}
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Remaining Status Indicator & Reset Trigger */}
      <div className="flex items-center justify-between w-full max-w-[240px] mt-4 pt-1">
        <span
          className={`text-xs uppercase font-metric tracking-wider font-semibold ${
            isComplete ? 'text-amber-300' : 'text-emerald-300/80'
          }`}
        >
          {isComplete ? 'Complete — Alhamdulillah' : `${remaining} remaining`}
        </span>
        <button
          onClick={resetDhikr}
          aria-label="Reset Dhikr counter"
          className="text-xs font-metric text-amber-300 hover:text-amber-100 uppercase tracking-wider flex items-center gap-1 focus:outline-none transition-colors cursor-pointer"
          type="button"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>
    </div>
  );
};
