import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Quote,
  PenTool,
  Calendar,
  Filter,
  Trash2,
  Share2,
  Heart,
  Plus,
  ArrowRight,
  Shield,
  HelpCircle,
  Sun,
  Check,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { REFLECTION_PROMPTS, getDailyPrompt } from '../data/dailyReflections';
import { SpiritualState, ReflectionPrompt, DailyReflectionEntry, DailyGratitudeEntry } from '../types';
import { dhikrAmbientAudio } from '../utils/ambientAudioEngine';

const GRATITUDE_STORAGE_KEY = 'sitr_daily_gratitude_entries';

const getOffsetDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const SEED_GRATITUDE_ENTRIES: DailyGratitudeEntry[] = [
  {
    id: 'gratitude-seed-1',
    date: getOffsetDate(1),
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    items: [
      'Protected my gaze and closed an online trigger instantly',
      'Prayed all 5 daily salah with quiet presence in the heart',
      'Health, physical vitality, and safety of my family',
    ],
    categoryNote: 'Taqwa & Family',
  },
  {
    id: 'gratitude-seed-2',
    date: getOffsetDate(2),
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      'Woke up early for Tahajjud and heartfelt sincere Istighfar',
      'Clean halal food and sustenance provided without hardship',
      'Clear eyesight and an active mind to read the Quran',
    ],
    categoryNote: 'Sakinah & Sustenance',
  },
  {
    id: 'gratitude-seed-3',
    date: getOffsetDate(3),
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      'The blessing of knowing Allah and knowing repentance is always accepted',
      'A peaceful day free from digital distractions and endless scrolling',
      'The gift of clean water, shelter, and restful sleep',
    ],
    categoryNote: 'Repentance & Peace',
  },
];

