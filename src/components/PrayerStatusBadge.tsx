import React, { useState } from 'react';
import { Moon, Sparkles, Clock, RefreshCw, X, ChevronDown, Check } from 'lucide-react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

export const PrayerStatusBadge: React.FC = () => {
  const { upcomingPrayer, timings, cityLabel, hijriDate, isLoading, refreshPrayerTimes } =
    usePrayerTimes();
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <>
      {/* Midnight Mosque Status Badge */}
      <button
        onClick={() => setShowScheduleModal(true)}
        type="button"
        title="View Today's Prayer Schedule"
        className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#170C2E] via-[#1C0F38] to-[#120824] border border-amber-500/35 hover:border-amber-400/60 shadow-[0_2px_12px_rgba(245,158,11,0.12)] transition-all cursor-pointer text-left"
      >
        {/* Subtle crescent minaret glow aura */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-purple-600/20 rounded-full blur-xs opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Icon with moon glow */}
        <div className="relative w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
          <Moon className="w-2.5 h-2.5 fill-amber-300/40 text-amber-300" />
        </div>

        {/* Prayer Name & Countdown */}
        <div className="relative z-10 flex items-baseline gap-1.5">
          <span className="text-[10px] font-metric font-bold uppercase tracking-wider text-amber-300">
            {upcomingPrayer.name}
          </span>
          <span className="text-[10px] font-arabic text-amber-200/90 hidden sm:inline" dir="rtl">
            {upcomingPrayer.arabicName}
          </span>
          <span className="text-[9px] text-purple-200/70 font-metric font-mono">
            {upcomingPrayer.formattedTime}
          </span>
          <span
            className={`text-[9px] font-metric font-semibold px-1.5 py-0.2 rounded-full border ${
              upcomingPrayer.isApproachingSoon
                ? 'bg-amber-500/25 text-amber-300 border-amber-400/60 animate-pulse'
                : 'bg-purple-900/60 text-purple-200/90 border-purple-700/50'
            }`}
          >
            {upcomingPrayer.countdown}
          </span>
          <ChevronDown className="w-3 h-3 text-amber-400/60 group-hover:text-amber-300 transition-colors" />
        </div>
      </button>

      {/* Midnight Mosque Full Schedule Dropdown / Dialog */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1E1138] via-[#140A28] to-[#0D051C] border border-amber-500/40 p-5 shadow-2xl relative overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Mosque Sky Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between relative z-10 mb-3 border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                  <Moon className="w-4 h-4 fill-amber-300/30" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                    <span>Midnight Mosque Prayer Times</span>
                  </h3>
                  <p className="text-[10px] text-amber-300/80 font-metric">
                    {hijriDate || cityLabel} • Aladhan Network
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                type="button"
                className="w-7 h-7 rounded-full bg-purple-950/60 hover:bg-purple-900 text-purple-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Next Prayer Highlight Hero */}
            <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/50 to-purple-950/60 border border-amber-500/30 relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-metric tracking-widest text-amber-400 font-bold block">
                  Next Congregation
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-white font-metric">
                    {upcomingPrayer.name}
                  </span>
                  <span className="text-xs font-arabic text-amber-200">
                    {upcomingPrayer.arabicName}
                  </span>
                </div>
                <span className="text-xs text-purple-200/80 font-metric mt-0.5 block">
                  {upcomingPrayer.formattedTime} ({upcomingPrayer.countdown})
                </span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-metric font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  {upcomingPrayer.isApproachingSoon ? 'Prepare Wudu' : 'Scheduled'}
                </span>
              </div>
            </div>

            {/* List of 5 daily prayers */}
            <div className="space-y-1.5 relative z-10">
              {(
                [
                  { name: 'Fajr', ar: 'الفَجْر' },
                  { name: 'Sunrise', ar: 'الشُّرُوق' },
                  { name: 'Dhuhr', ar: 'الظُّهْر' },
                  { name: 'Asr', ar: 'العَصْر' },
                  { name: 'Maghrib', ar: 'المَغْرِب' },
                  { name: 'Isha', ar: 'العِشَاء' },
                ] as const
              ).map((p) => {
                const isNext = upcomingPrayer.name === p.name;
                const time = timings[p.name] || '--:--';
                return (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                      isNext
                        ? 'bg-amber-500/20 border border-amber-400/50 text-white shadow-sm'
                        : 'bg-[#120822] border border-purple-900/30 text-purple-200/80 hover:text-purple-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          isNext ? 'text-amber-400' : 'text-purple-400/60'
                        }`}
                      />
                      <span className="text-xs font-metric font-semibold">{p.name}</span>
                      <span className="text-[11px] font-arabic text-purple-300/70">{p.ar}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={isNext ? 'text-amber-300 font-bold' : 'text-purple-200'}>
                        {time}
                      </span>
                      {isNext && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Refresh Footer */}
            <div className="mt-4 pt-3 border-t border-purple-900/40 flex items-center justify-between text-[10px] text-purple-300/70 font-metric relative z-10">
              <span>Timezone: {cityLabel}</span>
              <button
                onClick={() => refreshPrayerTimes()}
                disabled={isLoading}
                type="button"
                className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
