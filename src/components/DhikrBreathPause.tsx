import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Wind,
  Heart,
  Shield,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSitrStore } from '../store/useSitrStore';
import { dhikrAmbientAudio } from '../utils/ambientAudioEngine';

export interface DhikrBreathPhrase {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  virtue: string;
}

export const DHIKR_BREATH_PHRASES: DhikrBreathPhrase[] = [
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Lā ḥawla wa lā quwwata illā billāh',
    meaning: 'There is no power nor strength except with Allah',
    virtue: 'A treasure from beneath the Throne of Allah to overpower the nafs',
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullāh al-'Aẓīm wa atūbu ilayh",
    meaning: 'I seek forgiveness from Allah the Magnificent and repent to Him',
    virtue: 'Cools impulsive urges and polishes the heart clean from every stain',
  },
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "Subḥānallāhi wa biḥamdih, Subḥānallāhil-'Aẓīm",
    meaning: 'Glory be to Allah and His praise, Glory be to Allah the Magnificent',
    virtue: 'Two phrases beloved to Ar-Rahman, heavy on the Divine Scales',
  },
  {
    id: 'hasbiya',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ',
    transliteration: 'Ḥasbiyallāhu lā ilāha illā Huwa, ‘alayhi tawakkalt',
    meaning: 'Allah is sufficient for me; there is no deity except Him. Upon Him I rely',
    virtue: 'Removes anxiety and fortifies spiritual immunity against all desires',
  },
];

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'completed';

interface DhikrBreathPauseProps {
  onClose?: () => void;
  standalone?: boolean;
}

const TOTAL_SESSION_SECONDS = 30;
const CYCLE_DURATION_SECONDS = 10; // 4s inhale, 2s hold, 4s exhale = 10s. 3 cycles = 30s.

