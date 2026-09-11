import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  Shield,
  Award,
  CheckCircle2,
  Copy,
  Share2,
  TrendingUp,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const WeeklyReportView: React.FC = () => {
  const { currentStreak, userName, partnerName, events, dhikrSessionsCompletedToday } = useSitrStore();
  const [copied, setCopied] = useState(false);

  // 7 days breakdown (Mon..Sun)
  const weekDays = [
    { label: 'M', guarded: true, blocks: 1 },
    { label: 'T', guarded: true, blocks: 0 },
    { label: 'W', guarded: true, blocks: 1 },
    { label: 'T', guarded: true, blocks: 2 },
    { label: 'F', guarded: true, blocks: 0 },
    { label: 'S', guarded: true, blocks: 2 },
    { label: 'S', guarded: false, blocks: 3 },
  ];

  const blocksCount = events.length;
  const timeSavedMinutes = blocksCount * 15; // Average 15 mins saved per block

  const reportCardText = `🛡️ SITR GUARDIAN WEEKLY REPORT 🛡️
Accountability Partner: ${partnerName}
Striver: ${userName}
----------------------------------------
✨ Nafs Score: 64 / 100 (+14% vs last week)
🔥 Taqwa Streak: ${currentStreak} Clean Days
🔒 Temptations Intercepted: ${blocksCount}
⏳ Time Reclaimed for Akhirah: ${timeSavedMinutes} mins
📿 Dhikr Sets Completed: ${dhikrSessionsCompletedToday}
----------------------------------------
"And that there is not for man except that for which he strives."
— Surah An-Najm (Quran 53:39)
Guard Your Gaze • Powered by SITR سِتْر`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportCardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareReport = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'SITR Weekly Taqwa Report',
          text: reportCardText,
        })
        .catch(() => {});
    } else {
      handleCopyReport();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-amber-50">Weekly Report</h1>
        </div>
        <p className="text-xs text-emerald-200/80 mt-0.5">
          7-day review of nafs discipline, temptations blocked, and time reclaimed.
        </p>
      </div>

      {/* Top Hero Gradient Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B3825] via-[#062417] to-[#04160E] border border-amber-500/35 p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300 font-bold">
            SITR • Weekly Report
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-2">
          <span className="font-metric text-5xl font-extrabold text-white leading-none">
            64
          </span>
          <span className="text-xs text-emerald-300 font-metric">/ 100</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold font-metric">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+14% vs yesterday</span>
        </div>
      </div>

      {/* 7-Day Consistency Rhythm Strip */}
      <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
            7-Day Consistency Rhythm
          </span>
          <span className="text-[10px] text-emerald-400 font-metric font-semibold">
            6 of 7 days guarded
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-metric text-emerald-200/70 font-semibold">
                {day.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  day.guarded
                    ? 'bg-[#08261A] border-amber-500/40 text-emerald-400 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-[#04160E] border-amber-500/20 text-zinc-500'
                }`}
              >
                {day.guarded ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-xs font-bold text-zinc-600">•</span>
                )}
              </div>
              <span className="text-[9px] text-emerald-300/70 font-metric">
                {day.blocks > 0 ? `${day.blocks} blk` : 'clean'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2x2 Metric Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/25 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-metric text-emerald-200/70">
            Total Blocks
          </span>
          <div className="my-1">
            <span className="font-metric text-2xl font-bold text-white leading-none">
              {blocksCount}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-metric font-medium">
            Shield held strong
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/25 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-metric text-emerald-200/70">
            Time Reclaimed
          </span>
          <div className="my-1">
            <span className="font-metric text-2xl font-bold text-amber-400 leading-none">
              {timeSavedMinutes}m
            </span>
          </div>
          <span className="text-[10px] text-emerald-300/80 font-metric font-medium">
            Redirected to life
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/25 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-metric text-emerald-200/70">
            Dhikr Sessions
          </span>
          <div className="my-1">
            <span className="font-metric text-2xl font-bold text-white leading-none">
              {dhikrSessionsCompletedToday}
            </span>
          </div>
          <span className="text-[10px] text-emerald-300 font-metric font-medium">
            Taps of sakinah
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/25 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-metric text-emerald-200/70">
            Active Guard
          </span>
          <div className="my-1">
            <span className="font-metric text-2xl font-bold text-emerald-400 leading-none">
              6/7
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-metric font-medium">
            85% Weekly Shield
          </span>
        </div>
      </div>

      {/* Shareable Report Card */}
      <div className="rounded-2xl bg-[#061D14] border border-amber-500/35 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
              Shareable Weekly Report Card
            </h2>
          </div>
          <span className="text-[10px] text-emerald-300 font-metric uppercase">
            Receipt Style
          </span>
        </div>

        {/* Pre-formatted receipt preview */}
        <pre className="p-3.5 rounded-xl bg-[#04160E] border border-amber-500/20 text-[11px] font-mono text-emerald-100 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
          {reportCardText}
        </pre>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Report'}</span>
          </button>

          <button
            onClick={handleShareReport}
            className="py-2.5 px-4 rounded-xl bg-[#08261A] hover:bg-[#0B3322] border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            type="button"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#061D14] border border-amber-500/35 text-center space-y-1.5">
        <p className="font-arabic text-xl text-amber-50 font-bold leading-loose" dir="rtl">
          وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ
        </p>
        <p className="text-xs text-emerald-200 italic font-sans">
          “And that there is not for man except that [good] for which he strives.”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah An-Najm (Quran 53:39)
        </span>
      </div>
    </div>
  );
};
