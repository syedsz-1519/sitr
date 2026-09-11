import React, { useState } from 'react';
import { Sparkles, Clock, Check, Heart, BookOpen, Wind, Activity } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { DHIKR_OPTIONS } from '../data/dhikr';
import { DhikrTapCard } from '../components/DhikrTapCard';
import { DhikrAmbientPlayer } from '../components/DhikrAmbientPlayer';
import { DhikrBreathPause } from '../components/DhikrBreathPause';
import { DhikrType } from '../types';

export const DhikrSanctuaryView: React.FC = () => {
  const {
    selectedDhikrType,
    setDhikrType,
    dhikrTarget,
    setDhikrTarget,
    dhikrSessionsCompletedToday,
    breathPausesCompleted,
  } = useSitrStore();

  const [activeTab, setActiveTab] = useState<'breath_pause' | 'misbaha'>('breath_pause');

  const targets = [11, 33, 99];

  const virtues: Record<DhikrType, { virtue: string; hadith: string }> = {
    lahawla: {
      virtue: 'A treasure from beneath the Throne of Allah',
      hadith:
        'The Prophet ﷺ said: “Should I not guide you to a treasure from the treasures of Paradise? Say: La hawla wa la quwwata illa billah.” (Bukhari & Muslim)',
    },
    astaghfirullah: {
      virtue: 'Erases the stains of temptation from the heart',
      hadith:
        'The Prophet ﷺ said: “When a servant commits a sin, a black mark is placed upon his heart. But if he desists, seeks forgiveness, and repents, his heart is polished clean.” (Tirmidhi)',
    },
    subhanallah: {
      virtue: 'Heavy on the Scales, beloved to Ar-Rahman',
      hadith:
        'The Prophet ﷺ said: “Whoever says ‘SubhanAllah wa bihamdihi’ one hundred times a day, his sins will be forgiven even if they are like the foam of the sea.” (Bukhari)',
    },
    alhamdulillah: {
      virtue: 'Fills the scale with good deeds',
      hadith:
        'The Prophet ﷺ said: “Cleanliness is half of faith and ‘Al-hamdulillah’ fills the scale.” (Muslim)',
    },
    mixed: {
      virtue: 'Balanced remembrance throughout the day',
      hadith: 'Keep your tongue moist with the remembrance of Allah.',
    },
  };

  const currentVirtue = virtues[selectedDhikrType] || virtues.lahawla;

  return (
    <div className="space-y-5 pb-12">
      {/* Title & Stats */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-bold text-amber-50">Dhikr Sanctuary</h1>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-metric font-semibold text-emerald-300/80 bg-[#061D14] px-2.5 py-1 rounded-full border border-amber-500/20">
            <span>{breathPausesCompleted} Pauses</span>
            <span>•</span>
            <span>{dhikrSessionsCompletedToday} Sets</span>
          </div>
        </div>
        <p className="text-xs text-emerald-200/80 mt-0.5">
          Redirect the neurochemical urge into rhythmic mindfulness and divine remembrance.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#04160E] border border-amber-500/30">
        <button
          type="button"
          onClick={() => setActiveTab('breath_pause')}
          className={`py-2.5 px-3 rounded-xl font-metric font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'breath_pause'
              ? 'bg-gradient-to-r from-amber-500/20 to-emerald-600/30 text-amber-200 border border-amber-400/40 shadow-sm'
              : 'text-emerald-200/60 hover:text-white'
          }`}
        >
          <Wind className="w-4 h-4 text-amber-400" />
          <span>30s Breath Pause</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('misbaha')}
          className={`py-2.5 px-3 rounded-xl font-metric font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'misbaha'
              ? 'bg-gradient-to-r from-amber-500/20 to-emerald-600/30 text-amber-200 border border-amber-400/40 shadow-sm'
              : 'text-emerald-200/60 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Misbaha Counter</span>
        </button>
      </div>

      {/* Subtle Ambient Audio Loop (Soft Rhythmic Chant & Sanctuary Drone) */}
      <DhikrAmbientPlayer />

      {/* Mode 1: 30s Dhikr Breath Pause Animation Tool */}
      {activeTab === 'breath_pause' ? (
        <div className="space-y-5">
          <DhikrBreathPause />

          {/* Quick Scientific & Spiritual Context Card */}
          <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-300">
              <Heart className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase font-metric tracking-wider">
                Why 30 Seconds Breaks Dopamine Spikes
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
              Urges and digital triggers cause shallow breathing and sympathetic nervous arousal. Taking 30 seconds to inhale slowly, hold with awareness of Allah (Al-Muraqabah), and exhale divine Dhikr lowers cortisol, re-engages the prefrontal cortex, and breaks the compulsive loop before action is taken.
            </p>
          </div>
        </div>
      ) : (
        /* Mode 2: Classic Misbaha Circular Tap Card & Setup */
        <div className="space-y-5">
          <DhikrTapCard />

          {/* Dhikr Phrase Selector */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider px-1 block">
              Select Active Dhikr
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DHIKR_OPTIONS.map((opt) => {
                const isSelected = selectedDhikrType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDhikrType(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#08261A] border-amber-500/60 shadow-[0_0_16px_rgba(212,175,55,0.25)] ring-1 ring-amber-400/40'
                        : 'bg-[#061D14] border-amber-500/25 hover:border-amber-500/45'
                    }`}
                    type="button"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <p className="font-arabic text-xl text-amber-300 my-2 leading-relaxed text-right font-bold" dir="rtl">
                      {opt.arabic}
                    </p>

                    <p className="text-[11px] text-emerald-200/80 line-clamp-1">{opt.meaning}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Count Selector */}
          <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
                Target Dhikr Count
              </span>
              <span className="text-[10px] text-emerald-200/70 font-metric">
                Current: {dhikrTarget} taps
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {targets.map((count) => (
                <button
                  key={count}
                  onClick={() => setDhikrTarget(count)}
                  className={`py-3 rounded-xl font-metric font-bold text-sm transition-all cursor-pointer ${
                    dhikrTarget === count
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-[#04160E] text-emerald-200/70 hover:text-white border border-amber-500/25'
                  }`}
                  type="button"
                >
                  {count}×
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Virtue & Prophetic Hadith Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#08261A] to-[#04160E] border border-amber-500/35 p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase font-metric tracking-wider text-amber-300">
            Prophetic Virtue
          </span>
        </div>
        <p className="text-xs font-bold text-white">{currentVirtue.virtue}</p>
        <p className="text-xs text-emerald-200/85 italic leading-relaxed">
          {currentVirtue.hadith}
        </p>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#061D14] border border-amber-500/35 text-center space-y-1.5">
        <p className="font-arabic text-xl text-amber-50 font-bold leading-loose" dir="rtl">
          أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
        </p>
        <p className="text-xs text-emerald-200 italic font-sans">
          “Unquestionably, by the remembrance of Allah hearts are assured.”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah Ar-Ra’d (Quran 13:28)
        </span>
      </div>
    </div>
  );
};
