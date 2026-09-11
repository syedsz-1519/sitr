import React from 'react';
import { Brain, TrendingUp, Sparkles, Shield, Info, CheckCircle2 } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const NafsScoreView: React.FC = () => {
  const { getNafsScore, events, dhikrSessionsCompletedToday, currentStreak } = useSitrStore();
  const nafsInfo = getNafsScore();

  // Framework tiers
  const tiers = [
    {
      range: '90–100',
      name: 'Nafs al-Mutma’innah',
      arabic: 'النَّفْسُ الْمُطْمَئِنَّة',
      meaning: 'The Soul at Peace',
      ayah: 'Quran 89:27',
      desc: 'Serenity and steady self-governance. Whispers lose their hold on you.',
      active: nafsInfo.score >= 90,
      color: 'emerald',
    },
    {
      range: '70–89',
      name: 'Nafs al-Lawwamah',
      arabic: 'النَّفْسُ اللَّوَّامَة',
      meaning: 'The Self-Reproaching Soul',
      ayah: 'Quran 75:2',
      desc: 'Aware of missteps, quick to repent, and continually resetting.',
      active: nafsInfo.score >= 70 && nafsInfo.score < 90,
      color: 'emerald',
    },
    {
      range: '50–69',
      name: 'Nafs al-Mujahidah',
      arabic: 'النَّفْسُ الْمُجَاهِدَة',
      meaning: 'The Striving Soul',
      ayah: 'Quran 29:69',
      desc: 'Active spiritual battlefield. Pushing back against habitual triggers.',
      active: nafsInfo.score >= 50 && nafsInfo.score < 70,
      color: 'teal',
    },
    {
      range: '30–49',
      name: 'Nafs al-Ammarah',
      arabic: 'النَّفْسُ الأَمَّارَة',
      meaning: 'The Impulsive Soul',
      ayah: 'Quran 12:53',
      desc: 'The soul inclined to impulse. You are in the arena right now, akhi — hold the line.',
      active: nafsInfo.score >= 30 && nafsInfo.score < 50,
      color: 'amber',
    },
    {
      range: '0–29',
      name: 'Nafs in Vulnerability',
      arabic: 'النَّفْسُ فِي الْمِحْنَة',
      meaning: 'The Vulnerable Soul',
      ayah: 'Quran 2:155',
      desc: 'High risk moment. Turn immediately to dhikr and close tempting tabs.',
      active: nafsInfo.score < 30,
      color: 'rose',
    },
  ];

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (nafsInfo.score / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-amber-50">Nafs Score</h1>
        </div>
        <p className="text-xs text-emerald-200/80 mt-0.5">
          Calculated dynamically from your focus windows, blocked temptations, and dhikr consistency.
        </p>
      </div>

      {/* Hero Circular Score Card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0A3825] via-[#062417] to-[#04160E] border border-amber-500/35 p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-metric font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>+20 vs weekly avg</span>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center my-3">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            <circle
              className="text-[#0D3827]"
              cx="70"
              cy="70"
              fill="none"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
            />
            <circle
              className="text-emerald-500 transition-all duration-700 ease-out"
              cx="70"
              cy="70"
              fill="none"
              r={radius}
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="10"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.7))',
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-metric text-4xl font-extrabold text-white leading-none">
              {nafsInfo.score}
            </span>
            <span className="text-[11px] text-emerald-300/70 font-metric mt-1">/ 100</span>
          </div>
        </div>

        {/* Level Banner */}
        <span className="text-[10px] uppercase font-metric tracking-widest text-emerald-200/70 font-semibold mt-1">
          Today's Nafs Level
        </span>
        <h2 className="text-xl font-bold text-amber-50 mt-0.5">{nafsInfo.levelName}</h2>
        <span className="font-arabic text-2xl text-amber-400 font-bold my-1">
          {nafsInfo.arabicName}
        </span>
        <p className="text-xs text-emerald-100/90 max-w-xs leading-relaxed mt-1">
          {nafsInfo.description}
        </p>

        {/* Clean streak pill */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 w-full flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] uppercase font-metric text-emerald-200/60 block">
              Clean Days
            </span>
            <span className="text-sm font-bold text-white font-metric">{currentStreak} day(s)</span>
          </div>
          <div className="h-6 w-px bg-amber-500/20" />
          <div>
            <span className="text-[10px] uppercase font-metric text-emerald-200/60 block">
              Dhikr Sets
            </span>
            <span className="text-sm font-bold text-amber-300 font-metric">
              {dhikrSessionsCompletedToday} completed
            </span>
          </div>
        </div>
      </div>

      {/* Realtime Algorithm Breakdown */}
      <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
            Scoring Formula Breakdown
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-amber-500/15">
            <span className="text-emerald-200/80">Base Score</span>
            <span className="font-metric font-semibold text-white">100 pts</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-amber-500/15">
            <span className="text-emerald-200/80">
              Blocked attempts penalty ({events.length} × -3)
            </span>
            <span className="font-metric font-semibold text-rose-400">
              -{events.length * 3} pts
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-amber-500/15">
            <span className="text-emerald-200/80">
              Dhikr completed boost ({dhikrSessionsCompletedToday} × +4)
            </span>
            <span className="font-metric font-semibold text-emerald-400">
              +{dhikrSessionsCompletedToday * 4} pts
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-amber-500/15">
            <span className="text-emerald-200/80">Clean consistency factor</span>
            <span className="font-metric font-semibold text-amber-300">
              +{Math.min(14, currentStreak * 6)} pts
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-white font-bold">Computed Nafs Score</span>
            <span className="font-metric font-extrabold text-amber-400 text-sm">
              {nafsInfo.score} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Quranic Framework Tier List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
            Quranic Nafs Framework
          </span>
          <span className="text-[10px] text-emerald-200/70 font-metric">
            5 Stages of the Soul
          </span>
        </div>

        <div className="space-y-2.5">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                tier.active
                  ? 'bg-[#08261A] border-amber-500/60 shadow-[0_0_20px_rgba(212,175,55,0.2)] ring-1 ring-amber-500/40'
                  : 'bg-[#061D14] border-amber-500/25 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{tier.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#04160E] text-amber-300 font-metric border border-amber-500/30">
                    {tier.range}
                  </span>
                </div>
                <span className="font-arabic text-lg text-amber-300 font-bold" dir="rtl">
                  {tier.arabic}
                </span>
              </div>

              <p className="text-xs text-emerald-100/80 leading-relaxed mt-1">{tier.desc}</p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-500/20 text-[10px] text-emerald-300 font-metric">
                <span>{tier.meaning}</span>
                <span className="text-amber-300 font-semibold">{tier.ayah}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Ayah Card */}
      <div className="p-5 rounded-2xl bg-[#061D14] border border-amber-500/35 text-center space-y-1.5">
        <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300 font-bold">
          Spiritual Anchor
        </span>
        <p className="font-arabic text-2xl text-amber-50 font-bold leading-loose" dir="rtl">
          قَدْ أَفْلَحَ مَن زَكَّاهَا
        </p>
        <p className="text-xs text-emerald-200 italic font-sans">
          “He who purifies it [the nafs] will succeed.”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah Ash-Shams (Quran 91:9)
        </span>
      </div>
    </div>
  );
};
