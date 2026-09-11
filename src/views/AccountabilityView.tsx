import React, { useState } from 'react';
import { Users, Shield, Copy, Share2, CheckCircle2, UserCheck, HeartHandshake } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const AccountabilityView: React.FC = () => {
  const { partnerName, setPartnerName, userName, setUserName, currentStreak, events, dhikrSessionsCompletedToday } = useSitrStore();
  const [copied, setCopied] = useState(false);
  const [partnerInput, setPartnerInput] = useState(partnerName);
  const [isEditing, setIsEditing] = useState(false);

  const blocksCount = events.length;
  const timeSaved = blocksCount * 15;

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerInput.trim()) {
      setPartnerName(partnerInput.trim());
      setIsEditing(false);
    }
  };

  const reportCardText = `🛡️ SITR ACCOUNTABILITY CHECK-IN 🛡️
As-salamu Alaykum, ${partnerName}.
Here is my digital wellbeing report from SITR (Guard Your Gaze):

• Clean Streak: ${currentStreak} day(s) clean
• Nafs Score: 64 / 100
• Temptations Intercepted: ${blocksCount}
• Dhikr Sessions Completed: ${dhikrSessionsCompletedToday}
• Time Reclaimed for Akhirah: ${timeSaved} mins

"And advised each other to truth and advised each other to patience." (Quran 103:3)
Keep me in your duas, brother!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportCardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'SITR Accountability Check-in', text: reportCardText }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-amber-50">Accountability Partner</h1>
        </div>
        <p className="text-xs text-emerald-200/80 mt-0.5">
          Share your weekly score with your accountability partner. True brotherhood guards each other's gaze.
        </p>
      </div>

      {/* Partner Profile Card */}
      <div className="rounded-2xl bg-[#061D14] border border-amber-500/30 p-5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#08261A] border border-amber-500/40 flex items-center justify-center text-amber-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300/80 block">
                Designated Partner
              </span>
              <h2 className="text-base font-bold text-amber-50">{partnerName}</h2>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-amber-400 hover:text-amber-200 font-semibold transition-colors cursor-pointer"
          >
            {isEditing ? 'Cancel' : 'Change'}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSavePartner} className="pt-2 flex gap-2">
            <input
              type="text"
              value={partnerInput}
              onChange={(e) => setPartnerInput(e.target.value)}
              placeholder="e.g. Brother Bilal, Farhan"
              className="flex-1 bg-[#04160E] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-xs font-semibold text-white font-metric cursor-pointer"
            >
              Save
            </button>
          </form>
        )}
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-[#061D14] border border-amber-500/25">
          <span className="font-metric text-lg font-bold text-amber-50 block">46</span>
          <span className="text-[9px] uppercase font-metric text-emerald-200/70">Today</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#061D14] border border-amber-500/25">
          <span className="font-metric text-lg font-bold text-amber-400 block">64</span>
          <span className="text-[9px] uppercase font-metric text-emerald-200/70">Weekly</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#061D14] border border-amber-500/25">
          <span className="font-metric text-lg font-bold text-emerald-400 block">{currentStreak}d</span>
          <span className="text-[9px] uppercase font-metric text-emerald-200/70">Clean</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#061D14] border border-amber-500/25">
          <span className="font-metric text-lg font-bold text-amber-300 block">{timeSaved}m</span>
          <span className="text-[9px] uppercase font-metric text-emerald-200/70">Saved</span>
        </div>
      </div>

      {/* Embedded Accountability Message Card */}
      <div className="rounded-2xl bg-[#08261A] border border-amber-500/35 p-5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
              Weekly Report to Send
            </h2>
          </div>
          <span className="text-[10px] text-amber-300/80 font-metric">Ready to send</span>
        </div>

        <pre className="p-3 rounded-xl bg-[#04160E] border border-amber-500/20 text-[11px] font-mono text-emerald-100 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
          {reportCardText}
        </pre>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-4 rounded-xl bg-[#061D14] hover:bg-[#0B3824] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Verbatim "How Accountability Works" 4-Step List */}
      <div className="rounded-2xl bg-[#061D14] border border-amber-500/30 p-5 space-y-3">
        <h3 className="text-xs font-bold text-amber-50 uppercase font-metric tracking-wider">
          How SITR Accountability Works
        </h3>

        <div className="space-y-3 text-xs text-emerald-100/90 leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#08261A] border border-amber-500/40 text-amber-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <p>
              <strong className="text-amber-50">Choose a trusted brother:</strong> Pick someone who fears Allah and sincerely wants the best for your akhirah.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#08261A] border border-amber-500/40 text-amber-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <p>
              <strong className="text-amber-50">Every Jumu'ah auto-generation:</strong> SITR generates your weekly report card summarizing guarded hours and interceptions.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#08261A] border border-amber-500/40 text-amber-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <p>
              <strong className="text-amber-50">Frictionless copy-paste:</strong> Share the formatted receipt directly via WhatsApp, Signal, or Telegram.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#08261A] border border-amber-500/40 text-amber-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <p>
              <strong className="text-amber-50">Mutual nasiha, zero shame:</strong> No punitive metrics or guilt trips — only brothers building up each other’s taqwa.
            </p>
          </div>
        </div>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#061D14] border border-amber-500/35 text-center space-y-1.5">
        <p className="font-arabic text-xl text-amber-50 font-bold leading-loose" dir="rtl">
          وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ
        </p>
        <p className="text-xs text-emerald-200 italic font-sans">
          “And advised each other to truth and advised each other to patience.”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah Al-Asr (Quran 103:3)
        </span>
      </div>
    </div>
  );
};
