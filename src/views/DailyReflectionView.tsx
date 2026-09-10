import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  Plus,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { REFLECTION_PROMPTS, getDailyPrompt } from '../data/dailyReflections';
import { SpiritualState, ReflectionPrompt, DailyReflectionEntry } from '../types';

export const DailyReflectionView: React.FC = () => {
  const {
    dailyReflections,
    getTodayReflection,
    setDailyReflectionModalOpen,
    deleteDailyReflection,
    saveDailyReflection,
  } = useSitrStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = getTodayReflection();
  const todayPrompt = getDailyPrompt();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePrompt, setActivePrompt] = useState<ReflectionPrompt>(todayPrompt);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(todayEntry?.id || null);

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
        return { label: 'Mutma’innah', icon: '🕊️', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'tested':
        return { label: 'Tested & Patient', icon: '⏳', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'repentant':
        return { label: 'In Tawbah', icon: '🤲', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'striving':
        return { label: 'Mujahadah', icon: '⚡', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      default:
        return { label: state, icon: '✨', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
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
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#241344] via-[#160A2D] to-[#0D041C] border border-purple-600/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 font-metric">
                Muhasabah Sanctuary
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Daily Reflection
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-sm">
              Pause before sleep. Audit your heart, confess your struggles to Allah, and wake up unburdened.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#281350] border border-purple-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] shrink-0">
            <Moon className="w-6 h-6 fill-amber-400/40" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-purple-800/40 relative z-10">
          <div className="bg-[#120722]/80 border border-purple-900/40 rounded-2xl p-2.5 text-center">
            <span className="text-base sm:text-lg font-bold text-white block font-metric">
              {dailyReflections.length}
            </span>
            <span className="text-[10px] text-purple-300/70 uppercase tracking-wider font-metric block">
              Reflections
            </span>
          </div>

          <div className="bg-[#120722]/80 border border-purple-900/40 rounded-2xl p-2.5 text-center">
            <span className="text-base sm:text-lg font-bold text-emerald-400 block font-metric">
              {dailyReflections.filter((r) => r.cleanDayLogged).length}
            </span>
            <span className="text-[10px] text-purple-300/70 uppercase tracking-wider font-metric block">
              Clean Sealed
            </span>
          </div>

          <div className="bg-[#120722]/80 border border-purple-900/40 rounded-2xl p-2.5 text-center">
            <span className="text-base sm:text-lg font-bold text-amber-400 block font-metric">
              {todayEntry ? 'Completed' : 'Pending'}
            </span>
            <span className="text-[10px] text-purple-300/70 uppercase tracking-wider font-metric block">
              Tonight's State
            </span>
          </div>
        </div>
      </div>

      {/* 2. Today's Featured Reflection Card */}
      <div className="rounded-3xl bg-[#170C2E] border border-purple-700/50 p-5 shadow-lg relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-metric">
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
        <div className="rounded-2xl bg-[#100720] border border-purple-900/50 p-4 mb-4">
          {activePrompt.quote.arabic && (
            <p className="text-sm sm:text-base text-amber-200/90 font-serif leading-relaxed mb-2 text-right font-arabic">
              {activePrompt.quote.arabic}
            </p>
          )}
          <p className="text-xs sm:text-sm text-purple-100 italic leading-relaxed">
            “{activePrompt.quote.text}”
          </p>
          <span className="block text-[11px] text-purple-300/70 font-metric mt-1.5 font-medium">
            — {activePrompt.quote.source}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-1 mb-4">
          <h3 className="text-sm font-bold text-white leading-snug">
            {activePrompt.question}
          </h3>
          {activePrompt.subtext && (
            <p className="text-xs text-purple-200/70 leading-relaxed">
              {activePrompt.subtext}
            </p>
          )}
        </div>

        {/* Trigger Journal Button */}
        <button
          onClick={() => setDailyReflectionModalOpen(true)}
          type="button"
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider font-metric flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-all active:scale-[0.98]"
        >
          <PenTool className="w-4 h-4" />
          <span>{todayEntry ? 'Edit Tonight’s Reflection' : 'Open Reflection Journal'}</span>
        </button>
      </div>

      {/* 3. Prompt Sanctuary / Theme Explorer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white font-metric">
              Explore Islamic Prompts ({REFLECTION_PROMPTS.length})
            </h2>
          </div>
          <span className="text-[10px] text-purple-300/70 font-metric">
            Tap to select as tonight's focus
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-metric font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#150A26] border border-purple-900/40 text-purple-300/70 hover:text-white'
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
                  ? 'bg-[#221240] border-purple-500/70 shadow-md'
                  : 'bg-[#140A24] border-purple-900/30 hover:border-purple-700/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[9px] uppercase font-metric tracking-widest text-amber-300/90 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {prompt.quote.category}
                </span>
                <span className="text-[10px] text-purple-300/60 font-metric">
                  {prompt.quote.source.split('•')[0]}
                </span>
              </div>
              <p className="text-xs font-semibold text-white group-hover:text-purple-200 transition-colors leading-snug">
                {prompt.question}
              </p>
              <p className="text-[11px] text-purple-300/70 italic mt-1 line-clamp-1">
                “{prompt.quote.text}”
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Journal Archive & Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white font-metric">
              Journal Timeline ({dailyReflections.length})
            </h2>
          </div>
          <span className="text-[10px] text-purple-300/70 font-metric">
            Private Muhasabah records
          </span>
        </div>

        {dailyReflections.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#140A24] border border-purple-900/30 text-center space-y-2">
            <Moon className="w-8 h-8 text-purple-400/40 mx-auto" />
            <p className="text-xs text-purple-200 font-semibold">No reflections recorded yet</p>
            <p className="text-[11px] text-purple-300/60">
              Start your first nightly audit today to build a mindful, repentant heart before sleep.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyReflections.map((entry) => {
              const stateBadge = getSpiritualStateBadge(entry.spiritualState);
              const isExpanded = expandedEntryId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="rounded-2xl bg-[#160B29] border border-purple-900/40 p-4 transition-all hover:border-purple-700/50"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl select-none">{stateBadge.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {formatDate(entry.date)}
                          </span>
                          {entry.date === todayStr && (
                            <span className="text-[9px] bg-purple-600 text-white font-metric uppercase font-bold px-1.5 rounded">
                              Today
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-metric font-semibold px-2 py-0.5 rounded-full border ${stateBadge.color}`}
                          >
                            {stateBadge.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-purple-300/60 font-metric">
                          {entry.cleanDayLogged ? '✓ Clean Day Logged' : 'Day of Striving'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDailyReflection(entry.id);
                        }}
                        className="text-purple-400/40 hover:text-rose-400 p-1 transition-colors"
                        title="Delete reflection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-purple-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-purple-300" />
                      )}
                    </div>
                  </div>

                  {/* Snippet / Expanded Details */}
                  <div className="mt-2.5 pt-2.5 border-t border-purple-900/30">
                    <p className="text-xs text-purple-200/90 leading-relaxed font-sans">
                      {isExpanded ? entry.journalText : (
                        <span className="line-clamp-2">{entry.journalText}</span>
                      )}
                    </p>

                    {isExpanded && (
                      <div className="mt-3 space-y-2.5 pt-2 border-t border-purple-900/30">
                        {/* Prompt Quote & Question */}
                        <div className="p-2.5 rounded-xl bg-[#0F071D] border border-purple-900/50 text-[11px]">
                          <p className="font-semibold text-purple-200 mb-1">
                            Q: {entry.promptQuestion}
                          </p>
                          <p className="text-purple-300/70 italic line-clamp-2">
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
