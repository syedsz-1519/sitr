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
          <Users className="w-5 h-5 text-purple-400" />
          <h1 className="text-lg font-bold text-white">Accountability Partner</h1>
        </div>
        <p className="text-xs text-purple-200/70 mt-0.5">
          Share your weekly score with your accountability partner. True brotherhood guards each other's gaze.
        </p>
      </div>

      {/* Partner Profile Card */}
      <div className="rounded-2xl bg-[#170F26] border border-purple-900/30 p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-purple-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-metric tracking-widest text-purple-300/70 block">
                Designated Partner
              </span>
              <h2 className="text-base font-bold text-white">{partnerName}</h2>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-purple-400 hover:text-purple-200 font-semibold transition-colors"
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
              className="flex-1 bg-[#10081C] border border-purple-900/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-semibold text-white font-metric"
            >
              Save
            </button>
          </form>
        )}
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-[#170F26] border border-purple-900/30">
          <span className="font-metric text-lg font-bold text-white block">46</span>
          <span className="text-[9px] uppercase font-metric text-purple-300/70">Today</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#170F26] border border-purple-900/30">
          <span className="font-metric text-lg font-bold text-amber-400 block">64</span>
          <span className="text-[9px] uppercase font-metric text-purple-300/70">Weekly</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#170F26] border border-purple-900/30">
          <span className="font-metric text-lg font-bold text-emerald-400 block">{currentStreak}d</span>
          <span className="text-[9px] uppercase font-metric text-purple-300/70">Clean</span>
        </div>
        <div className="p-3 rounded-2xl bg-[#170F26] border border-purple-900/30">
          <span className="font-metric text-lg font-bold text-purple-300 block">{timeSaved}m</span>
          <span className="text-[9px] uppercase font-metric text-purple-300/70">Saved</span>
        </div>
      </div>

      {/* Embedded Accountability Message Card */}
      <div className="rounded-2xl bg-[#10091D] border border-purple-800/40 p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-white uppercase font-metric tracking-wider">
              Weekly Report to Send
            </h2>
          </div>
          <span className="text-[10px] text-purple-300/70 font-metric">Ready to send</span>
        </div>

        <pre className="p-3 rounded-xl bg-[#08040F] border border-purple-950 text-[11px] font-mono text-purple-200 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
          {reportCardText}
        </pre>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs uppercase tracking-wider font-metric flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-4 rounded-xl bg-[#1E1433] hover:bg-[#271A42] border border-purple-700/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Verbatim "How Accountability Works" 4-Step List */}
      <div className="rounded-2xl bg-[#170F26] border border-purple-900/30 p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase font-metric tracking-wider">
          How SITR Accountability Works
        </h3>

        <div className="space-y-3 text-xs text-purple-200/90 leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <p>
              <strong className="text-white">Choose a trusted brother:</strong> Pick someone who fears Allah and sincerely wants the best for your akhirah.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <p>
              <strong className="text-white">Every Jumu'ah auto-generation:</strong> SITR generates your weekly report card summarizing guarded hours and interceptions.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <p>
              <strong className="text-white">Frictionless copy-paste:</strong> Share the formatted receipt directly via WhatsApp, Signal, or Telegram.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-300 font-metric font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <p>
              <strong className="text-white">Mutual nasiha, zero shame:</strong> No punitive metrics or guilt trips — only brothers building up each other’s taqwa.
            </p>
          </div>
        </div>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#170F26] border border-purple-900/40 text-center space-y-1.5">
        <p className="font-arabic text-xl text-white font-bold leading-loose" dir="rtl">
          وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ
        </p>
        <p className="text-xs text-purple-200 italic font-sans">
          “And advised each other to truth and advised each other to patience.”
        </p>
        <span className="text-[10px] text-purple-400/80 font-metric block">
          — Surah Al-Asr (Quran 103:3)
        </span>
      </div>
    </div>
  );
};
