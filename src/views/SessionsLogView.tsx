import React from 'react';
import { ShieldAlert, Play, CheckCircle2, Smartphone, Globe, Tag, Clock } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const SessionsLogView: React.FC = () => {
  const { events, simulateBlockPrompt, rules } = useSitrStore();

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-amber-50">Sessions Log & Firewall</h1>
        </div>
        <p className="text-xs text-emerald-200/80 mt-0.5">
          Realtime audit of blocked apps, prevented triggers, and redirected impulses.
        </p>
      </div>

      {/* Action Banner */}
      <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-amber-50 block">Test Interception Engine</span>
          <span className="text-[10px] text-emerald-200/70 font-metric">
            Fires mock background intercept screen
          </span>
        </div>

        <button
          onClick={() => simulateBlockPrompt()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold uppercase font-metric tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Simulate</span>
        </button>
      </div>

      {/* Firewall Events List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
            Blocked Events Today ({events.length})
          </span>
          <span className="text-[10px] text-emerald-400 font-metric font-semibold">
            100% Intercept Rate
          </span>
        </div>

        <div className="space-y-2">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-2xl bg-[#061D14] border border-amber-500/25 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#08261A] border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  {ev.type === 'app' ? (
                    <Smartphone className="w-4 h-4 text-amber-400" />
                  ) : ev.type === 'website' ? (
                    <Globe className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Tag className="w-4 h-4 text-amber-300" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate block">
                      {ev.label}
                    </span>
                    <span className="text-[9px] uppercase font-metric font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/40">
                      BLOCKED
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-200/60 truncate block font-metric">
                    {ev.target} • {ev.simulated ? 'Simulated test' : 'Live shield'}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-amber-300 font-metric block">
                  {formatTimestamp(ev.blockedAt)}
                </span>
                <span className="text-[10px] text-emerald-300/70 font-metric">
                  +10m saved
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#061D14] border border-amber-500/35 text-center space-y-1.5">
        <p className="font-arabic text-xl text-amber-50 font-bold leading-loose" dir="rtl">
          أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَىٰ
        </p>
        <p className="text-xs text-emerald-200 italic font-sans">
          “Does he not know that Allah sees?”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah Al-Alaq (Quran 96:14)
        </span>
      </div>
    </div>
  );
};
