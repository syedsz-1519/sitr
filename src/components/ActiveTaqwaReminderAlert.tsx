import React from 'react';
import { Sparkles, X, BookOpen, Heart, BellRing, ArrowRight } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { ExtendedView } from '../types';

interface ActiveTaqwaReminderAlertProps {
  onNavigate?: (view: ExtendedView) => void;
}

export const ActiveTaqwaReminderAlert: React.FC<ActiveTaqwaReminderAlertProps> = ({ onNavigate }) => {
  const {
    activeTaqwaReminder,
    dismissTaqwaReminder,
    setDailyReflectionModalOpen,
  } = useSitrStore();

  if (!activeTaqwaReminder) return null;

  const handleOpenReflection = () => {
    dismissTaqwaReminder();
    setDailyReflectionModalOpen(true);
    if (onNavigate) {
      onNavigate('daily_reflection');
    }
  };

  const handleOpenDhikr = () => {
    dismissTaqwaReminder();
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0D3827] via-[#082318] to-[#04140E] border border-amber-500/40 p-6 sm:p-7 shadow-2xl shadow-emerald-950/80 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 font-metric uppercase tracking-wider">
                  Daily Scheduled Reminder
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#082318] text-amber-200 border border-amber-500/30 capitalize">
                  {activeTaqwaReminder.type === 'quran' ? 'Quranic Prompt' : 'Taqwa Inspiration'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-amber-50 mt-0.5">
                {activeTaqwaReminder.title}
              </h3>
            </div>
          </div>

          <button
            onClick={dismissTaqwaReminder}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-300 hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-4">
          {/* Arabic Text if available */}
          {activeTaqwaReminder.arabic && (
            <div className="p-4 rounded-2xl bg-[#04160F] border border-amber-500/30 text-center">
              <p className="font-arabic text-2xl text-amber-300 font-bold leading-loose drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" dir="rtl">
                {activeTaqwaReminder.arabic}
              </p>
            </div>
          )}

          {/* English translation / wisdom */}
          <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/20 space-y-2">
            <p className="text-sm text-amber-50 font-serif leading-relaxed italic">
              “{activeTaqwaReminder.text}”
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-amber-500/15 text-[11px] text-emerald-200/80 font-metric">
              <span className="font-medium text-amber-300/90">{activeTaqwaReminder.source}</span>
              {activeTaqwaReminder.category && (
                <span className="text-[10px] text-amber-300 bg-[#04160F] px-2 py-0.5 rounded-md border border-amber-500/20">
                  {activeTaqwaReminder.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleOpenReflection}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-black font-extrabold text-xs font-metric transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-black" />
            <span>Open Reflection Journal</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>

          <button
            onClick={handleOpenDhikr}
            className="py-3 px-4 rounded-xl bg-[#0B3322] hover:bg-[#10452F] text-amber-200 hover:text-white text-xs font-semibold font-metric transition-colors border border-amber-500/30 flex items-center justify-center gap-2"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Engage Dhikr</span>
          </button>

          <button
            onClick={dismissTaqwaReminder}
            className="py-3 px-4 rounded-xl bg-transparent hover:bg-white/5 text-emerald-300 hover:text-white text-xs font-metric transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
