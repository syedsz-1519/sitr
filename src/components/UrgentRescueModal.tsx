import React, { useState } from 'react';
import { Heart, X, Shield, ArrowLeft, HeartHandshake, CheckCircle2, Wind } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { DhikrTapCard } from './DhikrTapCard';

export const UrgentRescueModal: React.FC = () => {
  const {
    urgentRescueOpen,
    setUrgentRescueOpen,
    lastInterventionReason,
    setBreathPauseModalOpen,
  } = useSitrStore();
  const [duaToast, setDuaToast] = useState(false);

  if (!urgentRescueOpen) return null;

  const handleNeedDua = () => {
    setDuaToast(true);
    setTimeout(() => setDuaToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#04140E]/95 backdrop-blur-2xl flex flex-col overflow-y-auto">
      {/* Top Modal Navigation */}
      <div className="sticky top-0 z-10 bg-[#04140E]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUrgentRescueOpen(false)}
            aria-label="Go Back"
            className="w-10 h-10 rounded-full bg-[#061D14] text-amber-300 hover:text-white flex items-center justify-center transition-colors border border-amber-500/20 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-amber-50 leading-tight">Urgent Rescue Mode</h1>
            <span className="text-[10px] uppercase font-metric tracking-widest text-amber-400 font-semibold">
              SITR Protective Shield
            </span>
          </div>
        </div>

        <button
          onClick={() => setUrgentRescueOpen(false)}
          className="w-9 h-9 rounded-full bg-[#061D14] text-amber-300 hover:text-white flex items-center justify-center transition-colors border border-amber-500/20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col items-center gap-5 pb-16">
        {/* Intervention Tag */}
        <div className="flex items-center gap-2 bg-[#061D14] border border-amber-500/30 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300 font-bold">
            Shield Intervention Active
          </span>
        </div>

        {lastInterventionReason && (
          <p className="text-xs text-emerald-200/90 bg-[#041E14] border border-amber-500/25 px-3 py-1 rounded-lg">
            {lastInterventionReason}
          </p>
        )}

        {/* Empathy Hero Anchor */}
        <div className="flex flex-col items-center text-center gap-2 relative">
          <div className="relative flex items-center justify-center mb-1">
            <div className="absolute w-20 h-20 rounded-full bg-emerald-600/30 blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#08261A] via-[#0D3827] to-[#04140E] border border-amber-400/40 flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.35)]">
              <Heart className="w-7 h-7 text-rose-400 fill-rose-500/40 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl uppercase text-amber-50 font-extrabold tracking-tight font-sans">
            It's Okay, Bhai. Allah Sees You.
          </h2>
          <p className="text-sm text-emerald-200/80 max-w-xs leading-relaxed">
            Take a breath. Step back from the brink. You are stronger than this whisper.
          </p>
        </div>

        {/* Primary Ease Ayah Card */}
        <div className="w-full bg-[#061D14] border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-600/10 blur-2xl pointer-events-none"></div>
          <span className="text-[10px] uppercase font-metric tracking-widest text-amber-400 font-bold mb-2">
            Allah says to you, right now —
          </span>
          <p className="font-arabic text-2xl sm:text-3xl text-amber-50 my-2 leading-loose font-bold select-text" dir="rtl">
            فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="text-sm italic text-emerald-100 my-2 max-w-xs font-sans">
            “For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.”
          </p>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#04160F] text-amber-300 border border-amber-500/25 text-[10px] font-metric font-semibold">
            — Quran 94:5-6
          </span>
        </div>

        {/* 30s Dhikr Breath Pause Redirection Option */}
        <button
          onClick={() => {
            setUrgentRescueOpen(false);
            setBreathPauseModalOpen(true);
          }}
          type="button"
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#0B3322] via-[#07261A] to-[#0B3322] border border-amber-500/40 text-amber-200 hover:text-white flex items-center justify-between shadow-md cursor-pointer transition-all hover:border-amber-400"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Wind className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100 font-metric block">
                Take 30s Dhikr Breath Pause
              </span>
              <span className="text-[10px] text-emerald-200/80">
                Calm nervous system & reset dopamine rush
              </span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-metric font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
            Start 30s
          </span>
        </button>

        {/* Redirection Dhikr Card */}
        <div className="w-full">
          <DhikrTapCard compact forcedType="astaghfirullah" />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => setUrgentRescueOpen(false)}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white font-semibold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.5)] active:scale-98 transition-all hover:brightness-110 cursor-pointer"
            type="button"
          >
            <Shield className="w-5 h-5 text-amber-300" />
            <span>Exit to Safe App</span>
          </button>

          <button
            onClick={handleNeedDua}
            className="w-full py-3 px-4 rounded-full bg-[#061D14] hover:bg-[#0B3322] border border-amber-500/25 text-amber-200 text-sm font-medium flex items-center justify-center gap-2 active:scale-98 transition-colors cursor-pointer"
            type="button"
          >
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Need Emergency Dua / Bhai Help</span>
          </button>
        </div>

        {/* Toast Notification */}
        {duaToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#08261A] border border-amber-500/40 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 max-w-[90vw] animate-in fade-in slide-in-from-bottom duration-200">
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