export const DhikrBreathPause: React.FC<DhikrBreathPauseProps> = ({
  onClose,
  standalone = false,
}) => {
  const { incrementBreathPause } = useSitrStore();

  const [isActive, setIsActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_SESSION_SECONDS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedPhraseIndex, setSelectedPhraseIndex] = useState(0);
  const [autoRotatePhrases, setAutoRotatePhrases] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Derived cycle state
  const elapsed = TOTAL_SESSION_SECONDS - secondsRemaining;
  const currentCycleIndex = Math.min(2, Math.floor(elapsed / CYCLE_DURATION_SECONDS));
  const cycleSeconds = elapsed % CYCLE_DURATION_SECONDS;

  // Determine breath phase within the 10-second cycle
  let currentPhase: BreathPhase = 'idle';
  let phaseProgress = 0; // 0 to 1
  let phaseInstruction = 'Press Start to Begin 30s Dhikr Breath Pause';
  let phaseSubInstruction = 'Calm the autonomic nervous system and refocus your soul with Allah';

  if (completed) {
    currentPhase = 'completed';
    phaseInstruction = 'Alhamdulillah! 30-Second Pause Complete';
    phaseSubInstruction = 'The craving has subsided. Your heart is anchored in divine remembrance.';
  } else if (!isActive && secondsRemaining === TOTAL_SESSION_SECONDS) {
    currentPhase = 'idle';
  } else {
    // 0 to 4s: Inhale
    if (cycleSeconds < 4) {
      currentPhase = 'inhale';
      phaseProgress = cycleSeconds / 4;
      phaseInstruction = 'Breathe In Slowly';
      phaseSubInstruction = 'Draw Sakinah (peace) into your chest through the nose';
    }
    // 4 to 6s: Hold
    else if (cycleSeconds < 6) {
      currentPhase = 'hold';
      phaseProgress = (cycleSeconds - 4) / 2;
      phaseInstruction = 'Hold with Presence';
      phaseSubInstruction = 'Reflect: Allah sees and knows this private moment (Al-Muraqabah)';
    }
    // 6 to 10s: Exhale
    else {
      currentPhase = 'exhale';
      phaseProgress = (cycleSeconds - 6) / 4;
      phaseInstruction = 'Exhale & Whisper Dhikr';
      phaseSubInstruction = 'Release tension, nafs, and digital urge as you recite';
    }
  }

  // Active Dhikr phrase based on user selection or automatic cycle rotation
  const activePhrase = autoRotatePhrases
    ? DHIKR_BREATH_PHRASES[currentCycleIndex % DHIKR_BREATH_PHRASES.length]
    : DHIKR_BREATH_PHRASES[selectedPhraseIndex];

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Session completed!
            setIsActive(false);
            setCompleted(true);
            incrementBreathPause();

            if (soundEnabled) {
              dhikrAmbientAudio.playNotificationChime();
            }

            try {
              confetti({
                particleCount: 55,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#10B981', '#059669', '#FDE68A'],
              });
            } catch {
              // ignore
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, soundEnabled, incrementBreathPause]);

  // Audio cues on phase transition
  const prevPhaseRef = useRef<BreathPhase>(currentPhase);
  useEffect(() => {
    if (isActive && soundEnabled && prevPhaseRef.current !== currentPhase) {
      if (currentPhase === 'inhale' || currentPhase === 'exhale') {
        dhikrAmbientAudio.playBeadClick();
      }
    }
    prevPhaseRef.current = currentPhase;
  }, [currentPhase, isActive, soundEnabled]);

  const handleStart = () => {
    setCompleted(false);
    if (secondsRemaining === 0) {
      setSecondsRemaining(TOTAL_SESSION_SECONDS);
    }
    setIsActive(true);
    if (soundEnabled) {
      dhikrAmbientAudio.playNotificationChime();
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(TOTAL_SESSION_SECONDS);
    setCompleted(false);
  };

  // Circular progress calculation (30s = 100%)
  const progressPercent = ((TOTAL_SESSION_SECONDS - secondsRemaining) / TOTAL_SESSION_SECONDS) * 100;
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Scale target for motion orb based on phase
  let orbScale = 0.85;
  let orbGlow = 'rgba(16, 185, 129, 0.2)';
  let orbBorder = 'rgba(212, 175, 55, 0.35)';

  if (currentPhase === 'inhale') {
    orbScale = 1.35;
    orbGlow = 'rgba(212, 175, 55, 0.45)';
    orbBorder = 'rgba(212, 175, 55, 0.85)';
  } else if (currentPhase === 'hold') {
    orbScale = 1.35;
    orbGlow = 'rgba(16, 185, 129, 0.55)';
    orbBorder = 'rgba(52, 211, 153, 0.85)';
  } else if (currentPhase === 'exhale') {
    orbScale = 0.8;
    orbGlow = 'rgba(16, 185, 129, 0.25)';
    orbBorder = 'rgba(212, 175, 55, 0.4)';
  } else if (currentPhase === 'completed') {
    orbScale = 1.1;
    orbGlow = 'rgba(212, 175, 55, 0.6)';
    orbBorder = 'rgba(212, 175, 55, 1)';
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-b from-[#0B3322] via-[#061D14] to-[#04140E] border border-amber-500/40 p-5 sm:p-7 shadow-2xl relative overflow-hidden ${standalone ? 'w-full max-w-lg mx-auto' : ''}`}>
      {/* Radiant Background Ambience */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Wind className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-amber-50">
                Dhikr Breath Pause
              </h2>
              <span className="text-[10px] font-metric font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35">
                30 SECONDS
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Cool impulsive cravings with rhythmic breath & divine remembrance
            </p>
          </div>
        </div>

        {/* Audio Toggle & Close */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-[#04160F] text-amber-300 hover:text-white border border-amber-500/25 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-[#04160F] text-emerald-300 hover:text-white border border-amber-500/25 transition-colors cursor-pointer font-metric font-semibold"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Cycle Indicators (3 cycles of 10s = 30s) */}
      <div className="flex items-center justify-between py-3 relative z-10">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((idx) => {
            const isFinished = elapsed > (idx + 1) * CYCLE_DURATION_SECONDS || completed;
            const isCurrent = currentCycleIndex === idx && isActive;
            return (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-500 ${
                  isFinished
                    ? 'w-7 bg-amber-400'
                    : isCurrent
                    ? 'w-8 bg-emerald-400 ring-2 ring-emerald-300/40 animate-pulse'
                    : 'w-4 bg-[#04160F] border border-amber-500/20'
                }`}
                title={`Cycle ${idx + 1} of 3`}
              />
            );
          })}
          <span className="text-[10px] text-emerald-200/70 font-metric ml-1.5">
            {completed
              ? 'All 3 cycles completed'
              : `Cycle ${currentCycleIndex + 1} of 3 (10s each)`}
          </span>
        </div>

        {/* 30s Countdown Display */}
        <div className="flex items-center gap-1 bg-[#04160F] px-2.5 py-1 rounded-xl border border-amber-500/25 font-metric text-xs font-bold text-amber-300">
          <span>{secondsRemaining}s</span>
          <span className="text-[10px] text-emerald-300/60 font-normal">left</span>
        </div>
      </div>

      {/* Central Interactive Animation Sphere */}
      <div className="relative py-4 flex flex-col items-center justify-center min-h-[260px] select-none">
        {/* SVG Circular Progress Track */}
        <svg className="w-56 h-56 -rotate-90 pointer-events-none">
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="text-[#04160F] stroke-current"
            strokeWidth="5"
            fill="transparent"
          />
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="text-amber-400 stroke-current transition-all duration-1000 ease-linear"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Dynamic Motion Expanding/Contracting Breathing Orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer Pulsing Aura Ring */}
          <motion.div
            animate={{
              scale: orbScale * 1.15,
              opacity: isActive ? [0.35, 0.7, 0.35] : 0.25,
            }}
            transition={{
              duration: currentPhase === 'hold' ? 2 : 4,
              ease: 'easeInOut',
            }}
            style={{
              boxShadow: `0 0 45px ${orbGlow}`,
            }}
            className="w-40 h-40 rounded-full border border-amber-400/30 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent pointer-events-none"
          />

          {/* Inner Breathing Core */}
          <motion.div
            animate={{
              scale: orbScale,
              borderColor: orbBorder,
            }}
            transition={{
              duration: currentPhase === 'hold' ? 2 : 4,
              ease: 'easeInOut',
            }}
            className="w-32 h-32 rounded-full border-2 bg-gradient-to-br from-[#08261A] via-[#061D14] to-[#04140E] flex flex-col items-center justify-center p-3 text-center shadow-[inset_0_0_20px_rgba(212,175,55,0.2)] pointer-events-auto"
          >
            {completed ? (
              <CheckCircle2 className="w-9 h-9 text-amber-400 animate-bounce" />
            ) : (
              <>
                <span className="text-[10px] font-metric font-bold uppercase tracking-wider text-amber-400/90">
                  {currentPhase === 'idle'
                    ? 'READY'
                    : currentPhase.toUpperCase()}
                </span>
                <span className="text-xl sm:text-2xl font-bold font-metric text-amber-50 my-0.5">
                  {isActive ? `${secondsRemaining}s` : '30s'}
                </span>
                <span className="text-[9px] text-emerald-200/70 font-metric">
                  {isActive
                    ? currentPhase === 'inhale'
                      ? 'Inhale 4s'
                      : currentPhase === 'hold'
                      ? 'Hold 2s'
                      : 'Exhale 4s'
                    : 'Tap Start'}
                </span>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Real-time Breath Phase Guidance Instruction */}
      <div className="text-center py-2 relative z-10 space-y-1">
        <h3 className="text-sm sm:text-base font-extrabold text-amber-50 tracking-tight flex items-center justify-center gap-2">
          {currentPhase === 'inhale' && <span className="text-emerald-400 text-xs animate-bounce">▲</span>}
          {currentPhase === 'hold' && <span className="text-amber-400 text-xs">◆</span>}
          {currentPhase === 'exhale' && <span className="text-teal-400 text-xs animate-bounce">▼</span>}
          <span>{phaseInstruction}</span>
        </h3>
        <p className="text-xs text-emerald-200/80 font-sans max-w-sm mx-auto leading-relaxed">
          {phaseSubInstruction}
        </p>
      </div>

      {/* Displayed Dhikr Phrase Box */}
      <div className="mt-3 p-4 rounded-2xl bg-[#04160F] border border-amber-500/30 relative z-10 text-center space-y-2 shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-metric text-amber-400/90 px-1">
          <span className="uppercase font-bold tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Focus Dhikr
          </span>
          <span className="text-emerald-300/70">
            {autoRotatePhrases ? 'Auto-cycling each 10s' : 'Locked phrase'}
          </span>
        </div>

        {/* Arabic Calligraphy */}
        <p
          className="font-arabic text-xl sm:text-2xl text-amber-300 font-bold leading-loose drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          dir="rtl"
        >
          {activePhrase.arabic}
        </p>

        {/* Transliteration & English */}
        <div className="space-y-1 pt-1 border-t border-amber-500/15">
          <p className="text-xs font-semibold text-white tracking-wide font-sans">
            {activePhrase.transliteration}
          </p>
          <p className="text-[11px] text-emerald-100/85 italic">
            “{activePhrase.meaning}”
          </p>
          <span className="block text-[10px] text-amber-300/80 font-metric pt-0.5">
            ✦ {activePhrase.virtue}
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        {/* Play / Pause / Reset buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isActive ? (
            <button
              type="button"
              onClick={handleStart}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{completed ? 'Repeat 30s Pause' : secondsRemaining < TOTAL_SESSION_SECONDS ? 'Resume Pause' : 'Start 30s Pause'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-2xl bg-[#08261A] hover:bg-[#0B3322] border border-amber-500/40 text-amber-200 hover:text-white font-extrabold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-[#04160F] hover:bg-[#061D14] border border-amber-500/25 text-emerald-300 hover:text-white transition-colors cursor-pointer"
            title="Reset timer to 30s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Phrase Selector Options */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setAutoRotatePhrases(true)}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-metric font-semibold transition-all whitespace-nowrap cursor-pointer ${
              autoRotatePhrases
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50'
                : 'bg-[#04160F] text-emerald-300/70 border border-amber-500/20 hover:text-white'
            }`}
          >
            Auto 3-Phrases
          </button>

          {DHIKR_BREATH_PHRASES.map((ph, idx) => (
            <button
              key={ph.id}
              type="button"
              onClick={() => {
                setAutoRotatePhrases(false);
                setSelectedPhraseIndex(idx);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-metric font-semibold transition-all whitespace-nowrap cursor-pointer ${
                !autoRotatePhrases && selectedPhraseIndex === idx
                  ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-400'
                  : 'bg-[#04160F] text-emerald-300/70 border border-amber-500/20 hover:text-white'
              }`}
            >
              {ph.id === 'lahawla' ? 'La Hawla' : ph.id === 'astaghfirullah' ? 'Istighfar' : ph.id === 'subhanallah' ? 'SubhanAllah' : 'HasbiyAllah'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