const loadInitialGratitudeEntries = (): DailyGratitudeEntry[] => {
  try {
    const stored = localStorage.getItem(GRATITUDE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load gratitude entries from localStorage:', err);
  }
  return SEED_GRATITUDE_ENTRIES;
};

export const DailyReflectionView: React.FC = () => {
  const {
    dailyReflections,
    getTodayReflection,
    setDailyReflectionModalOpen,
    deleteDailyReflection,
  } = useSitrStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = getTodayReflection();
  const todayPrompt = getDailyPrompt();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePrompt, setActivePrompt] = useState<ReflectionPrompt>(todayPrompt);

  // Daily Gratitude state
  const [gratitudeEntries, setGratitudeEntries] = useState<DailyGratitudeEntry[]>(loadInitialGratitudeEntries);
  const [item1, setItem1] = useState('');
  const [item2, setItem2] = useState('');
  const [item3, setItem3] = useState('');
  const [gratitudeSavedFeedback, setGratitudeSavedFeedback] = useState<string | null>(null);

  // Sync today's existing gratitude if present
  useEffect(() => {
    const existingToday = gratitudeEntries.find((e) => e.date === todayStr);
    if (existingToday) {
      setItem1(existingToday.items[0] || '');
      setItem2(existingToday.items[1] || '');
      setItem3(existingToday.items[2] || '');
    }
  }, [todayStr]);

  // Persist gratitude entries to localStorage
  const persistGratitude = (entries: DailyGratitudeEntry[]) => {
    setGratitudeEntries(entries);
    try {
      localStorage.setItem(GRATITUDE_STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error('Failed to save gratitude entries to localStorage:', err);
    }
  };

  const handleSaveGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item1.trim() && !item2.trim() && !item3.trim()) {
      return;
    }

    const items: [string, string, string] = [
      item1.trim() || 'A blessing of physical wellness and health',
      item2.trim() || 'A blessing of guidance, prayer, and protection from sin',
      item3.trim() || 'A blessing of peace, sustenance, and shelter',
    ];

    const existingIndex = gratitudeEntries.findIndex((e) => e.date === todayStr);
    let updatedEntries: DailyGratitudeEntry[];

    if (existingIndex >= 0) {
      updatedEntries = [...gratitudeEntries];
      updatedEntries[existingIndex] = {
        ...updatedEntries[existingIndex],
        items,
        timestamp: new Date().toISOString(),
      };
    } else {
      const newEntry: DailyGratitudeEntry = {
        id: 'gratitude-' + Date.now(),
        date: todayStr,
        timestamp: new Date().toISOString(),
        items,
        categoryNote: 'Daily Shukr',
      };
      updatedEntries = [newEntry, ...gratitudeEntries];
    }

    persistGratitude(updatedEntries);
    dhikrAmbientAudio.playNotificationChime();
    setGratitudeSavedFeedback('Alhamdulillah! 3 blessings recorded for today.');
    setTimeout(() => {
      setGratitudeSavedFeedback(null);
    }, 3500);
  };

  const handleDeleteGratitude = (id: string) => {
    const updated = gratitudeEntries.filter((e) => e.id !== id);
    persistGratitude(updated);
  };

  const handleApplySuggestion = (suggestion: string, targetSlot: 1 | 2 | 3) => {
    if (targetSlot === 1) setItem1(suggestion);
    if (targetSlot === 2) setItem2(suggestion);
    if (targetSlot === 3) setItem3(suggestion);
  };

  const isTodayGratitudeSaved = gratitudeEntries.some((e) => e.date === todayStr);

  const categories = [
    { id: 'all', label: 'All Themes' },
    { id: 'muhasabah', label: 'Self-Reckoning' },
    { id: 'tawbah', label: 'Tawbah & Return' },
    { id: 'sabr', label: 'Sabr & Urges' },
    { id: 'istiqamah', label: 'Steadfastness' },
    { id: 'gratitude', label: 'Gratitude (Shukr)' },
  ];

  const filteredPrompts =
    selectedCategory === 'all'
      ? REFLECTION_PROMPTS
      : REFLECTION_PROMPTS.filter((p) => p.quote.category === selectedCategory);

  const getSpiritualStateBadge = (state: SpiritualState) => {
    switch (state) {
      case 'guarded':
        return { label: 'Guarded Eyes', icon: '🛡️', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'peaceful':
        return { label: 'Mutma’innah', icon: '🕊️', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
      case 'tested':
        return { label: 'Tested & Patient', icon: '⏳', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'repentant':
        return { label: 'In Tawbah', icon: '🤲', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'striving':
        return { label: 'Mujahadah', icon: '⚡', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default:
        return { label: state, icon: '✨', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-7 pb-14 animate-fadeIn max-w-3xl mx-auto">
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0A3825] via-[#062417] to-[#04160E] border border-amber-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 font-metric">
                Muhasabah & Shukr Sanctuary
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-amber-50 tracking-tight">
              Daily Reflection & Gratitude
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md">
              Audit your nafs before sleep, record the gifts of your Lord, and wake up with a purified heart.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#08261A] border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] shrink-0">
            <Moon className="w-6 h-6 fill-amber-400/40" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-amber-500/20 relative z-10">
          <div className="bg-[#04160E]/80 border border-amber-500/20 rounded-2xl p-2.5 text-center">
            <span className="text-base sm:text-lg font-bold text-white block font-metric">
              {dailyReflections.length}
            </span>
            <span className="text-[10px] text-emerald-200/70 uppercase tracking-wider font-metric block">
              Reflections
            </span>
          </div>

          <div className="bg-[#04160E]/80 border border-amber-500/20 rounded-2xl p-2.5 text-center">
            <span className="text-base sm:text-lg font-bold text-amber-400 block font-metric">
              {gratitudeEntries.length}
            </span>
            <span className="text-[10px] text-emerald-200/70 uppercase tracking-wider font-metric block">
              Shukr Days
            </span>
          </div>

          <div className="bg-[#04160E]/80 border border-amber-500/20 rounded-2xl p-2.5 text-center">
            <span className="text-base sm:text-lg font-bold text-emerald-400 block font-metric">
              {isTodayGratitudeSaved ? 'Recorded' : 'Pending'}
            </span>
            <span className="text-[10px] text-emerald-200/70 uppercase tracking-wider font-metric block">
              Today's Shukr
            </span>
          </div>
        </div>
      </div>

      {/* 2. DAILY GRATITUDE SECTION (Shukr) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#08261A] via-[#061D14] to-[#04140E] border border-amber-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Heart className="w-5 h-5 fill-amber-400/40" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-50">
                  Daily Gratitude (شُكْر • Shukr)
                </h2>
                {isTodayGratitudeSaved && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 font-metric">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Saved Today</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-200/80 font-sans mt-0.5">
                Record three specific blessings you thank Allah for today.
              </p>
            </div>
          </div>
        </div>

        {/* Quranic Ayah on Gratitude */}
        <div className="p-3.5 rounded-2xl bg-[#04160F] border border-amber-500/25 space-y-1">
          <p className="font-arabic text-amber-300 text-sm text-right leading-relaxed font-bold" dir="rtl">
            وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ
          </p>
          <p className="text-xs text-emerald-100/90 italic">
            “And [remember] when your Lord proclaimed: 'If you are grateful, I will surely increase you [in favor].'”
          </p>
          <span className="text-[10px] text-amber-300/80 font-metric block font-medium">
            — Surah Ibrahim (14:7)
          </span>
        </div>

        {/* Form: Three Things I Am Grateful For */}
        <form onSubmit={handleSaveGratitude} className="space-y-3.5 relative z-10">
          {/* Item 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-200 flex items-center gap-2 font-metric">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[11px] font-bold">
                1
              </span>
              <span>Spiritual Blessing (Prayer, Guidance, Lowered Gaze)</span>
            </label>
            <input
              type="text"
              value={item1}
              onChange={(e) => setItem1(e.target.value)}
              placeholder="e.g., Lowered my gaze and looked away from a dangerous ad"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#04160F] border border-amber-500/30 text-xs sm:text-sm text-white placeholder-emerald-400/35 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
            />
          </div>

          {/* Item 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-200 flex items-center gap-2 font-metric">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              <span>Body, Health & Mind (Eyesight, Breath, Calmness)</span>
            </label>
            <input
              type="text"
              value={item2}
              onChange={(e) => setItem2(e.target.value)}
              placeholder="e.g., Clear vision, energy to walk, and peace in my chest"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#04160F] border border-amber-500/30 text-xs sm:text-sm text-white placeholder-emerald-400/35 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
            />
          </div>

          {/* Item 3 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-200 flex items-center gap-2 font-metric">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-[11px] font-bold">
                3
              </span>
              <span>Ease, Sustenance & Protection (Food, Family, Security)</span>
            </label>
            <input
              type="text"
              value={item3}
              onChange={(e) => setItem3(e.target.value)}
              placeholder="e.g., Halal meal on the table and safety from bad company"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#04160F] border border-amber-500/30 text-xs sm:text-sm text-white placeholder-emerald-400/35 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="pt-1">
            <span className="text-[10px] text-emerald-300/70 font-metric block mb-1.5 uppercase tracking-wider font-semibold">
              Quick Suggestions (tap to add):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { text: 'Protected my gaze from an urge', slot: 1 as const },
                { text: 'Prayed Fajr on time', slot: 1 as const },
                { text: 'Healthy eyes and sound mind', slot: 2 as const },
                { text: 'Patience during frustration', slot: 2 as const },
                { text: 'Halal provision and shelter', slot: 3 as const },
                { text: 'Family safety & mother’s dua', slot: 3 as const },
              ].map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySuggestion(sugg.text, sugg.slot)}
                  className="text-[10px] bg-[#04160F] hover:bg-[#0B3322] text-amber-200/90 hover:text-white px-2.5 py-1 rounded-lg border border-amber-500/25 transition-colors cursor-pointer"
                >
                  + {sugg.text}
                </button>
              ))}
            </div>
          </div>

          {/* Submit & Status */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-black fill-black" />
              <span>{isTodayGratitudeSaved ? 'Update Today’s Gratitude' : 'Save Today’s 3 Blessings'}</span>
            </button>

            {gratitudeSavedFeedback && (
              <span className="text-xs font-metric font-semibold text-emerald-300 flex items-center gap-1.5 bg-[#04160F] px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                {gratitudeSavedFeedback}
              </span>
            )}
          </div>
        </form>

        {/* PAST REFLECTIONS LIST (List of past gratitude reflections) */}
        <div className="pt-4 border-t border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-50 font-metric">
                Past Gratitude Reflections ({gratitudeEntries.length})
              </h3>
            </div>
            <span className="text-[10px] text-emerald-200/70 font-metric">
              Saved in localStorage
            </span>
          </div>

          {gratitudeEntries.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#04160E] border border-amber-500/20 text-center space-y-1.5">
              <Heart className="w-6 h-6 text-amber-400/40 mx-auto" />
              <p className="text-xs text-emerald-200 font-semibold">No past gratitude reflections yet</p>
              <p className="text-[11px] text-emerald-200/60">
                Write down three blessings above to begin your gratitude journey.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {gratitudeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl bg-[#04160F] border border-amber-500/25 p-4 space-y-2.5 transition-all hover:border-amber-500/40"
                >
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-50 font-metric">
                        {formatDate(entry.date)}
                      </span>
                      {entry.date === todayStr && (
                        <span className="text-[9px] bg-emerald-600 text-white font-metric uppercase font-bold px-1.5 py-0.5 rounded">
                          Today
                        </span>
                      )}
                      <span className="text-[9px] font-metric font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        3 Blessings Counted
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteGratitude(entry.id)}
                      className="text-emerald-400/40 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Delete gratitude reflection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Open, clearly visible 3 items - NO REVEALING OF BOXES */}
                  <div className="space-y-1.5 pt-1">
                    {entry.items.map((itemText, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-emerald-100 bg-[#061D14] p-2 rounded-xl border border-amber-500/15"
                      >
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-metric">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-sans">{itemText}</span>
                      </div>
                    ))}
                  </div>

                  {entry.categoryNote && (
                    <div className="flex items-center justify-end">
                      <span className="text-[10px] text-amber-300/70 font-metric italic">
                        {entry.categoryNote}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Tonight's Featured Muhasabah Card */}
      <div className="rounded-3xl bg-[#061D14] border border-amber-500/35 p-5 shadow-lg relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric">
              Tonight's Prompt • {new Date().toLocaleDateString(undefined, { weekday: 'long' })}
            </span>
          </div>

          {todayEntry ? (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 font-metric">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1 font-metric animate-pulse">
              <PenTool className="w-3 h-3" />
              <span>Ready for Journaling</span>
            </span>
          )}
        </div>

        {/* Quote Block */}
        <div className="rounded-2xl bg-[#04160E] border border-amber-500/25 p-4 mb-4">
          {activePrompt.quote.arabic && (
            <p className="text-sm sm:text-base text-amber-200/95 font-serif leading-relaxed mb-2 text-right font-arabic">
              {activePrompt.quote.arabic}
            </p>
          )}
          <p className="text-xs sm:text-sm text-emerald-100 italic leading-relaxed">
            “{activePrompt.quote.text}”
          </p>
          <span className="block text-[11px] text-amber-300/80 font-metric mt-1.5 font-medium">
            — {activePrompt.quote.source}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-1 mb-4">
          <h3 className="text-sm font-bold text-white leading-snug">
            {activePrompt.question}
          </h3>
          {activePrompt.subtext && (
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              {activePrompt.subtext}
            </p>
          )}
        </div>

        {/* Trigger Journal Button */}
        <button
          onClick={() => setDailyReflectionModalOpen(true)}
          type="button"
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold uppercase tracking-wider font-metric flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all active:scale-[0.98] cursor-pointer"
        >
          <PenTool className="w-4 h-4" />
          <span>{todayEntry ? 'Edit Tonight’s Reflection' : 'Open Reflection Journal'}</span>
        </button>
      </div>

      {/* 4. Prompt Themes Explorer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-50 font-metric">
              Explore Islamic Prompts ({REFLECTION_PROMPTS.length})
            </h2>
          </div>
          <span className="text-[10px] text-emerald-200/70 font-metric">
            Tap to set as focus
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-metric font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'bg-[#061D14] border border-amber-500/25 text-emerald-200/70 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Prompt List Cards */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => {
                setActivePrompt(prompt);
                setDailyReflectionModalOpen(true);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                activePrompt.id === prompt.id
                  ? 'bg-[#08261A] border-amber-500/60 shadow-md'
                  : 'bg-[#061D14] border-amber-500/25 hover:border-amber-500/45'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[9px] uppercase font-metric tracking-widest text-amber-300 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {prompt.quote.category}
                </span>
                <span className="text-[10px] text-emerald-300/60 font-metric">
                  {prompt.quote.source.split('•')[0]}
                </span>
              </div>
              <p className="text-xs font-semibold text-white group-hover:text-amber-200 transition-colors leading-snug">
                {prompt.question}
              </p>
              <p className="text-[11px] text-emerald-200/70 italic mt-1 line-clamp-1">
                “{prompt.quote.text}”
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Journal Timeline (Full Open Display - NO REVEALING OF BOXES) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-50 font-metric">
              Journal Timeline ({dailyReflections.length})
            </h2>
          </div>
          <span className="text-[10px] text-emerald-200/70 font-metric">
            Private Muhasabah records
          </span>
        </div>

        {dailyReflections.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#061D14] border border-amber-500/25 text-center space-y-2">
            <Moon className="w-8 h-8 text-emerald-400/40 mx-auto" />
            <p className="text-xs text-emerald-200 font-semibold">No reflections recorded yet</p>
            <p className="text-[11px] text-emerald-200/60">
              Start your first nightly audit today to build a mindful, repentant heart before sleep.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {dailyReflections.map((entry) => {
              const stateBadge = getSpiritualStateBadge(entry.spiritualState);

              return (
                <div
                  key={entry.id}
                  className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 transition-all space-y-3 hover:border-amber-500/50"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl select-none">{stateBadge.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {formatDate(entry.date)}
                          </span>
                          {entry.date === todayStr && (
                            <span className="text-[9px] bg-emerald-600 text-white font-metric uppercase font-bold px-1.5 rounded">
                              Today
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-metric font-semibold px-2 py-0.5 rounded-full border ${stateBadge.color}`}
                          >
                            {stateBadge.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-200/60 font-metric">
                          {entry.cleanDayLogged ? '✓ Clean Day Logged' : 'Day of Striving'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteDailyReflection(entry.id)}
                      className="text-emerald-400/40 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Delete reflection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Fully Visible Journal Content - NO REVEALING OF BOXES */}
                  <div className="pt-2 border-t border-amber-500/20 space-y-2.5">
                    <p className="text-xs text-emerald-100 leading-relaxed font-sans whitespace-pre-line">
                      {entry.journalText}
                    </p>

                    {/* Prompt Quote & Question displayed directly */}
                    <div className="p-3 rounded-xl bg-[#04160E] border border-amber-500/20 text-[11px] space-y-1">
                      <p className="font-semibold text-amber-200">
                        Q: {entry.promptQuestion}
                      </p>
                      <p className="text-emerald-300/70 italic">
                        "{entry.quoteText}" — {entry.quoteSource}
                      </p>
                    </div>

                    {/* Gratitude Note if any */}
                    {entry.gratitudeNote && (
                      <div className="flex items-start gap-2 text-xs text-amber-200/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
                        <Heart className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block text-[10px] uppercase font-metric text-amber-300">
                            Blessing / Dua
                          </span>
                          <span>{entry.gratitudeNote}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
