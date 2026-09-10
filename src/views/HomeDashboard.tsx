import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Heart,
  Globe,
  Smartphone,
  Tag,
  Trash2,
  Play,
  Pause,
  Shuffle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
  Share2,
  Award,
  Flame,
  RefreshCw,
  Lock,
  Unlock,
  Sun,
  Compass,
  AlertTriangle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSitrStore } from '../store/useSitrStore';
import { useTimeBasedAyah } from '../hooks/useTimeBasedAyah';
import { PrayerStatusBadge } from '../components/PrayerStatusBadge';
import { dhikrAmbientAudio } from '../utils/ambientAudioEngine';
import { DHIKR_OPTIONS } from '../data/dhikr';
import { RuleType, ExtendedView, DhikrType } from '../types';
import { DailyReflectionCard } from '../components/DailyReflectionCard';

interface HomeDashboardProps {
  onNavigate?: (view: ExtendedView) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const {
    isArmed,
    toggleArmed,
    rules,
    events,
    addRule,
    toggleRule,
    deleteRule,
    simulateBlockPrompt,
    setUrgentRescueOpen,
    dhikrCount,
    dhikrTarget,
    selectedDhikrType,
    incrementDhikr,
    resetDhikr,
    setDhikrTarget,
    setDhikrType,
    currentStreak,
    recordCleanDay,
    customBlockModeEnabled,
  } = useSitrStore();

  const {
    activeAyah,
    currentAyahIndex,
    totalAyahs,
    timePeriod,
    handleNextAyah,
    handlePrevAyah,
    handleRandomAyah,
    resetToCurrentTimePeriod,
    isAutoRotating,
    toggleAutoRotate,
  } = useTimeBasedAyah();

