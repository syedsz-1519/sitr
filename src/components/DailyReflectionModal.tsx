import React, { useState, useEffect } from 'react';
import {
  X,
  Moon,
  Sparkles,
  Shuffle,
  Heart,
  CheckCircle2,
  Shield,
  Flame,
  Award,
  BookOpen,
  Send,
  Quote,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { REFLECTION_PROMPTS, getDailyPrompt } from '../data/dailyReflections';
import { SpiritualState, ReflectionPrompt } from '../types';

export const DailyReflectionModal: React.FC = () => {
  const {
    dailyReflectionModalOpen,
    setDailyReflectionModalOpen,
    getTodayReflection,
    saveDailyReflection,
  } = useSitrStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingEntry = getTodayReflection();

  // Selected prompt state
  const [selectedPrompt, setSelectedPrompt] = useState<ReflectionPrompt>(() => {
    if (existingEntry?.promptId) {
      const found = REFLECTION_PROMPTS.find((p) => p.id === existingEntry.promptId);
      if (found) return found;
    }
    return getDailyPrompt();
  });

  const [journalText, setJournalText] = useState('');
  const [spiritualState, setSpiritualState] = useState<SpiritualState>('guarded');
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [cleanDayLogged, setCleanDayLogged] = useState(true);
  const [error, setError] = useState('');

  // Populate from existing entry if already recorded today
  useEffect(() => {
    if (dailyReflectionModalOpen) {
      if (existingEntry) {
        setJournalText(existingEntry.journalText || '');
        setSpiritualState(existingEntry.spiritualState || 'guarded');
        setGratitudeNote(existingEntry.gratitudeNote || '');
        setCleanDayLogged(existingEntry.cleanDayLogged ?? true);
        if (existingEntry.promptId) {
          const found = REFLECTION_PROMPTS.find((p) => p.id === existingEntry.promptId);
          if (found) setSelectedPrompt(found);
        }
      } else {
        setJournalText('');
        setSpiritualState('guarded');
        setGratitudeNote('');
        setCleanDayLogged(true);
        setSelectedPrompt(getDailyPrompt());
      }
      setError('');
    }
  }, [dailyReflectionModalOpen, existingEntry]);

  if (!dailyReflectionModalOpen) return null;

  const handleShufflePrompt = () => {
    const currentIndex = REFLECTION_PROMPTS.findIndex((p) => p.id === selectedPrompt.id);
    const nextIndex = (currentIndex + 1) % REFLECTION_PROMPTS.length;
    setSelectedPrompt(REFLECTION_PROMPTS[nextIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) {
      setError('Please write at least a few words reflecting on your day.');
      return;
    }

    saveDailyReflection({
      date: todayStr,
      promptId: selectedPrompt.id,
      quoteText: selectedPrompt.quote.text,
      quoteSource: selectedPrompt.quote.source,
      quoteArabic: selectedPrompt.quote.arabic,
      promptQuestion: selectedPrompt.question,
      journalText: journalText.trim(),
      spiritualState,
      gratitudeNote: gratitudeNote.trim() || undefined,
      cleanDayLogged,
    });
  };

  const spiritualStatesList: {
    id: SpiritualState;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      id: 'guarded',
      label: 'Guarded Eyes',
      icon: '🛡️',
      description: 'Lowered gaze & held boundaries',
    },
    {
      id: 'peaceful',
      label: 'Mutma’innah',
      icon: '🕊️',
      description: 'Quiet heart & high presence in prayer',
    },
    {
      id: 'tested',
      label: 'Tested & Patient',
      icon: '⏳',
      description: 'Faced urges but exercised Sabr',
    },
    {
      id: 'repentant',
      label: 'In Tawbah',
      icon: '🤲',
      description: 'Made sincere Istighfar & cleansing',
    },
    {
      id: 'striving',
      label: 'Mujahadah',
      icon: '⚡',
      description: 'Striving hard against distraction',
    },
  ];

  const wordCount = journalText.trim() ? journalText.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#082318] border border-amber-500/40 p-5 sm:p-6 shadow-[0_20px_60px_rgba(4,20,14,0.7)] text-white my-6 max-h-[92vh] overflow-y-auto">
        {/* Subtle luminous header glow */}
        <div className="absolute -top-10 inset-x-0 h-32 bg-emerald-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setDailyReflectionModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#061D14] text-amber-300 hover:text-white flex items-center justify-center transition-colors border border-amber-500/30 z-20 cursor-pointer"
          type="button"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B3824] to-[#04160E] border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_18px_rgba(212,175,55,0.3)] shrink-0">
            <Moon className="w-5 h-5 fill-amber-400/40" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-amber-50 tracking-tight">
                Daily Reflection & Muhasabah
              </h2>
              {existingEntry && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-metric font-bold border border-emerald-500/40">
                  Editing Today
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200/80 font-sans">
              "Hold yourselves accountable before you are held accountable."
            </p>
          </div>
        </div>

        {/* Islamic Quote Card */}
        <div className="relative rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 mb-4 text-left shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300 font-bold flex items-center gap-1.5">
              <Quote className="w-3 h-3" />
              <span>Ayah / Prophetic Wisdom</span>
            </span>

            <button
              type="button"
              onClick={handleShufflePrompt}
              className="text-[10px] font-metric font-semibold text-amber-300 hover:text-white flex items-center gap-1 bg-[#0B3322] hover:bg-[#0D3F2A] px-2 py-1 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
              title="View another prompt"
            >
              <Shuffle className="w-3 h-3" />
              <span>Shuffle Prompt</span>
            </button>
          </div>

          {selectedPrompt.quote.arabic && (
            <p className="text-sm text-amber-200 font-serif leading-relaxed mb-2 text-right font-arabic">
              {selectedPrompt.quote.arabic}
            </p>
          )}

          <p className="text-xs sm:text-sm text-emerald-100 italic leading-relaxed font-sans">
            “{selectedPrompt.quote.text}”
          </p>

          <span className="block text-[11px] text-amber-300/80 font-metric mt-1.5 font-medium">
            — {selectedPrompt.quote.source}
          </span>
        </div>

        {/* The Reflection Question Banner */}
        <div className="p-3.5 rounded-2xl bg-[#0A2E1F] border border-amber-500/30 mb-4 space-y-1">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-50 leading-snug">
                {selectedPrompt.question}
              </p>
              {selectedPrompt.subtext && (
                <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                  {selectedPrompt.subtext}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Spiritual State Selector */}
          <div>
            <label className="block text-[11px] uppercase font-metric tracking-wider text-amber-300 font-bold mb-1.5">
              Today's Spiritual State of Nafs
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {spiritualStatesList.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSpiritualState(st.id)}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 cursor-pointer ${
                    spiritualState === st.id
                      ? 'bg-emerald-600/40 border-amber-400 text-amber-50 ring-2 ring-amber-400/50 shadow-md'
                      : 'bg-[#061D14] border-amber-500/20 text-emerald-200/80 hover:border-amber-500/40'
                  }`}
                >
                  <span className="text-lg select-none">{st.icon}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate leading-tight">
                      {st.label}
                    </span>
                    <span className="text-[9px] text-emerald-300/70 block truncate leading-tight">
                      {st.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Journal Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] uppercase font-metric tracking-wider text-amber-300 font-bold">
                Your Nightly Journal (Private with Allah)
              </label>
              <span className="text-[10px] font-metric text-emerald-300/60">
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </span>
            </div>

            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write honestly: what challenged you today, what sins or triggers did you evade, which prayers gave you sakinah, and what do you resolve for tomorrow?"
              rows={4}
              className="w-full bg-[#04160F] border border-amber-500/30 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-emerald-400/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 leading-relaxed resize-none shadow-inner"
            />
          </div>

          {/* Gratitude & Istighfar Note */}
          <div>
            <label className="block text-[11px] uppercase font-metric tracking-wider text-amber-300 font-bold mb-1">
              One Blessing or Dua Before Sleep (Shukr / Istighfar)
            </label>
            <input
              type="text"
              value={gratitudeNote}
              onChange={(e) => setGratitudeNote(e.target.value)}
              placeholder="e.g., Grateful for praying Asr in congregation; Astaghfirullah for moments of frustration."
              className="w-full bg-[#04160F] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-400/30 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Clean Day Log Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#061D14] border border-amber-500/25 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={cleanDayLogged}
              onChange={(e) => setCleanDayLogged(e.target.checked)}
              className="mt-0.5 rounded border-amber-500 text-emerald-600 focus:ring-0 accent-emerald-600 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                Seal Today as Clean in Taqwa Streak (+1 Day)
              </span>
              <span className="text-[10px] text-emerald-300/80 block leading-tight">
                Marks that you guarded your modesty and resisted digital triggers today.
              </span>
            </div>
          </label>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setDailyReflectionModalOpen(false)}
              className="w-1/3 py-2.5 px-3 rounded-xl bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/20 text-emerald-200 text-xs font-semibold font-metric transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold font-metric shadow-[0_4px_16px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{existingEntry ? 'Update Reflection' : 'Seal Tonight’s Muhasabah'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
