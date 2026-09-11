import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Settings,
  Sparkles,
  Play,
  Volume2,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { getDailyScheduledReminder } from '../data/taqwaReminders';

interface DailyNotificationSchedulerCardProps {
  compact?: boolean;
}

export const DailyNotificationSchedulerCard: React.FC<DailyNotificationSchedulerCardProps> = ({
  compact = false,
}) => {
  const {
    dailyReminderConfig,
    updateDailyReminderConfig,
    setReminderSchedulerModalOpen,
    triggerScheduledReminder,
  } = useSitrStore();

  const [tested, setTested] = useState(false);

  const formatTime12h = (time24: string) => {
    const [hStr, mStr] = time24.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return time24;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const handleQuickTest = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTested(true);
    triggerScheduledReminder();
    setTimeout(() => setTested(false), 2000);
  };

  const todayReminder = getDailyScheduledReminder(dailyReminderConfig.contentType);

  if (compact) {
    return (
      <div
        onClick={() => setReminderSchedulerModalOpen(true)}
        className="cursor-pointer rounded-2xl bg-[#082318] hover:bg-[#0C3323] border border-amber-500/30 p-3.5 flex items-center justify-between gap-3 transition-all group shadow-sm shadow-emerald-950/40"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-50">Daily Taqwa Reminder</span>
              <span className="text-[10px] font-metric font-semibold text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                {formatTime12h(dailyReminderConfig.time)}
              </span>
            </div>
            <span className="text-[10px] text-emerald-200/70 block truncate max-w-[200px] sm:max-w-xs">
              {todayReminder.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleQuickTest}
            className="px-2 py-1 rounded-lg bg-[#04160F] text-amber-300 text-[10px] font-metric border border-amber-500/30 hover:bg-[#0D3827] transition-colors"
            title="Test reminder"
          >
            {tested ? 'Fired!' : 'Test'}
          </button>
          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-200 transition-colors" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0D3827] via-[#082318] to-[#04140E] border border-amber-500/35 p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-amber-50">Daily Taqwa Scheduler</h2>
              <span
                className={`text-[9px] font-metric font-bold px-2 py-0.5 rounded-full uppercase border ${
                  dailyReminderConfig.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {dailyReminderConfig.enabled ? 'Scheduled' : 'Paused'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5">
              Automated daily prompt to recalibrate intention and guard the soul
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            updateDailyReminderConfig({ enabled: !dailyReminderConfig.enabled })
          }
          className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 mt-1 ${
            dailyReminderConfig.enabled ? 'bg-amber-500' : 'bg-zinc-800'
          }`}
          title={dailyReminderConfig.enabled ? 'Pause daily reminder' : 'Enable daily reminder'}
        >
          <span
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
              dailyReminderConfig.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Scheduled Time & Settings Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="p-3 rounded-2xl bg-[#061D14] border border-amber-500/20">
          <span className="text-[10px] uppercase font-metric text-amber-300 font-semibold block">
            Trigger Time
          </span>
          <span className="text-base font-bold font-metric text-amber-300 mt-0.5 block">
            {formatTime12h(dailyReminderConfig.time)}
          </span>
          <span className="text-[10px] text-emerald-300/70 font-metric">Daily recurrence</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#061D14] border border-amber-500/20">
          <span className="text-[10px] uppercase font-metric text-amber-300 font-semibold block">
            Prompt Type
          </span>
          <span className="text-xs font-bold text-amber-100 mt-1 block capitalize truncate">
            {dailyReminderConfig.contentType === 'both'
              ? 'Taqwa & Quran'
              : dailyReminderConfig.contentType === 'quran'
              ? 'Quranic Prompts'
              : 'Taqwa Wisdoms'}
          </span>
          <span className="text-[10px] text-emerald-300/70 font-metric">Curated series</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#061D14] border border-amber-500/20 col-span-2 sm:col-span-1 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-metric text-amber-300 font-semibold block">
            Audio Alert
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Volume2
              className={`w-3.5 h-3.5 ${
                dailyReminderConfig.soundEnabled ? 'text-amber-400' : 'text-zinc-500'
              }`}
            />
            <span className="text-xs font-bold text-emerald-200">
              {dailyReminderConfig.soundEnabled ? 'Two-Tone Chime' : 'Muted'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-300/70 font-metric">Harmonic pulse</span>
        </div>
      </div>

      {/* Featured Today's Snippet */}
      <div className="p-3.5 rounded-2xl bg-[#04160F] border border-amber-500/30 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-emerald-300/80 font-metric">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Today's Selected Reminder:</span>
          </span>
          <span className="text-amber-300/90 font-medium">{todayReminder.source}</span>
        </div>
        <p className="text-xs text-amber-50 italic leading-relaxed font-serif truncate">
          “{todayReminder.text}”
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <button
          type="button"
          onClick={handleQuickTest}
          className="px-3.5 py-2 rounded-xl bg-[#061D14] hover:bg-[#0E3525] text-amber-200 hover:text-white border border-amber-500/30 text-xs font-metric font-semibold flex items-center gap-2 transition-colors"
        >
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span>{tested ? 'Reminder Triggered!' : 'Send Test Reminder'}</span>
        </button>

        <button
          type="button"
          onClick={() => setReminderSchedulerModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-metric font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configure Time</span>
        </button>
      </div>
    </div>
  );
};
