import React, { useState } from 'react';
import { Heart, X, Shield, ArrowLeft, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { DhikrTapCard } from './DhikrTapCard';

export const UrgentRescueModal: React.FC = () => {
  const { urgentRescueOpen, setUrgentRescueOpen, lastInterventionReason } = useSitrStore();
  const [duaToast, setDuaToast] = useState(false);

  if (!urgentRescueOpen) return null;

  const handleNeedDua = () => {
    setDuaToast(true);
    setTimeout(() => setDuaToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0714]/95 backdrop-blur-2xl flex flex-col overflow-y-auto">
      {/* Top Modal Navigation */}
      <div className="sticky top-0 z-10 bg-[#0B0714]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-purple-900/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUrgentRescueOpen(false)}
            aria-label="Go Back"
            className="w-10 h-10 rounded-full bg-[#170F26] text-purple-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Urgent Rescue Mode</h1>
            <span className="text-[10px] uppercase font-metric tracking-widest text-amber-400 font-semibold">
              SITR Protective Shield
            </span>
          </div>
        </div>

        <button
          onClick={() => setUrgentRescueOpen(false)}
          className="w-9 h-9 rounded-full bg-[#1E1433] text-purple-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col items-center gap-5 pb-16">
        {/* Intervention Tag */}
        <div className="flex items-center gap-2 bg-[#1E1433]/80 border border-purple-800/40 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300 font-bold">
            Shield Intervention Active
          </span>
        </div>

        {lastInterventionReason && (
          <p className="text-xs text-purple-300/80 bg-purple-950/40 border border-purple-800/30 px-3 py-1 rounded-lg">
            {lastInterventionReason}
          </p>
        )}

        {/* Empathy Hero Anchor */}
        <div className="flex flex-col items-center text-center gap-2 relative">
          <div className="relative flex items-center justify-center mb-1">
            <div className="absolute w-20 h-20 rounded-full bg-purple-600/30 blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#1E1433] via-[#2A1D45] to-[#120B1F] border border-purple-500/40 flex items-center justify-center shadow-[0_0_28px_rgba(124,58,237,0.35)]">
              <Heart className="w-7 h-7 text-rose-400 fill-rose-500/40 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl uppercase text-white font-extrabold tracking-tight font-sans">
            It's Okay, Bhai. Allah Sees You.
          </h2>
          <p className="text-sm text-purple-200/80 max-w-xs leading-relaxed">
            Take a breath. Step back from the brink. You are stronger than this whisper.
          </p>
        </div>

        {/* Primary Ease Ayah Card */}
        <div className="w-full bg-[#170F26] border border-purple-900/40 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-purple-600/10 blur-2xl pointer-events-none"></div>
          <span className="text-[10px] uppercase font-metric tracking-widest text-purple-300 font-bold mb-2">
            Allah says to you, right now —
          </span>
          <p className="font-arabic text-2xl sm:text-3xl text-white my-2 leading-loose font-bold select-text" dir="rtl">
            فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="text-sm italic text-purple-200/90 my-2 max-w-xs font-sans">
            “For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.”
          </p>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-purple-900/40 text-purple-300 text-[10px] font-metric font-semibold">
            — Quran 94:5-6
          </span>
        </div>

        {/* Redirection Dhikr Card */}
        <div className="w-full">
          <DhikrTapCard compact forcedType="astaghfirullah" />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => setUrgentRescueOpen(false)}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white font-semibold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(124,58,237,0.5)] active:scale-98 transition-all hover:brightness-110"
            type="button"
          >
            <Shield className="w-5 h-5" />
            <span>Exit to Safe App</span>
          </button>

          <button
            onClick={handleNeedDua}
            className="w-full py-3 px-4 rounded-full bg-[#1E1433] hover:bg-[#251940] border border-rose-900/30 text-rose-300 text-sm font-medium flex items-center justify-center gap-2 active:scale-98 transition-colors"
            type="button"
          >
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <span>Need Emergency Dua / Bhai Help</span>
          </button>
        </div>

        {/* Toast Notification */}
        {duaToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1E1433] border border-amber-500/40 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 max-w-[90vw] animate-in fade-in slide-in-from-bottom duration-200">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-medium text-amber-100">
              May Allah grant your heart sakinah and fortify your gaze, bhai. 🤲
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
