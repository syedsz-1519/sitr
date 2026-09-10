import React, { useState } from 'react';
import {
  Check,
  Lock,
  Sparkles,
  Flame,
  Star,
  Moon,
  Trophy,
  Crown,
  Diamond,
  Compass,
  Route,
  Zap,
  ChevronRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { MILESTONES } from '../data/ayahs';

interface MilestoneExtraInfo {
  days: number;
  wisdom: string;
  hadithOrAyah: string;
  source: string;
  neuroscience: string;
}

const MILESTONE_EXTRAS: Record<number, MilestoneExtraInfo> = {
  1: {
    days: 1,
    wisdom: 'Every righteous endeavor begins with pure intention (Ikhlas). Today, your shield is raised.',
    hadithOrAyah: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ — Actions are by intentions.',
    source: 'Sahih al-Bukhari 1',
    neuroscience: 'The initial decision interrupts automatic compulsive stimulus loops.',
  },
  3: {
    days: 3,
    wisdom: 'The Sunnah emphasizes intervals of three in purification, reflection, and habit initiation.',
    hadithOrAyah: 'The Prophet ﷺ loved consistency even if small.',
    source: 'Sunan an-Nasa’i',
    neuroscience: 'Acute dopamine withdrawal peaks around 72 hours; enduring this rebuilds baseline patience.',
  },
  7: {
    days: 7,
    wisdom: 'One full week of guarding your gaze, through Jummu’ah and daily salah.',
    hadithOrAyah: 'Whoever leaves something for the sake of Allah, Allah replaces it with better.',
    source: 'Musnad Ahmad',
    neuroscience: 'Prefrontal cortex executive control strengthens as urges are consciously redirected into dhikr.',
  },
  14: {
    days: 14,
    wisdom: 'Two full weeks unbroken. What began as resistance becomes calm natural restraint.',
    hadithOrAyah: 'The most beloved deeds to Allah are those done regularly, even if small.',
    source: 'Sahih Muslim',
    neuroscience: 'Craving frequency drops noticeably as new non-compulsive habits solidify.',
  },
  21: {
    days: 21,
    wisdom: 'Twenty-one days. In Islamic tarbiyah and classical habit psychology, a deep milestone.',
    hadithOrAyah: 'Patience is at the first stroke of a calamity, and steadfastness is the crown.',
    source: 'Riyad as-Salihin',
    neuroscience: 'Neuroplasticity establishes alternative pathways; your default response to triggers is now dhikr.',
  },
  30: {
    days: 30,
    wisdom: 'One full month of clean eyes and heart — akin to the blessed discipline of Ramadan.',
    hadithOrAyah: 'Fasting is a shield (الصِّيَامُ جُنَّةٌ).',
    source: 'Sahih al-Bukhari',
    neuroscience: 'Dopamine receptor sensitivity is restored; authentic joy in prayer and Quran returns.',
  },
  40: {
    days: 40,
    wisdom: 'Forty days of sincere devotion is a prophetic catalyst for heart transformation.',
    hadithOrAyah: 'Whoever worships Allah sincerely for 40 days, wisdom will flow from his heart onto his tongue.',
    source: 'Hilyat al-Awliya',
    neuroscience: 'Compulsive neural pathways begin true synaptic pruning; mental fog clears.',
  },
  100: {
    days: 100,
    wisdom: 'A century of clean days. Nafs al-Mutma’innah — the serene soul that is at peace with its Lord.',
    hadithOrAyah: 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً',
    source: 'Surah Al-Fajr • 89:27-28',
    neuroscience: 'Permanent cognitive rewiring; supreme self-command and profound spiritual serenity.',
  },
};

export const TaqwaProgressionPattern: React.FC = () => {
  const { currentStreak, setStreakDays } = useSitrStore();
  const [viewMode, setViewMode] = useState<'path' | 'ring'>('path');
  const [selectedMilestone, setSelectedMilestone] = useState<number>(() => {
    const next = MILESTONES.find((m) => m.days > currentStreak);
    return next ? next.days : 1;
  });
  const [showSimulator, setShowSimulator] = useState(false);

  // Helper for milestone icons
  const renderMilestoneIcon = (days: number, isUnlocked: boolean, isActive: boolean) => {
    const iconClass = isUnlocked
      ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
      : isActive
      ? 'text-purple-200'
      : 'text-purple-400/50';

    switch (days) {
      case 1:
        return <span className="text-xl select-none">🌱</span>;
      case 3:
        return <span className="text-xl select-none">🌿</span>;
      case 7:
        return <Star className={`w-5 h-5 ${iconClass} fill-amber-400/40`} />;
      case 14:
        return <Moon className={`w-5 h-5 ${iconClass} fill-amber-300/40`} />;
      case 21:
        return <Flame className={`w-5 h-5 ${iconClass} fill-orange-400/40`} />;
      case 30:
        return <Trophy className={`w-5 h-5 ${iconClass} fill-amber-400/30`} />;
      case 40:
        return <Diamond className={`w-5 h-5 ${iconClass}`} />;
      case 100:
        return <Crown className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Sparkles className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const selectedInfo = MILESTONES.find((m) => m.days === selectedMilestone) || MILESTONES[0];
  const extraInfo = MILESTONE_EXTRAS[selectedMilestone] || MILESTONE_EXTRAS[1];

  // Coordinates for the 8 milestones in the winding S-curve path
  // Standardized viewBox 320w x 640h
  const pathNodes = [
    { days: 1, x: 80, y: 45, side: 'left' },
    { days: 3, x: 230, y: 115, side: 'right' },
    { days: 7, x: 90, y: 195, side: 'left' },
    { days: 14, x: 235, y: 275, side: 'right' },
    { days: 21, x: 85, y: 355, side: 'left' },
    { days: 30, x: 230, y: 435, side: 'right' },
    { days: 40, x: 95, y: 515, side: 'left' },
    { days: 100, x: 160, y: 600, side: 'center' },
  ];

  // Construct smooth SVG path through the 8 nodes
  const pathD = `
    M 80 45
    C 160 55, 220 75, 230 115
    C 240 155, 100 155, 90 195
    C 80 235, 225 235, 235 275
    C 245 315, 95 315, 85 355
    C 75 395, 220 395, 230 435
    C 240 475, 105 475, 95 515
    C 85 555, 140 575, 160 600
  `;

  // Calculate percentage of path illuminated
  // Calculate index of current streak
  let illuminatedPercent = 0;
  for (let i = 0; i < MILESTONES.length; i++) {
    const m = MILESTONES[i];
    if (currentStreak >= m.days) {
      const nextM = MILESTONES[i + 1];
      if (nextM) {
        const stepProgress = Math.min(1, (currentStreak - m.days) / (nextM.days - m.days));
        illuminatedPercent = ((i + stepProgress) / (MILESTONES.length - 1)) * 100;
      } else {
        illuminatedPercent = 100;
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Header & View Mode Switcher */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Journey Progression
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Path vs Ring Switcher */}
          <div className="flex items-center p-0.5 rounded-full bg-[#180B2D] border border-purple-800/50 text-[10px] font-metric font-semibold">
            <button
              onClick={() => setViewMode('path')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                viewMode === 'path'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
              type="button"
            >
              <Route className="w-3 h-3" />
              <span>Trail</span>
            </button>
            <button
              onClick={() => setViewMode('ring')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                viewMode === 'ring'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
              type="button"
            >
              <Compass className="w-3 h-3" />
              <span>Orbit</span>
            </button>
          </div>

          {/* Quick Simulator Toggle */}
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            title="Simulate Streak Advancement"
            className={`p-1.5 rounded-full border transition-all ${
              showSimulator
                ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                : 'bg-[#180B2D] border-purple-800/40 text-purple-300 hover:text-white'
            }`}
            type="button"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Quick Testing Bar (Makes advancement tangible immediately) */}
      {showSimulator && (
        <div className="p-3 rounded-2xl bg-[#1D0F35] border border-amber-500/30 space-y-2 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Taqwa Streak Progression Simulator</span>
            </div>
            <span className="text-purple-300 font-metric font-bold">
              Current: {currentStreak}d
            </span>
          </div>

          <p className="text-[10px] text-purple-200/80 leading-tight">
            Tap to test how the path and celestial ring illuminate as you advance through clean days:
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setStreakDays(currentStreak + 1)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-metric transition-colors"
              type="button"
            >
              +1 Day
            </button>
            {[1, 3, 7, 14, 21, 30, 40, 100].map((d) => (
              <button
                key={d}
                onClick={() => setStreakDays(d)}
                className={`px-2 py-1 rounded-lg text-[10px] font-metric font-semibold border transition-all ${
                  currentStreak === d
                    ? 'bg-amber-400 text-black border-amber-400 shadow-md font-bold'
                    : 'bg-[#28144E] hover:bg-[#341A66] border-purple-700/40 text-purple-200'
                }`}
                type="button"
              >
                {d}d
              </button>
            ))}
            <button
              onClick={() => setStreakDays(0)}
              className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-metric"
              type="button"
            >
              Reset 0d
            </button>
          </div>
        </div>
      )}

      {/* VISUAL PATTERN CONTAINER */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#180C30] via-[#120723] to-[#0D041A] border border-purple-500/30 p-5 sm:p-6 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Subtle background stars / nebula glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 1. WINDING PATH VIEW */}
        {viewMode === 'path' && (
          <div className="relative w-full max-w-[320px] mx-auto py-2">
            {/* SVG Illuminated Conduit Track */}
            <svg
              className="w-full h-auto overflow-visible pointer-events-none"
              viewBox="0 0 320 640"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glowing Illuminated Gradient */}
                <linearGradient id="illuminatedTrail" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="40%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base Inactive Track */}
              <path
                d={pathD}
                stroke="#2B144E"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="6 8"
                opacity="0.75"
              />

              {/* Illuminated Active Glowing Energy Track */}
              <path
                d={pathD}
                stroke="url(#illuminatedTrail)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#glowFilter)"
                style={{
                  strokeDasharray: 980,
                  strokeDashoffset: 980 - (Math.max(4, illuminatedPercent) / 100) * 980,
                  transition: 'stroke-dashoffset 0.8s ease-in-out',
                }}
              />
            </svg>

            {/* Waypoint Interactive Nodes on the Path */}
            {pathNodes.map((node) => {
              const milestone = MILESTONES.find((m) => m.days === node.days)!;
              const isUnlocked = currentStreak >= node.days;
              const isSelected = selectedMilestone === node.days;

              // Find if this is the active current target
              const nextM = MILESTONES.find((m) => m.days > currentStreak);
              const isActiveTarget = nextM?.days === node.days;

              return (
                <div
                  key={node.days}
                  onClick={() => setSelectedMilestone(node.days)}
                  style={{
                    left: `${(node.x / 320) * 100}%`,
                    top: `${(node.y / 640) * 100}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 select-none group"
                >
                  {/* Outer Radiant Aura when Unlocked or Active Target */}
                  {isUnlocked && (
                    <div className="absolute -inset-2 bg-amber-400/25 rounded-full blur-md animate-pulse pointer-events-none"></div>
                  )}
                  {isActiveTarget && !isUnlocked && (
                    <div className="absolute -inset-3 bg-purple-500/35 rounded-full blur-md animate-pulse pointer-events-none"></div>
                  )}

                  {/* Main Node Squircle */}
                  <div
                    className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-[#2E1458] to-[#1C0B36] border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                        : isActiveTarget
                        ? 'bg-gradient-to-b from-[#261247] to-[#180931] border-2 border-purple-400/90 shadow-[0_0_18px_rgba(168,85,247,0.4)] ring-4 ring-purple-500/30'
                        : 'bg-[#150A24] border border-purple-900/40 opacity-70 hover:opacity-100'
                    } ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#130B24]' : ''}`}
                  >
                    {/* Milestone Icon */}
                    {renderMilestoneIcon(node.days, isUnlocked, isActiveTarget)}

                    {/* Day Pill */}
                    <span
                      className={`text-[10px] font-metric font-extrabold leading-none mt-0.5 ${
                        isUnlocked ? 'text-amber-300' : 'text-purple-300/80'
                      }`}
                    >
                      {node.days}d
                    </span>

                    {/* Top Right Verified Check / Lock Badge */}
                    <div className="absolute -top-1.5 -right-1.5">
                      {isUnlocked ? (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black flex items-center justify-center shadow-md font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : isActiveTarget ? (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md font-bold text-[9px]">
                          ⚡
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#120722] border border-purple-800/40 text-purple-400/40 flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Milestone Label */}
                  <div
                    className={`absolute top-full mt-1.5 whitespace-nowrap -translate-x-1/2 left-1/2 px-2 py-0.5 rounded-full text-[9px] font-semibold transition-all ${
                      isUnlocked
                        ? 'bg-[#29134C] text-amber-300 border border-amber-400/40 shadow-sm'
                        : isActiveTarget
                        ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] font-bold'
                        : 'bg-[#150B24]/90 text-purple-300/70 border border-purple-900/30'
                    }`}
                  >
                    {milestone.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. CELESTIAL ORBIT RING VIEW */}
        {viewMode === 'ring' && (
          <div className="relative w-full max-w-[290px] mx-auto py-6 flex items-center justify-center">
            {/* Big Celestial SVG Dial */}
            <svg className="w-64 h-64 overflow-visible" viewBox="0 0 260 260">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>

              {/* Background Orbit Ring */}
              <circle
                cx="130"
                cy="130"
                r="95"
                fill="none"
                stroke="#2B144E"
                strokeWidth="5"
                strokeDasharray="4 6"
              />

              {/* Illuminated Arc */}
              <circle
                cx="130"
                cy="130"
                r="95"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={596.9}
                strokeDashoffset={596.9 - (Math.max(4, illuminatedPercent) / 100) * 596.9}
                transform="rotate(-90 130 130)"
                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.7))"
              />
            </svg>

            {/* Central Sun Core */}
            <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#35146D] to-[#1B0A38] border-2 border-purple-400/40 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(124,58,237,0.4)] z-0">
              <span className="text-[9px] uppercase font-metric tracking-widest text-purple-300 font-bold">
                TAQWA
              </span>
              <span className="font-metric text-3xl font-black text-white leading-none my-0.5">
                {currentStreak}
              </span>
              <span className="text-[9px] text-amber-300 font-medium font-metric">
                {currentStreak === 1 ? 'day clean' : 'days clean'}
              </span>
            </div>

            {/* Ring Satellite Nodes */}
            {MILESTONES.map((m, idx) => {
              // Distribute 8 milestones evenly around 360 degrees
              const angleDeg = -90 + idx * (360 / 8);
              const angleRad = (angleDeg * Math.PI) / 180;
              const radius = 95; // Radius in SVG pixels
              const cx = 130 + radius * Math.cos(angleRad);
              const cy = 130 + radius * Math.sin(angleRad);

              const isUnlocked = currentStreak >= m.days;
              const isSelected = selectedMilestone === m.days;

              return (
                <div
                  key={m.days}
                  onClick={() => setSelectedMilestone(m.days)}
                  style={{
                    left: `${(cx / 260) * 100}%`,
                    top: `${(cy / 260) * 100}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 select-none group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isUnlocked
                        ? 'bg-[#2E1458] border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-110'
                        : 'bg-[#150A24] border border-purple-900/50 text-purple-400/50 hover:border-purple-600'
                    } ${isSelected ? 'ring-2 ring-white' : ''}`}
                  >
                    {renderMilestoneIcon(m.days, isUnlocked, false)}
                  </div>
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-metric font-bold text-purple-200">
                    {m.days}d
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Milestone Wisdom / Deep Inspection Card */}
        <div className="mt-5 p-4 rounded-2xl bg-[#140A26]/95 border border-purple-700/40 relative overflow-hidden shadow-inner">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#231240] border border-purple-600/40 flex items-center justify-center text-lg shrink-0">
                {renderMilestoneIcon(selectedInfo.days, currentStreak >= selectedInfo.days, true)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    {selectedInfo.name}
                  </h4>
                  <span className="text-[10px] font-metric font-semibold text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded-full border border-purple-800/40">
                    {selectedInfo.days} Days
                  </span>
                  {currentStreak >= selectedInfo.days && (
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold font-metric">
                      ILLUMINATED
                    </span>
                  )}
                </div>
                <p className="text-xs text-purple-200/90 mt-0.5 font-medium">
                  {selectedInfo.line}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              {currentStreak >= selectedInfo.days ? (
                <span className="text-[10px] font-metric font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Achieved
                </span>
              ) : (
                <span className="text-[10px] font-metric font-semibold text-purple-300">
                  {selectedInfo.days - currentStreak}d to go
                </span>
              )}
            </div>
          </div>

          {/* Spiritual Wisdom & Hadith Grounding */}
          <div className="mt-3 pt-3 border-t border-purple-900/40 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-xs mt-0.5">✦</span>
              <p className="text-xs text-purple-100/95 leading-relaxed italic">
                “{extraInfo.hadithOrAyah}”
                <span className="text-[10px] text-purple-400 not-italic block mt-0.5 font-metric">
                  — {extraInfo.source}
                </span>
              </p>
            </div>

            <div className="flex items-start gap-2 bg-[#1C0E35] p-2.5 rounded-xl border border-purple-800/30 text-[11px] text-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{extraInfo.neuroscience}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