  const [activeTab, setActiveTab] = useState<RuleType>('app');
  const [ruleLabel, setRuleLabel] = useState('');
  const [ruleTarget, setRuleTarget] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isPressingDhikr, setIsPressingDhikr] = useState(false);
  const [showReflectionLesson, setShowReflectionLesson] = useState(true);
  const [streakGlowActive, setStreakGlowActive] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  useEffect(() => {
    setIsAmbientPlaying(dhikrAmbientAudio.isAudioRunning());
    return () => {
      dhikrAmbientAudio.stop(true).catch(() => {});
    };
  }, []);

  const handleToggleAmbient = async () => {
    if (isAmbientPlaying) {
      await dhikrAmbientAudio.stop(true);
      setIsAmbientPlaying(false);
    } else {
      const ok = await dhikrAmbientAudio.start('rhythmic-chant');
      if (ok) {
        setIsAmbientPlaying(true);
      }
    }
  };

  // Taqwa Streak milestone check (1, 3, 7, 14, 21, 30, 40, 100 days)
  const MILESTONE_DAYS = [1, 3, 7, 14, 21, 30, 40, 100];
  const isStreakMilestone = MILESTONE_DAYS.includes(currentStreak);

  const handleRecordCleanDay = () => {
    setStreakGlowActive(true);
    recordCleanDay();
    setTimeout(() => setStreakGlowActive(false), 2400);
  };

  const handleCopyAyah = () => {
    const textToCopy = `${activeAyah.arabic}\n\n"${activeAyah.translation}"\n\n— ${activeAyah.reference} (${activeAyah.surahName || activeAyah.surah || ''})`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareAyah = async () => {
    const textToShare = `${activeAyah.arabic}\n\n"${activeAyah.translation}"\n\n— ${activeAyah.reference} (${activeAyah.surahName || activeAyah.surah || ''})\n\nShared via SITR (Guard Your Gaze)`;
    const shareData = {
      title: `Quranic Reflection — ${activeAyah.reference}`,
      text: textToShare,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopyAyah();
          setIsShared(true);
          setTimeout(() => setIsShared(false), 2000);
        }
      }
    } else {
      handleCopyAyah();
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  // Dhikr calculations
  const activeDhikr =
    DHIKR_OPTIONS.find((d) => d.id === selectedDhikrType) || DHIKR_OPTIONS[0];
  const radius = 64;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, dhikrCount / dhikrTarget);
  const strokeDashoffset = circumference - progressRatio * circumference;
  const isDhikrComplete = dhikrCount >= dhikrTarget;
  const dhikrRemaining = Math.max(0, dhikrTarget - dhikrCount);

  const handleTapDhikr = () => {
    setIsPressingDhikr(true);
    setTimeout(() => setIsPressingDhikr(false), 120);

    const willComplete = dhikrCount + 1 >= dhikrTarget;

    // Haptic feedback for Dhikr Interrupt Card (Navigator.vibrate API)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (willComplete) {
          // Distinct milestone celebration haptic pattern upon completion
          navigator.vibrate([35, 50, 60]);
        } else {
          // Subtle crisp haptic tap on each individual bead
          navigator.vibrate(20);
        }
      } catch {
        // Silently ignore if vibrations are disallowed by browser environment
      }
    }

    // Subtle acoustic bead click feedback
    dhikrAmbientAudio.playBeadClick();

    incrementDhikr();

    if (willComplete && !isDhikrComplete) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#A78BFA', '#F59E0B', '#10B981', '#DDD6FE'],
      });
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleLabel.trim() || !ruleTarget.trim()) return;

    addRule({
      label: ruleLabel.trim(),
      target: ruleTarget.trim(),
      type: activeTab,
    });

    setRuleLabel('');
    setRuleTarget('');
  };

  // Helper for theme visual badge
  const getThemeBadge = (theme: string) => {
    switch (theme) {
      case 'self-control':
      case 'self_control':
        return {
          label: 'Self-Control & Zina',
          icon: <Shield className="w-3 h-3 text-rose-400" />,
          color: 'bg-rose-950/60 border-rose-800/40 text-rose-300',
        };
      case 'repentance':
        return {
          label: 'Repentance (Tawbah)',
          icon: <Flame className="w-3 h-3 text-amber-400" />,
          color: 'bg-amber-950/60 border-amber-800/40 text-amber-300',
        };
      case 'mercy':
        return {
          label: "Allah's Vast Mercy",
          icon: <Heart className="w-3 h-3 text-pink-400" />,
          color: 'bg-pink-950/60 border-pink-800/40 text-pink-300',
        };
      case 'dhikr':
      case 'remembrance':
        return {
          label: "Allah's Remembrance",
          icon: <Sun className="w-3 h-3 text-yellow-400" />,
          color: 'bg-yellow-950/60 border-yellow-800/40 text-yellow-300',
        };
      case 'patience':
        return {
          label: 'Patience (Sabr)',
          icon: <Clock className="w-3 h-3 text-blue-400" />,
          color: 'bg-blue-950/60 border-blue-800/40 text-blue-300',
        };
      case 'consistency':
        return {
          label: 'Consistency (Istiqamah)',
          icon: <Sparkles className="w-3 h-3 text-emerald-400" />,
          color: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-300',
        };
      default:
        return {
          label: activeAyah.themeLabel || 'Quranic Anchor',
          icon: <Compass className="w-3 h-3 text-purple-400" />,
          color: 'bg-purple-950/60 border-purple-800/40 text-purple-300',
        };
    }
  };

  const themeBadge = getThemeBadge(activeAyah.theme);

  return (
    <div className="space-y-6 pb-12">
      {/* HomeDashboard Header Bar: Midnight Mosque Prayer Time Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-metric uppercase tracking-widest text-purple-200/90 font-bold">
            Sanctuary Overview
          </span>
        </div>
        <PrayerStatusBadge />
      </div>

      {/* 1. HERO: PROMINENT ARMED GUARDIAN STATUS HUB */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#1C1033] via-[#140A28] to-[#0D061A] border border-purple-700/40 p-5 sm:p-6 shadow-[0_10px_35px_rgba(124,58,237,0.18)] overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
            isArmed ? 'bg-emerald-500/15' : 'bg-rose-500/10'
          }`}
        />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Animated Shield Beacon */}
            <div className="relative flex items-center justify-center shrink-0">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                  isArmed
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                    : 'bg-zinc-900 border-zinc-700/50 text-zinc-500'
                }`}
              >
                {isArmed ? (
                  <ShieldCheck className="w-7 h-7 animate-pulse" />
                ) : (
                  <ShieldAlert className="w-7 h-7" />
                )}
              </div>
              {isArmed && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wide text-white font-metric">
                  {isArmed ? 'SHIELD GUARDIAN ARMED' : 'SHIELD GUARDIAN PAUSED'}
                </h1>
                <span
                  className={`text-[9px] font-metric font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isArmed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {isArmed ? 'PROTECTING' : 'DISARMED'}
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5 leading-relaxed">
                {isArmed
                  ? 'Real-time Nafs shield active • Guarding gaze, screen & heart'
                  : 'Protection is off — tap to arm SITR against visual triggers'}
              </p>
            </div>
          </div>

          {/* Master Arm Toggle Button */}
          <button
            onClick={toggleArmed}
            type="button"
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-metric font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg active:scale-95 ${
              isArmed
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-950/60 hover:brightness-110 border border-emerald-400/40'
                : 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-purple-950/60 hover:brightness-110 border border-purple-400/40'
            }`}
          >
            {isArmed ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>ARMED & ACTIVE</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>ARM GUARDIAN NOW</span>
              </>
            )}
          </button>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-purple-900/40 relative z-10">
          <div className="bg-[#120822]/80 border border-purple-900/30 rounded-xl p-2.5 text-center">
            <span className="font-metric text-lg sm:text-xl font-extrabold text-white leading-none block">
              {rules.filter((r) => r.enabled).length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-purple-300/70 font-metric mt-1 block">
              Active Rules
            </span>
          </div>

          <div className="bg-[#120822]/80 border border-purple-900/30 rounded-xl p-2.5 text-center">
            <span className="font-metric text-lg sm:text-xl font-extrabold text-amber-400 leading-none block">
              {events.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-purple-300/70 font-metric mt-1 block">
              Blocks Today
            </span>
          </div>

          <button
            onClick={handleRecordCleanDay}
            type="button"
            title="Click to record clean day / celebrate streak milestone"
            className={`bg-[#120822]/90 border rounded-xl p-2.5 text-center transition-all active:scale-95 group relative overflow-hidden cursor-pointer ${
              streakGlowActive || isStreakMilestone
                ? 'border-emerald-500/60 shadow-[0_0_16px_rgba(52,211,153,0.25)]'
                : 'border-purple-900/30 hover:border-purple-700/50'
            }`}
          >
            {/* Ambient glow backdrop during animation or milestone */}
            {(streakGlowActive || isStreakMilestone) && (
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />
            )}

            <div className="flex items-center justify-center gap-1">
              <span
                className={`font-metric text-lg sm:text-xl font-extrabold leading-none inline-block transition-all ${
                  streakGlowActive
                    ? 'animate-taqwa-pulse-trigger text-emerald-300'
                    : isStreakMilestone
                    ? 'animate-taqwa-glow text-emerald-400'
                    : 'text-emerald-400'
                }`}
              >
                {currentStreak}d
              </span>
              {isStreakMilestone && (
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
              )}
            </div>

            <span className="text-[10px] uppercase tracking-wider text-purple-300/70 font-metric mt-1 block">
              Taqwa Streak
            </span>
            <span className="text-[8px] font-metric text-emerald-400/80 group-hover:text-emerald-300 block transition-colors">
              + Clean Day
            </span>
          </button>
        </div>

        {/* Quick Test Intercept Trigger */}
        <div className="mt-3 flex items-center justify-between bg-[#190E2E]/60 border border-purple-800/30 rounded-xl px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2 text-purple-200/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Experience how SITR halts temptation</span>
          </div>
          <button
            onClick={() => simulateBlockPrompt()}
            type="button"
            className="text-[10px] font-metric font-bold uppercase tracking-wider text-purple-300 hover:text-white bg-purple-900/60 hover:bg-purple-800/80 px-2.5 py-1 rounded-lg border border-purple-700/40 transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3 h-3 fill-purple-300" />
            <span>Test Intercept</span>
          </button>
        </div>
      </div>

      {/* 2. URGENT RESCUE ACTION BUTTON */}
      <button
        onClick={() => setUrgentRescueOpen(true, 'Self-reported urge check-in')}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-purple-950/60 to-rose-950/70 border border-rose-600/40 text-rose-200 hover:text-white flex items-center justify-between shadow-[0_4px_25px_rgba(225,29,72,0.18)] active:scale-98 transition-all group cursor-pointer"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
            <Heart className="w-5 h-5 fill-rose-500/30" />
          </div>
          <div className="text-left">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-300 block font-metric">
              I'm Struggling — Bhai, Help Karo
            </span>
            <span className="text-[11px] text-rose-200/70 font-sans">
              Instant sakinah, emergency ayah & dhikr intervention
            </span>
          </div>
        </div>
        <span className="text-xs font-metric uppercase font-bold text-rose-300 bg-rose-900/80 px-3 py-1 rounded-full border border-rose-700/50 shadow-sm shrink-0">
          Rescue Me
        </span>
      </button>

      {/* 2.5 DAILY REFLECTION & EVENING MUHASABAH CARD */}
      <DailyReflectionCard onNavigate={onNavigate} />

      {/* 3. INTERACTIVE DHIKR INTERRUPT CARD WITH PROGRESS ANIMATIONS */}
      <div className="rounded-3xl bg-gradient-to-b from-[#1C1033] via-[#150B27] to-[#0E061B] border border-purple-800/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 font-metric">
                Dhikr Sakinah Interrupt
              </span>
            </div>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Break the dopamine impulse — replace visual cravings with Allah's remembrance.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Ambient Chant Loop Quick Toggle */}
            <button
              onClick={handleToggleAmbient}
              type="button"
              title={isAmbientPlaying ? 'Mute Ambient Chant Loop' : 'Play Soft Ambient Chant Loop'}
              className={`px-2 py-1 rounded-xl border flex items-center gap-1.5 transition-all text-[10px] font-metric font-semibold ${
                isAmbientPlaying
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-[#100820] border-purple-900/50 text-purple-300/70 hover:text-white'
              }`}
            >
              {isAmbientPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">Chant</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chant</span>
                </>
              )}
            </button>

            {/* Target Selector */}
            <div className="flex items-center gap-1 bg-[#100820] border border-purple-900/50 p-1 rounded-xl">
              {[11, 33, 99].map((t) => (
                <button
                  key={t}
                  onClick={() => setDhikrTarget(t)}
                  type="button"
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-metric font-bold transition-all ${
                    dhikrTarget === t
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-300/60 hover:text-purple-200'
                  }`}
                >
                  {t}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dhikr Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-5 relative z-10">
          {DHIKR_OPTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDhikrType(d.id as DhikrType)}
              type="button"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold font-metric transition-all text-left flex flex-col ${
                selectedDhikrType === d.id
                  ? 'bg-purple-900/70 border border-purple-500/60 text-white shadow-sm'
                  : 'bg-[#120822] border border-purple-900/30 text-purple-300/60 hover:text-purple-200'
              }`}
            >
              <span className="font-bold truncate">{d.label}</span>
              <span className="text-[9px] opacity-70 truncate font-arabic">{d.arabic}</span>
            </button>
          ))}
        </div>

        {/* Active Dhikr Display */}
        <div className="text-center relative z-10 mb-4">
          <p
            className="font-arabic text-2xl sm:text-3xl text-white my-1 leading-relaxed font-bold tracking-wide select-none drop-shadow-sm"
            dir="rtl"
          >
            {activeDhikr.arabic}
          </p>
          <p className="text-xs text-purple-200/90 font-medium">
            <span className="text-purple-300 font-semibold">{activeDhikr.transliteration}</span>
            <span className="mx-2 opacity-50">•</span>
            <span className="italic">"{activeDhikr.meaning}"</span>
          </p>
        </div>

        {/* Circular Interactive Counter Button */}
        <div className="relative flex flex-col items-center justify-center my-3 relative z-10">
          <button
            onClick={handleTapDhikr}
            aria-label="Tap to increment Dhikr"
            type="button"
            className={`relative rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#241344] to-[#160A2D] shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-transform duration-100 focus:outline-none cursor-pointer group select-none w-44 h-44 ${
              isPressingDhikr ? 'scale-95' : 'active:scale-95'
            }`}
          >
            {/* SVG Animated Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 160 160"
            >
              {/* Background Track */}
              <circle
                className="text-[#2B1750]"
                cx="80"
                cy="80"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              {/* Dynamic Fill Arc */}
              <circle
                className={`transition-all duration-200 ${
                  isDhikrComplete ? 'text-amber-400' : 'text-purple-500'
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
              />
            </svg>

            {/* Inner Content */}
            <span className="font-metric text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
              {dhikrCount}
            </span>
            <span className="text-[11px] font-metric text-purple-300/70 font-semibold mt-1">
              target: {dhikrTarget}
            </span>
            <span className="text-[10px] text-amber-300 font-metric uppercase tracking-wider font-bold mt-1">
              {isDhikrComplete ? 'COMPLETED' : 'TAP MISBAHA'}
            </span>
          </button>

          {/* Remaining Taps Feedback */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-xs text-purple-200/80 font-metric">
              {isDhikrComplete ? (
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 inline" />
                  MashaAllah — Chest calmed, urge weakened!
                </span>
              ) : (
                <span>
                  <strong>{dhikrRemaining}</strong> taps remaining to complete cycle
                </span>
              )}
            </span>
            <button
              onClick={resetDhikr}
              type="button"
              title="Reset Misbaha Counter"
              className="text-[11px] text-purple-400 hover:text-white flex items-center gap-1 font-metric transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-purple-300/70 font-metric relative z-10">
          <span>Loop Interrupt Progress</span>
          <span className="text-white font-bold">{Math.round(progressRatio * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-[#120822] rounded-full overflow-hidden mt-1 relative z-10">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isDhikrComplete
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                : 'bg-gradient-to-r from-purple-600 to-indigo-500'
            }`}
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>

      {/* 4. ROTATING QURANIC AYAH CARD (SOURCED DIRECTLY FROM ayahs.json & TIME-OF-DAY HOOK) */}
      <div className="rounded-3xl bg-gradient-to-b from-[#1F1435] via-[#160D27] to-[#0F071B] border border-purple-700/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Time-of-Day Spiritual Guidance Banner */}
        <div className="mb-4 bg-[#130824]/90 border border-purple-800/40 rounded-2xl p-3 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="text-xl p-1.5 rounded-xl bg-[#221040] border border-purple-700/50 shrink-0">
              {timePeriod.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white font-metric">
                  {timePeriod.slotLabel}
                </span>
                <span className="text-[10px] text-purple-300/70 font-metric font-mono px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-800/40">
                  {timePeriod.timeRange}
                </span>
                {timePeriod.isHighRiskWindow && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-metric font-bold text-rose-300 bg-rose-950/80 border border-rose-700/50 px-2 py-0.5 rounded-full animate-pulse">
                    <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                    Vigilance Window
                  </span>
                )}
              </div>
              <p className="text-[11px] text-purple-200/80 mt-0.5 leading-snug">
                {timePeriod.spiritualNote}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            {/* Auto rotate toggle */}
            <button
              onClick={toggleAutoRotate}
              type="button"
              title={isAutoRotating ? 'Pause auto-rotation (every 45s)' : 'Resume auto-rotation'}
              className={`px-2 py-1 rounded-lg text-[10px] font-metric font-bold uppercase tracking-wider flex items-center gap-1 transition-all border ${
                isAutoRotating
                  ? 'bg-purple-900/60 border-purple-600/50 text-purple-200'
                  : 'bg-zinc-900/80 border-zinc-700 text-zinc-400'
              }`}
            >
              {isAutoRotating ? (
                <>
                  <Pause className="w-2.5 h-2.5 fill-purple-300 text-purple-300" />
                  <span>Auto</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 fill-zinc-400 text-zinc-400" />
                  <span>Paused</span>
                </>
              )}
            </button>

            {/* Sync to current time slot anchor */}
            <button
              onClick={resetToCurrentTimePeriod}
              type="button"
              title="Reset to current time-of-day anchor"
              className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 text-purple-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Random shuffle */}
            <button
              onClick={handleRandomAyah}
              type="button"
              title="Random Ayah from pool"
              className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/40 text-purple-300 hover:text-white transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Header with Theme Badge & Navigation */}
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-metric font-bold uppercase tracking-wider border ${themeBadge.color}`}
            >
              {themeBadge.icon}
              <span>{themeBadge.label}</span>
            </span>
            <span className="text-[10px] text-purple-300/60 font-metric font-semibold">
              Verse {currentAyahIndex + 1} of {totalAyahs}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevAyah}
              type="button"
              title="Previous Ayah"
              className="w-7 h-7 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextAyah}
              type="button"
              title="Next Ayah"
              className="w-7 h-7 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyAyah}
              type="button"
              title="Copy Ayah"
              className="w-7 h-7 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white flex items-center justify-center transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleShareAyah}
              type="button"
              title="Share Ayah (Web Share API)"
              className="w-7 h-7 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white flex items-center justify-center transition-colors"
            >
              {isShared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Arabic Calligraphy */}
        <p
          className="font-arabic text-2xl sm:text-3xl text-white my-3 text-right leading-loose font-bold tracking-wide select-none drop-shadow-md relative z-10"
          dir="rtl"
        >
          {activeAyah.arabic}
        </p>

        {/* Transliteration */}
        {activeAyah.transliteration && (
          <p className="text-xs text-purple-300/70 font-mono italic mb-2 relative z-10 leading-relaxed">
            {activeAyah.transliteration}
          </p>
        )}

        {/* English Translation */}
        <p className="text-sm italic text-purple-100/95 leading-relaxed font-sans mb-3 relative z-10">
          "{activeAyah.translation}"
        </p>

        {/* Reference Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-purple-900/40 text-xs text-purple-300 font-metric relative z-10">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            {activeAyah.reference}
          </span>
          {activeAyah.surahName || activeAyah.surah ? (
            <span>Surah {activeAyah.surahName || activeAyah.surah}</span>
          ) : null}
        </div>

        {/* Nafs Antidote & Spiritual Lesson */}
        {activeAyah.reflectionLesson && (
          <div className="mt-3 pt-3 border-t border-purple-900/30 relative z-10">
            <div className="rounded-2xl bg-[#120822]/80 border border-purple-800/40 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-metric font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Nafs Antidote & Lesson
                </span>
                <button
                  onClick={() => setShowReflectionLesson((prev) => !prev)}
                  type="button"
                  className="text-[10px] text-purple-400 hover:text-purple-200 font-metric"
                >
                  {showReflectionLesson ? 'Hide' : 'Show'}
                </button>
              </div>
              {showReflectionLesson && (
                <p className="text-xs text-purple-200/90 leading-relaxed font-sans">
                  {activeAyah.reflectionLesson}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Link to Full Quranic Sanctuary */}
        <div className="mt-3 pt-2 text-right relative z-10">
          <button
            onClick={() => onNavigate && onNavigate('ayah_reflections')}
            type="button"
            className="text-xs font-metric font-bold text-purple-300 hover:text-white flex items-center justify-end gap-1 ml-auto transition-colors group"
          >
            <span>Explore all 40 Curated Ayahs in Sanctuary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 5. CUSTOM BLOCK MODE ACCESS BANNER */}
      <div
        onClick={() => onNavigate && onNavigate('custom_block_mode')}
        className="rounded-2xl bg-gradient-to-r from-[#1C1133] via-[#160E2A] to-[#120921] border border-purple-800/40 hover:border-purple-600/60 p-4 flex items-center justify-between cursor-pointer transition-all shadow-md group select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#251540] border border-purple-600/40 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform shrink-0">
            <Shield className="w-5 h-5 fill-purple-400/20 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Custom Block Mode</span>
              <span
                className={`text-[9px] font-metric uppercase px-1.5 py-0.5 rounded font-bold ${
                  customBlockModeEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-purple-950 text-purple-300 border border-purple-800/40'
                }`}
              >
                {customBlockModeEnabled ? 'ACTIVE (ON)' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-purple-200/70">
              Targeted app, website & keyword triggers — tailored to your specific tests.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-purple-400 group-hover:text-white transition-colors">
          <span className="text-[10px] font-metric font-semibold hidden sm:inline">Configure</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 6. ADD NEW BLOCK RULE FORM */}
      <div className="rounded-3xl bg-[#160D27] border border-purple-900/30 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Quick Block Rule</h2>
          </div>
          <span className="text-[10px] font-metric text-purple-300/70 uppercase">
            Simulated in Web
          </span>
        </div>

        {/* 3-Way Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#10081E] p-1 rounded-xl border border-purple-900/40">
          <button
            type="button"
            onClick={() => setActiveTab('app')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'app'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>App</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'website'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Website</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keyword')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'keyword'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Keyword</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleCreateRule} className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase font-metric tracking-wider text-purple-300/70 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={ruleLabel}
              onChange={(e) => setRuleLabel(e.target.value)}
              placeholder={
                activeTab === 'app'
                  ? 'e.g., Instagram Reels'
                  : activeTab === 'website'
                  ? 'e.g., Twitter / X Feed'
                  : 'e.g., NSFW & Triggers'
              }
              className="w-full bg-[#10081E] border border-purple-900/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-purple-300/30 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-metric tracking-wider text-purple-300/70 mb-1">
              {activeTab === 'app' ? 'Package Name / URL' : activeTab === 'website' ? 'Domain URL' : 'Trigger Words'}
            </label>
            <input
              type="text"
              value={ruleTarget}
              onChange={(e) => setRuleTarget(e.target.value)}
              placeholder={
                activeTab === 'app'
                  ? 'e.g., com.instagram.android'
                  : activeTab === 'website'
                  ? 'e.g., instagram.com'
                  : 'e.g., adult, provocative, binge'
              }
              className="w-full bg-[#10081E] border border-purple-900/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-purple-300/30 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Add to Shield Rules</span>
          </button>
        </form>
      </div>

      {/* 7. ACTIVE RULES LIST WITH SIMULATION TRIGGER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-metric">
            Active Guard Rules ({rules.length})
          </span>
          <span className="text-[10px] text-purple-300/70 font-metric">
            Tap play icon to test interception
          </span>
        </div>

        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-2xl bg-[#160D27] border border-purple-900/30 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#20133A] border border-purple-800/40 flex items-center justify-center shrink-0">
                  {rule.type === 'app' ? (
                    <Smartphone className="w-4 h-4 text-purple-400" />
                  ) : rule.type === 'website' ? (
                    <Globe className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Tag className="w-4 h-4 text-amber-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate block">
                      {rule.label}
                    </span>
                    <span className="text-[9px] uppercase font-metric px-1.5 py-0.2 bg-purple-950/80 text-purple-300 rounded border border-purple-800/40">
                      {rule.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-300/60 truncate block font-metric">
                    {rule.target} • {rule.blocksCount} blocks
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Simulate Block Trigger */}
                <button
                  onClick={() => simulateBlockPrompt(rule)}
                  title="Simulate block trigger"
                  className="w-7 h-7 rounded-lg bg-purple-900/30 hover:bg-purple-900/60 border border-purple-700/30 text-purple-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  type="button"
                >
                  <Play className="w-3.5 h-3.5 fill-purple-300" />
                </button>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer ${
                    rule.enabled ? 'bg-purple-600' : 'bg-zinc-800'
                  }`}
                  type="button"
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      rule.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>

                {/* Delete rule */}
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="w-6 h-6 rounded text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                  type="button"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
