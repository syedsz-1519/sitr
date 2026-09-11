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
  Wind,
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
    setBreathPauseModalOpen,
    breathPausesCompleted,
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
        colors: ['#D4AF37', '#10B981', '#059669', '#FDE68A', '#34D399'],
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
          icon: <Compass className="w-3 h-3 text-amber-400" />,
          color: 'bg-[#061D14] border-amber-500/30 text-amber-300',
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="text-[11px] font-metric uppercase tracking-widest text-amber-300/90 font-bold">
            Sanctuary Overview
          </span>
        </div>
        <PrayerStatusBadge />
      </div>

      {/* 1. HERO: PROMINENT ARMED GUARDIAN STATUS HUB */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0D3827] via-[#07251A] to-[#04140E] border border-amber-500/35 p-5 sm:p-6 shadow-[0_10px_35px_rgba(4,20,14,0.6)] overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div
          className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
            isArmed ? 'bg-emerald-500/20' : 'bg-rose-500/15'
          }`}
        />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Animated Shield Beacon */}
            <div className="relative flex items-center justify-center shrink-0">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                  isArmed
                    ? 'bg-[#041A12] border-emerald-400/50 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                    : 'bg-zinc-900 border-zinc-700/50 text-zinc-500'
                }`}
              >
                {isArmed ? (
                  <ShieldCheck className="w-7 h-7 animate-pulse text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-7 h-7" />
                )}
              </div>
              {isArmed && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wide text-amber-50 font-metric">
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
              <p className="text-xs text-emerald-200/80 mt-0.5 leading-relaxed">
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
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold shadow-amber-950/60 hover:brightness-110 border border-amber-400/50'
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
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-amber-500/20 relative z-10">
          <div className="bg-[#061D14] border border-amber-500/20 rounded-xl p-2.5 text-center">
            <span className="font-metric text-lg sm:text-xl font-extrabold text-amber-50 leading-none block">
              {rules.filter((r) => r.enabled).length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-metric mt-1 block">
              Active Rules
            </span>
          </div>

          <div className="bg-[#061D14] border border-amber-500/20 rounded-xl p-2.5 text-center">
            <span className="font-metric text-lg sm:text-xl font-extrabold text-amber-400 leading-none block">
              {events.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-metric mt-1 block">
              Blocks Today
            </span>
          </div>

          <button
            onClick={handleRecordCleanDay}
            type="button"
            title="Click to record clean day / celebrate streak milestone"
            className={`bg-[#061D14] border rounded-xl p-2.5 text-center transition-all active:scale-95 group relative overflow-hidden cursor-pointer ${
              streakGlowActive || isStreakMilestone
                ? 'border-emerald-400/60 shadow-[0_0_16px_rgba(52,211,153,0.25)]'
                : 'border-amber-500/20 hover:border-amber-500/50'
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
                    ? 'animate-taqwa-glow text-amber-300'
                    : 'text-amber-400'
                }`}
              >
                {currentStreak}d
              </span>
              {isStreakMilestone && (
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
              )}
            </div>

            <span className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-metric mt-1 block">
              Taqwa Streak
            </span>
            <span className="text-[8px] font-metric text-amber-400/90 group-hover:text-amber-300 block transition-colors">
              + Clean Day
            </span>
          </button>
        </div>

        {/* Quick Test Intercept Trigger */}
        <div className="mt-3 flex items-center justify-between bg-[#061D14] border border-amber-500/20 rounded-xl px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-200/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Experience how SITR halts temptation</span>
          </div>
          <button
            onClick={() => simulateBlockPrompt()}
            type="button"
            className="text-[10px] font-metric font-bold uppercase tracking-wider text-amber-300 hover:text-black bg-[#0A2E20] hover:bg-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-amber-300" />
            <span>Test Intercept</span>
          </button>
        </div>
      </div>

      {/* 2. URGENT RESCUE ACTION BUTTON */}
      <button
        onClick={() => setUrgentRescueOpen(true, 'Self-reported urge check-in')}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-[#1A0B12] to-rose-950/80 border border-rose-500/40 text-rose-200 hover:text-white flex items-center justify-between shadow-[0_4px_25px_rgba(225,29,72,0.18)] active:scale-98 transition-all group cursor-pointer"
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

      {/* 2.7 30-SECOND DHIKR BREATH PAUSE ANIMATION HERO */}
      <div className="rounded-2xl bg-gradient-to-r from-[#07251A] via-[#0B3322] to-[#051A11] border border-amber-500/35 p-4 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
            <Wind className="w-5 h-5 animate-pulse text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric">
                Dhikr Breath Pause
              </span>
              <span className="text-[9px] font-metric font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                30 SECONDS
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 leading-tight mt-0.5">
              Guided 30-second breathing with sacred Dhikr phrases to halt dopamine cravings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setBreathPauseModalOpen(true)}
          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-black font-metric font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>Launch 30s Pause</span>
        </button>
      </div>

      {/* 3. INTERACTIVE DHIKR INTERRUPT CARD WITH PROGRESS ANIMATIONS */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0D3827] via-[#082318] to-[#04140E] border border-amber-500/35 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
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
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Break the dopamine impulse — replace visual cravings with Allah's remembrance.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick 30s Breath Pause button */}
            <button
              onClick={() => setBreathPauseModalOpen(true)}
              type="button"
              title="Open 30s Dhikr Breath Pause"
              className="px-2 py-1 rounded-xl border border-amber-500/30 bg-[#061D14] hover:bg-amber-500/20 text-amber-300 transition-all text-[10px] font-metric font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Wind className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">30s Breath</span>
            </button>
            {/* Ambient Chant Loop Quick Toggle */}
            <button
              onClick={handleToggleAmbient}
              type="button"
              title={isAmbientPlaying ? 'Mute Ambient Chant Loop' : 'Play Soft Ambient Chant Loop'}
              className={`px-2 py-1 rounded-xl border flex items-center gap-1.5 transition-all text-[10px] font-metric font-semibold ${
                isAmbientPlaying
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-[#061D14] border-amber-500/25 text-emerald-200/70 hover:text-white'
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
            <div className="flex items-center gap-1 bg-[#061D14] border border-amber-500/25 p-1 rounded-xl">
              {[11, 33, 99].map((t) => (
                <button
                  key={t}
                  onClick={() => setDhikrTarget(t)}
                  type="button"
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-metric font-bold transition-all ${
                    dhikrTarget === t
                      ? 'bg-emerald-600 text-amber-50 shadow-sm'
                      : 'text-emerald-300/70 hover:text-amber-200'
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
                  ? 'bg-[#0B3824] border border-amber-500/60 text-amber-200 shadow-sm'
                  : 'bg-[#061D14] border border-amber-500/20 text-emerald-200/70 hover:text-amber-100'
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
            className="font-arabic text-2xl sm:text-3xl text-amber-200 my-1 leading-relaxed font-bold tracking-wide select-none drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
            dir="rtl"
          >
            {activeDhikr.arabic}
          </p>
          <p className="text-xs text-emerald-200/90 font-medium">
            <span className="text-amber-300 font-semibold">{activeDhikr.transliteration}</span>
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
            className={`relative rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0D3827] via-[#08261A] to-[#04160E] border border-amber-500/40 shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-transform duration-100 focus:outline-none cursor-pointer group select-none w-44 h-44 ${
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
                className="text-[#051F14]"
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
                  isDhikrComplete ? 'text-amber-300' : 'text-emerald-400'
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
            <span className="font-metric text-4xl sm:text-5xl font-extrabold text-amber-50 tracking-tight leading-none">
              {dhikrCount}
            </span>
            <span className="text-[11px] font-metric text-emerald-300/80 font-semibold mt-1">
              target: {dhikrTarget}
            </span>
            <span className="text-[10px] text-amber-300 font-metric uppercase tracking-wider font-bold mt-1">
              {isDhikrComplete ? 'COMPLETED' : 'TAP MISBAHA'}
            </span>
          </button>

          {/* Remaining Taps Feedback */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-xs text-emerald-200/90 font-metric">
              {isDhikrComplete ? (
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 inline" />
                  MashaAllah — Chest calmed, urge weakened!
                </span>
              ) : (
                <span>
                  <strong className="text-amber-300">{dhikrRemaining}</strong> taps remaining to complete cycle
                </span>
              )}
            </span>
            <button
              onClick={resetDhikr}
              type="button"
              title="Reset Misbaha Counter"
              className="text-[11px] text-emerald-300 hover:text-amber-300 flex items-center gap-1 font-metric transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-emerald-300/80 font-metric relative z-10">
          <span>Loop Interrupt Progress</span>
          <span className="text-amber-200 font-bold">{Math.round(progressRatio * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-[#061D14] rounded-full overflow-hidden mt-1 relative z-10 border border-amber-500/10">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isDhikrComplete
                ? 'bg-gradient-to-r from-amber-400 to-amber-300'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>

      {/* 4. ROTATING QURANIC AYAH CARD (SOURCED DIRECTLY FROM ayahs.json & TIME-OF-DAY HOOK) */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0D3827] via-[#082318] to-[#04140E] border border-amber-500/35 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Time-of-Day Spiritual Guidance Banner */}
        <div className="mb-4 bg-[#061D14] border border-amber-500/25 rounded-2xl p-3 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="text-xl p-1.5 rounded-xl bg-[#0B3322] border border-amber-500/30 shrink-0">
              {timePeriod.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-amber-50 font-metric">
                  {timePeriod.slotLabel}
                </span>
                <span className="text-[10px] text-amber-300/80 font-metric font-mono px-1.5 py-0.2 rounded bg-[#04140E] border border-amber-500/20">
                  {timePeriod.timeRange}
                </span>
                {timePeriod.isHighRiskWindow && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-metric font-bold text-rose-300 bg-rose-950/80 border border-rose-700/50 px-2 py-0.5 rounded-full animate-pulse">
                    <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                    Vigilance Window
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-snug">
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
                  ? 'bg-[#0B3824] border-amber-500/50 text-amber-200'
                  : 'bg-zinc-900/80 border-zinc-700 text-zinc-400'
              }`}
            >
              {isAutoRotating ? (
                <>
                  <Pause className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
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
              className="p-1.5 rounded-lg bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/30 text-amber-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Random shuffle */}
            <button
              onClick={handleRandomAyah}
              type="button"
              title="Random Ayah from pool"
              className="p-1.5 rounded-lg bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/30 text-amber-300 hover:text-white transition-colors"
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
            <span className="text-[10px] text-emerald-300/70 font-metric font-semibold">
              Verse {currentAyahIndex + 1} of {totalAyahs}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevAyah}
              type="button"
              title="Previous Ayah"
              className="w-7 h-7 rounded-full bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/30 text-amber-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextAyah}
              type="button"
              title="Next Ayah"
              className="w-7 h-7 rounded-full bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/30 text-amber-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyAyah}
              type="button"
              title="Copy Ayah"
              className="w-7 h-7 rounded-full bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/30 text-amber-300 hover:text-white flex items-center justify-center transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleShareAyah}
              type="button"
              title="Share Ayah (Web Share API)"
              className="w-7 h-7 rounded-full bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/30 text-amber-300 hover:text-white flex items-center justify-center transition-colors"
            >
              {isShared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Arabic Calligraphy */}
        <p
          className="font-arabic text-2xl sm:text-3xl text-amber-100 my-3 text-right leading-loose font-bold tracking-wide select-none drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] relative z-10"
          dir="rtl"
        >
          {activeAyah.arabic}
        </p>

        {/* Transliteration */}
        {activeAyah.transliteration && (
          <p className="text-xs text-emerald-300/80 font-mono italic mb-2 relative z-10 leading-relaxed">
            {activeAyah.transliteration}
          </p>
        )}

        {/* English Translation */}
        <p className="text-sm italic text-amber-50/95 leading-relaxed font-sans mb-3 relative z-10">
          "{activeAyah.translation}"
        </p>

        {/* Reference Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-500/20 text-xs text-emerald-200/90 font-metric relative z-10">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            {activeAyah.reference}
          </span>
          {activeAyah.surahName || activeAyah.surah ? (
            <span className="text-emerald-300/80">Surah {activeAyah.surahName || activeAyah.surah}</span>
          ) : null}
        </div>

        {/* Nafs Antidote & Spiritual Lesson */}
        {activeAyah.reflectionLesson && (
          <div className="mt-3 pt-3 border-t border-amber-500/20 relative z-10">
            <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-3.5 space-y-1.5">
              <span className="text-[10px] uppercase font-metric font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Nafs Antidote & Lesson
              </span>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                {activeAyah.reflectionLesson}
              </p>
            </div>
          </div>
        )}

        {/* Link to Full Quranic Sanctuary */}
        <div className="mt-3 pt-2 text-right relative z-10">
          <button
            onClick={() => onNavigate && onNavigate('ayah_reflections')}
            type="button"
            className="text-xs font-metric font-bold text-amber-300 hover:text-white flex items-center justify-end gap-1 ml-auto transition-colors group cursor-pointer"
          >
            <span>Explore all 40 Curated Ayahs in Sanctuary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 5. CUSTOM BLOCK MODE ACCESS BANNER */}
      <div
        onClick={() => onNavigate && onNavigate('custom_block_mode')}
        className="rounded-2xl bg-gradient-to-r from-[#0D3827] via-[#082318] to-[#04140E] border border-amber-500/35 hover:border-amber-400/60 p-4 flex items-center justify-between cursor-pointer transition-all shadow-md group select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#061D14] border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shrink-0">
            <Shield className="w-5 h-5 fill-emerald-500/20 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-50">Custom Block Mode</span>
              <span
                className={`text-[9px] font-metric uppercase px-1.5 py-0.5 rounded font-bold ${
                  customBlockModeEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#04160F] text-amber-300 border border-amber-500/30'
                }`}
              >
                {customBlockModeEnabled ? 'ACTIVE (ON)' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Targeted app, website & keyword triggers — tailored to your specific tests.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-amber-300 group-hover:text-white transition-colors">
          <span className="text-[10px] font-metric font-semibold hidden sm:inline">Configure</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 6. ADD NEW BLOCK RULE FORM */}
      <div className="rounded-3xl bg-[#082318] border border-amber-500/25 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-amber-50">Quick Block Rule</h2>
          </div>
          <span className="text-[10px] font-metric text-emerald-300/70 uppercase">
            Simulated in Web
          </span>
        </div>

        {/* 3-Way Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#04160F] p-1 rounded-xl border border-amber-500/20">
          <button
            type="button"
            onClick={() => setActiveTab('app')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'app'
                ? 'bg-emerald-600 text-amber-50 shadow-sm'
                : 'text-emerald-300/60 hover:text-amber-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>App</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'website'
                ? 'bg-emerald-600 text-amber-50 shadow-sm'
                : 'text-emerald-300/60 hover:text-amber-200'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Website</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keyword')}
            className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'keyword'
                ? 'bg-emerald-600 text-amber-50 shadow-sm'
                : 'text-emerald-300/60 hover:text-amber-200'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Keyword</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleCreateRule} className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase font-metric tracking-wider text-emerald-300/80 mb-1">
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
              className="w-full bg-[#04160F] border border-amber-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-emerald-300/30 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-metric tracking-wider text-emerald-300/80 mb-1">
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
              className="w-full bg-[#04160F] border border-amber-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-emerald-300/30 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Add to Shield Rules</span>
          </button>
        </form>
      </div>

      {/* 7. ACTIVE RULES LIST WITH SIMULATION TRIGGER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric">
            Active Guard Rules ({rules.length})
          </span>
          <span className="text-[10px] text-emerald-300/70 font-metric">
            Tap play icon to test interception
          </span>
        </div>

        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-2xl bg-[#082318] border border-amber-500/20 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#04160F] border border-amber-500/30 flex items-center justify-center shrink-0">
                  {rule.type === 'app' ? (
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  ) : rule.type === 'website' ? (
                    <Globe className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Tag className="w-4 h-4 text-amber-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-50 truncate block">
                      {rule.label}
                    </span>
                    <span className="text-[9px] uppercase font-metric px-1.5 py-0.2 bg-[#04160F] text-amber-300 rounded border border-amber-500/30">
                      {rule.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300/70 truncate block font-metric">
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
                  className="w-7 h-7 rounded-lg bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/30 text-amber-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  type="button"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-300" />
                </button>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer ${
                    rule.enabled ? 'bg-emerald-600' : 'bg-zinc-800'
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
