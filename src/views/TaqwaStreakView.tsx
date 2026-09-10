import React from 'react';
import {
  Award,
  Sparkles,
  Check,
  Lock,
  BookOpen,
  Sprout,
  Flame,
  Star,
  Moon,
  Trophy,
  Crown,
  Diamond,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSitrStore } from '../store/useSitrStore';
import { MILESTONES } from '../data/ayahs';
import { TaqwaProgressionPattern } from '../components/TaqwaProgressionPattern';

export const TaqwaStreakView: React.FC = () => {
  const {
    currentStreak,
    hasSealedNiyyahToday,
    sealNiyyah,
  } = useSitrStore();

  // Find next locked milestone or fallback to highest
  const nextMilestone =
    MILESTONES.find((m) => m.days > currentStreak) ||
    MILESTONES[MILESTONES.length - 1];

  const daysLeft = Math.max(0, nextMilestone.days - currentStreak);
  const progressPercent = Math.min(
    100,
    Math.round((currentStreak / nextMilestone.days) * 100)
  );

  const completedCount = MILESTONES.filter((m) => currentStreak >= m.days).length;

  // Determine current achievement badge title
  const currentAchievement = [...MILESTONES]
    .reverse()
    .find((m) => currentStreak >= m.days)?.name || 'First Step';

  const handleSealNiyyah = () => {
    if (hasSealedNiyyahToday) return;

    // Haptic pulse
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 60]);
      } catch {
        // Silently ignore
      }
    }

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#A78BFA', '#F59E0B', '#10B981', '#DDD6FE'],
    });

    sealNiyyah();
  };

  // Helper for milestone icons matching exact screenshot
  const renderMilestoneIcon = (days: number) => {
    switch (days) {
      case 1:
        return <span className="text-xl">🌱</span>;
      case 3:
        return <span className="text-xl">🌿</span>;
      case 7:
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400/30" />;
      case 14:
        return <Moon className="w-5 h-5 text-amber-300 fill-amber-300/30" />;
      case 21:
        return <Flame className="w-5 h-5 text-orange-400 fill-orange-400/30" />;
      case 30:
        return <Trophy className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
      case 40:
        return <Diamond className="w-5 h-5 text-sky-400" />;
      case 100:
        return <Crown className="w-5 h-5 text-amber-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-300" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-md mx-auto">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none" role="img" aria-label="Trophy">
            🏆
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight font-sans">
            Taqwa Streak
          </h1>
        </div>
        <p className="text-xs text-purple-200/80 mt-1 font-sans">
          Every clean day is an act of worship, bhai.
        </p>
      </div>

      {/* Hero Streak Card (Exact Pattern from Screenshot) */}
      <div className="rounded-3xl bg-gradient-to-b from-[#6D28D9] via-[#4C1D95] to-[#250D52] border border-purple-400/30 p-6 sm:p-7 flex flex-col items-center text-center shadow-[0_12px_45px_rgba(109,40,217,0.38)] relative overflow-hidden">
        {/* Subtle luminous top radiance */}
        <div className="absolute -top-12 inset-x-0 h-32 bg-purple-400/20 blur-3xl pointer-events-none"></div>

        {/* Circular Seedling Sprout Container */}
        <div className="relative w-20 h-20 rounded-full bg-[#35146D]/80 border border-purple-400/25 flex items-center justify-center mb-3 shadow-inner">
          <div className="w-12 h-12 rounded-full bg-[#491C94]/60 flex items-center justify-center">
            <Sprout className="w-8 h-8 text-emerald-400 stroke-[2.4]" />
          </div>
        </div>

        {/* Tracked Label */}
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-purple-200/90 font-metric">
          CURRENT STREAK
        </span>

        {/* Big Number */}
        <div className="my-1">
          <span className="font-metric text-7xl font-extrabold text-white leading-none tracking-tight">
            {currentStreak}
          </span>
        </div>

        {/* Clean Day / Days Subtitle */}
        <span className="text-sm font-medium text-purple-200 font-metric">
          {currentStreak === 1 ? 'clean day' : 'clean days'}
        </span>

        {/* Achievement Pill Badge with Verified Seal */}
        <div className="mt-3.5 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1F0C42]/85 border border-purple-400/30 text-white text-xs font-semibold shadow-sm">
          <span>{currentAchievement} Achieved</span>
          <div className="w-4 h-4 rounded-full bg-amber-400/25 border border-amber-400/60 flex items-center justify-center text-amber-300">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        </div>

        {/* Tap to Seal Today's Niyyah Button */}
        <div className="w-full mt-4 pt-4 border-t border-purple-400/20 flex justify-center">
          <button
            onClick={handleSealNiyyah}
            disabled={hasSealedNiyyahToday}
            className={`text-xs flex items-center gap-1.5 font-medium transition-all select-none ${
              hasSealedNiyyahToday
                ? 'text-emerald-300 cursor-default'
                : 'text-purple-200 hover:text-white active:scale-95 cursor-pointer'
            }`}
            type="button"
          >
            {hasSealedNiyyahToday ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Today’s Niyyah Sealed • الحمد لله</span>
              </>
            ) : (
              <>
                <span className="text-sm">👆</span>
                <span>Tap to seal today&apos;s niyyah</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Next Milestone Card */}
      <div className="rounded-2xl bg-[#160B29] border border-purple-900/40 p-4 sm:p-5 flex flex-col gap-3 shadow-lg">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 text-xs">⭐</span>
            <span className="text-[10px] uppercase font-metric tracking-widest text-amber-400 font-bold">
              NEXT MILESTONE
            </span>
          </div>
          <div className="bg-[#20103A] border border-purple-800/40 text-[10px] font-metric font-semibold text-purple-200 px-2.5 py-0.5 rounded-full">
            {daysLeft > 0 ? `In ${daysLeft} ${daysLeft === 1 ? 'Day' : 'Days'}` : 'Unlocked!'}
          </div>
        </div>

        {/* Middle Content Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Squircle Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#231240] border border-purple-700/30 flex items-center justify-center shrink-0 text-xl shadow-inner">
              {renderMilestoneIcon(nextMilestone.days)}
            </div>

            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {nextMilestone.name}
                </h2>
                <span className="text-xs text-purple-300/70 font-metric font-semibold">
                  {nextMilestone.days}d
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5 leading-snug line-clamp-1">
                {nextMilestone.line}
              </p>
            </div>
          </div>

          {/* Circular Dial Progress */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
              <circle
                className="text-[#2B1B48]"
                cx="30"
                cy="30"
                fill="none"
                r="24"
                stroke="currentColor"
                strokeWidth="5"
              />
              <circle
                className="text-amber-400"
                cx="30"
                cy="30"
                fill="none"
                r="24"
                stroke="currentColor"
                strokeDasharray={150.79}
                strokeDashoffset={150.79 - (progressPercent / 100) * 150.79}
                strokeLinecap="round"
                strokeWidth="5"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-white font-metric">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Visual Progression Pattern: Luminous Trail & Celestial Orbit Ring */}
      <TaqwaProgressionPattern />

      {/* All Milestones List Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-base select-none" role="img" aria-label="Trophy">
              🏆
            </span>
            <span className="text-sm font-bold text-white font-sans tracking-tight">
              All Milestones
            </span>
          </div>
          <span className="text-[10px] font-bold font-metric tracking-widest text-amber-400">
            {completedCount} OF {MILESTONES.length} COMPLETED
          </span>
        </div>

        {/* 8 Milestones Cards */}
        <div className="space-y-2.5">
          {MILESTONES.map((m) => {
            const isUnlocked = currentStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-[#1D1136] border-purple-500/40 border-l-4 border-l-purple-300 shadow-md'
                    : 'bg-[#140B24]/90 border-purple-900/25 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Milestone Squircle Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isUnlocked
                        ? 'bg-[#28144E] border-purple-500/40 text-emerald-400'
                        : 'bg-[#1D0F34] border-purple-900/30 text-purple-400/50'
                    }`}
                  >
                    {renderMilestoneIcon(m.days)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{m.name}</span>
                      {isUnlocked && (
                        <span className="bg-[#3B1578] text-purple-200 border border-purple-500/40 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded font-metric tracking-wider">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-purple-200/80 leading-normal mt-0.5 line-clamp-1">
                      {m.line}
                    </p>
                  </div>
                </div>

                {/* Right State: Days & Checkmark / Lock */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-metric font-semibold text-purple-300">
                    {m.days}d
                  </span>

                  {isUnlocked ? (
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/50">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-purple-400/40" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DIVINE PROMISE Card (Exact from Screenshot) */}
      <div className="rounded-2xl bg-[#140A24] border border-purple-900/40 p-6 text-center flex flex-col items-center shadow-lg">
        {/* Book Icon Circular Badge */}
        <div className="w-9 h-9 rounded-xl bg-[#241142] border border-purple-700/40 flex items-center justify-center text-purple-300 mb-2.5">
          <BookOpen className="w-4 h-4 text-purple-300" />
        </div>

        {/* Header Eyebrow */}
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300/80 font-metric mb-2">
          DIVINE PROMISE
        </span>

        {/* Arabic Calligraphy */}
        <p className="font-arabic text-2xl sm:text-3xl text-amber-400 font-bold leading-relaxed select-none" dir="rtl">
          قَدْ أَفْلَحَ مَن زَكَّاهَا
        </p>

        {/* English Translation */}
        <p className="text-xs text-purple-100/90 italic font-sans mt-1">
          “He who purifies it will succeed.”
        </p>

        {/* Reference Pill */}
        <div className="mt-3 inline-block px-3 py-1 rounded-full bg-[#20103A] border border-purple-800/40 text-[10px] font-metric font-semibold text-purple-300">
          Surah Ash-Shams • 91:9
        </div>
      </div>
    </div>
  );
};
