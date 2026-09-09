import React from 'react';
import { Sparkles, Clock, Check, Heart, BookOpen } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { DHIKR_OPTIONS } from '../data/dhikr';
import { DhikrTapCard } from '../components/DhikrTapCard';
import { DhikrAmbientPlayer } from '../components/DhikrAmbientPlayer';
import { DhikrType } from '../types';

export const DhikrSanctuaryView: React.FC = () => {
  const {
    selectedDhikrType,
    setDhikrType,
    dhikrTarget,
    setDhikrTarget,
    dhikrSessionsCompletedToday,
  } = useSitrStore();

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
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-white">Dhikr Sanctuary</h1>
        </div>
        <p className="text-xs text-purple-200/70 mt-0.5">
          Redirect the neurochemical urge into divine remembrance. {dhikrSessionsCompletedToday} sets completed today.
        </p>
      </div>

      {/* Subtle Ambient Audio Loop (Soft Rhythmic Chant & Sanctuary Drone) */}
      <DhikrAmbientPlayer />

      {/* Misbaha Circular Tap Card */}
      <DhikrTapCard />

      {/* Dhikr Phrase Selector */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-white uppercase font-metric tracking-wider px-1 block">
          Select Active Dhikr
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DHIKR_OPTIONS.map((opt) => {
            const isSelected = selectedDhikrType === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setDhikrType(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#221338] border-purple-500/60 shadow-[0_0_16px_rgba(124,58,237,0.25)] ring-1 ring-purple-400/40'
                    : 'bg-[#170F26] border-purple-900/30 hover:border-purple-800/60'
                }`}
                type="button"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-white">{opt.label}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <p className="font-arabic text-xl text-amber-300 my-2 leading-relaxed text-right font-bold" dir="rtl">
                  {opt.arabic}
                </p>

                <p className="text-[11px] text-purple-200/80 line-clamp-1">{opt.meaning}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Count Selector */}
      <div className="rounded-2xl bg-[#170F26] border border-purple-900/30 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase font-metric tracking-wider">
            Target Dhikr Count
          </span>
          <span className="text-[10px] text-purple-300 font-metric">
            Current: {dhikrTarget} taps
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {targets.map((count) => (
            <button
              key={count}
              onClick={() => setDhikrTarget(count)}
              className={`py-3 rounded-xl font-metric font-bold text-sm transition-all ${
                dhikrTarget === count
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#10081C] text-purple-300/70 hover:text-white border border-purple-900/40'
              }`}
              type="button"
            >
              {count}×
            </button>
          ))}
        </div>
      </div>

      {/* Virtue & Prophetic Hadith Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1E1235] to-[#120B1F] border border-purple-800/40 p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-bold uppercase font-metric tracking-wider">
            Prophetic Virtue
          </span>
        </div>
        <p className="text-xs font-bold text-white">{currentVirtue.virtue}</p>
        <p className="text-xs text-purple-200/85 italic leading-relaxed">
          {currentVirtue.hadith}
        </p>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#170F26] border border-purple-900/40 text-center space-y-1.5">
        <p className="font-arabic text-xl text-white font-bold leading-loose" dir="rtl">
          أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
        </p>
        <p className="text-xs text-purple-200 italic font-sans">
          “Unquestionably, by the remembrance of Allah hearts are assured.”
        </p>
        <span className="text-[10px] text-purple-400/80 font-metric block">
          — Surah Ar-Ra’d (Quran 13:28)
        </span>
      </div>
    </div>
  );
};
