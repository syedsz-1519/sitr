import React from 'react';
import {
  BookOpen,
  Moon,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  PenTool,
  Heart,
  Quote,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { getDailyPrompt } from '../data/dailyReflections';
import { ExtendedView } from '../types';

interface DailyReflectionCardProps {
  onNavigate?: (view: ExtendedView) => void;
}

export const DailyReflectionCard: React.FC<DailyReflectionCardProps> = ({ onNavigate }) => {
  const { setDailyReflectionModalOpen, getTodayReflection, dailyReflections } = useSitrStore();
  const todayEntry = getTodayReflection();
  const todayPrompt = getDailyPrompt();

  const handleOpen = () => {
    setDailyReflectionModalOpen(true);
  };

  const handleOpenFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('daily_reflection');
    } else {
      setDailyReflectionModalOpen(true);
    }
  };

  return (
    <div
      onClick={handleOpen}
      className="relative rounded-3xl bg-gradient-to-br from-[#1E113A] via-[#140A28] to-[#0D051C] border border-purple-600/40 hover:border-purple-400/60 p-5 shadow-[0_8px_30px_rgba(124,58,237,0.18)] transition-all cursor-pointer group overflow-hidden"
    >
      {/* Luminous atmospheric night glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#281452] border border-purple-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform">
            <Moon className="w-4 h-4 fill-amber-400/30" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-metric">
                Daily Reflection & Muhasabah
              </h3>
              <span className="text-[9px] bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/50 font-metric font-semibold">
                End of Day
              </span>
            </div>
            <span className="text-[10px] text-purple-300/80 font-metric">
              Self-reckoning before peaceful sleep
            </span>
          </div>
        </div>

        {/* Status Pill */}
        {todayEntry ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-metric font-bold shadow-sm shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>Journaled</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-metric font-bold shadow-sm shrink-0 animate-pulse">
            <PenTool className="w-3 h-3" />
            <span>Pending Tonight</span>
          </span>
        )}
      </div>

      {/* Islamic Quote Highlight Box */}
      <div className="relative rounded-2xl bg-[#130926]/90 border border-purple-800/40 p-3.5 mb-3.5 text-left z-10">
        <Quote className="w-4 h-4 text-purple-400/40 absolute top-3 right-3 pointer-events-none" />

        {todayPrompt.quote.arabic && (
          <p className="text-xs text-amber-200/90 font-serif leading-relaxed mb-1.5 text-right font-arabic">
            {todayPrompt.quote.arabic}
          </p>
        )}

        <p className="text-xs text-purple-100 italic leading-relaxed line-clamp-2">
          “{todayPrompt.quote.text}”
        </p>

        <span className="block text-[10px] text-purple-300/70 font-metric mt-1 font-medium">
          — {todayPrompt.quote.source}
        </span>
      </div>

      {/* The Question Prompt */}
      <div className="relative z-10 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-white leading-snug">
            {todayPrompt.question}
          </p>
        </div>

        {todayEntry && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-[#1B0F33] border border-purple-800/30 text-[11px] text-purple-200/90 line-clamp-2 italic">
            "{todayEntry.journalText}"
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-purple-900/40 relative z-10">
        <div className="flex items-center gap-2 text-[10px] text-purple-300/80 font-metric">
          <Clock className="w-3 h-3 text-purple-400" />
          <span>{dailyReflections.length} reflections recorded</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenFull}
            className="text-[10px] font-metric font-semibold text-purple-300 hover:text-white px-2 py-1 rounded-lg hover:bg-purple-900/40 transition-colors"
          >
            Archive & Prompts
          </button>

          <span className="inline-flex items-center gap-1 text-xs font-metric font-bold text-white bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded-xl shadow-[0_2px_10px_rgba(124,58,237,0.4)] transition-all">
            <span>{todayEntry ? 'Edit Journal' : 'Reflect Now'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
