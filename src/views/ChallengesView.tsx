import React, { useState } from 'react';
import { Trophy, CheckCircle2, Shield, Moon, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  reward: string;
  progress: number;
  completed: boolean;
}

export const ChallengesView: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'ch-1',
      title: '72-Hour Short-Form Fast',
      subtitle: 'Zero TikTok, Reels, or Shorts for 3 consecutive days.',
      duration: '3 Days',
      reward: '🌿 Three Days Taqwa Badge',
      progress: 66,
      completed: false,
    },
    {
      id: 'ch-2',
      title: 'Night Guard Discipline',
      subtitle: 'No screens after Isha until morning Fajr adhan.',
      duration: '7 Days',
      reward: '🌙 Night Guardian Ribbon',
      progress: 85,
      completed: false,
    },
    {
      id: 'ch-3',
      title: '100x Daily Istighfar',
      subtitle: 'Perform at least 3 completed sets of 33x dhikr every day.',
      duration: 'Ongoing',
      reward: '💎 Purified Heart Seal',
      progress: 100,
      completed: true,
    },
  ]);

  const toggleChallengeComplete = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.completed;
          if (next) {
            confetti({
              particleCount: 50,
              spread: 60,
              colors: ['#D4A017', '#7C3AED', '#22C55E'],
            });
          }
          return { ...c, completed: next, progress: next ? 100 : c.progress };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-amber-50">Jihad al-Nafs Challenges</h1>
        </div>
        <p className="text-xs text-emerald-200/80 mt-0.5">
          Structured spiritual disciplines to forge long-term taqwa and break addictive loops.
        </p>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className={`p-5 rounded-2xl border transition-all ${
              ch.completed
                ? 'bg-[#08261A] border-emerald-500/50 shadow-md'
                : 'bg-[#061D14] border-amber-500/25'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-white">{ch.title}</h2>
                  <span className="text-[10px] font-metric px-2 py-0.5 rounded-full bg-[#04160E] text-amber-300 font-semibold border border-amber-500/30">
                    {ch.duration}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">{ch.subtitle}</p>
              </div>

              <button
                onClick={() => toggleChallengeComplete(ch.id)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                  ch.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-[#04160E] text-emerald-400/40 border-amber-500/30 hover:text-amber-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between">
              <span className="text-[10px] text-amber-300 font-metric font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {ch.reward}
              </span>
              <span className="text-[10px] text-emerald-300 font-metric">
                {ch.completed ? 'Achieved • الحمد لله' : `${ch.progress}% completed`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#061D14] border border-amber-500/35 text-center space-y-1.5">
        <p className="font-arabic text-xl text-amber-50 font-bold leading-loose" dir="rtl">
          إِنَّ اللَّهَ مَعَ الصَّابِرِينَ
        </p>
        <p className="text-xs text-emerald-200 italic font-sans">
          “Indeed, Allah is with the patient.”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah Al-Baqarah (Quran 2:153)
        </span>
      </div>
    </div>
  );
};
