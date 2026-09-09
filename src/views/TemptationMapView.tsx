import React, { useState } from 'react';
import { Zap, AlertTriangle, Clock, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const TemptationMapView: React.FC = () => {
  const { events } = useSitrStore();
  const [selectedHour, setSelectedHour] = useState<number | null>(9);

  // Compute block counts per hour (0..23)
  const hourCounts = Array.from({ length: 24 }, (_, hour) => {
    const count = events.filter((ev) => {
      const date = new Date(ev.blockedAt);
      return date.getUTCHours() === hour || date.getHours() === hour;
    }).length;
    return { hour, count };
  });

  // Identify peak hour
  let peakHour = 9;
  let maxCount = 0;
  hourCounts.forEach(({ hour, count }) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });

  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  const getCellBg = (count: number, isPeak: boolean) => {
    if (isPeak && count > 0) return 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
    if (count >= 3) return 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
    if (count === 2) return 'bg-purple-900/60 border-purple-600/50 text-purple-200';
    if (count === 1) return 'bg-purple-950/40 border-purple-800/40 text-purple-300';
    return 'bg-[#150E23] border-purple-950/40 text-purple-400/40 hover:border-purple-800/50';
  };

  const selectedData = hourCounts.find((h) => h.hour === selectedHour);

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h1 className="text-lg font-bold text-white">Temptation Map</h1>
        </div>
        <p className="text-xs text-purple-200/70 mt-0.5">
          24-hour distribution of blocked attempts and urges. Identify your vulnerable hours.
        </p>
      </div>

      {/* Peak Temptation Hour Spotlight Card */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/50 to-amber-950/40 border border-amber-500/40 p-4.5 flex items-start gap-3.5 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300 font-bold block">
            Peak Temptation Hour: {formatHour(peakHour)}
          </span>
          <p className="text-xs text-white font-medium mt-0.5 leading-relaxed">
            <strong>{maxCount || 3} blocks</strong> recorded at this hour — avoid unstructured idle browsing during this window.
          </p>
          <span className="inline-block mt-2 text-[10px] font-metric text-amber-200/80 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/40">
            Suggested: Schedule Wudu & 2 Rakat or Walk
          </span>
        </div>
      </div>

      {/* 24-Hour Temptation Heatmap Grid */}
      <div className="rounded-2xl bg-[#170F26] border border-purple-900/30 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase font-metric tracking-wider">
            24-Hour Temptation Grid
          </span>
          <div className="flex items-center gap-2 text-[10px] text-purple-300/70 font-metric">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#150E23] border border-purple-900"></span> Clean
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-purple-900/80"></span> Mild
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-amber-500"></span> High
            </span>
          </div>
        </div>

        {/* 4 columns x 6 rows */}
        <div className="grid grid-cols-4 gap-2">
          {hourCounts.map(({ hour, count }) => {
            const isPeak = hour === peakHour;
            const isSelected = selectedHour === hour;

            return (
              <button
                key={hour}
                onClick={() => setSelectedHour(hour)}
                type="button"
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-16 transition-all ${getCellBg(
                  count,
                  isPeak
                )} ${isSelected ? 'ring-2 ring-purple-400 scale-102' : ''}`}
              >
                <span className="text-[10px] font-metric font-semibold block">
                  {formatHour(hour)}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xs font-bold font-metric">
                    {count > 0 ? `${count}x` : '—'}
                  </span>
                  {isPeak && count > 0 && (
                    <span className="text-[8px] uppercase font-bold text-rose-300 font-metric">
                      Peak
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Inspection Callout */}
        {selectedData && (
          <div className="p-3 rounded-xl bg-[#10081C] border border-purple-900/40 text-xs flex items-center justify-between text-purple-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>
                Window <strong>{formatHour(selectedData.hour)}:</strong>
              </span>
              <span className="font-semibold text-white">
                {selectedData.count > 0
                  ? `${selectedData.count} blocked temptation(s)`
                  : 'Zero temptation events logged'}
              </span>
            </div>
            {selectedData.count > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-metric">
                Guard Active
              </span>
            )}
          </div>
        )}
      </div>

      {/* Top Danger Windows & Most Tempting Apps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Top Danger Windows */}
        <div className="p-4 rounded-2xl bg-[#170F26] border border-purple-900/30 space-y-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h2 className="text-xs font-bold text-white uppercase font-metric tracking-wider">
              Top Danger Windows
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-900/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">9:00 AM – 10:00 AM</span>
                <span className="text-[10px] text-purple-300/70">Morning procrastination impulse</span>
              </div>
              <span className="text-xs font-bold font-metric text-rose-400">3 blocks</span>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-900/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">2:00 PM – 3:00 PM</span>
                <span className="text-[10px] text-purple-300/70">Post-lunch dopamine seeking</span>
              </div>
              <span className="text-xs font-bold font-metric text-amber-400">3 blocks</span>
            </div>
          </div>
        </div>

        {/* Most Tempting Apps */}
        <div className="p-4 rounded-2xl bg-[#170F26] border border-purple-900/30 space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold text-white uppercase font-metric tracking-wider">
              Most Tempting Triggers
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white font-medium">YouTube (Shorts)</span>
                <span className="font-metric text-purple-300">2 blocks (33%)</span>
              </div>
              <div className="w-full bg-[#10081C] h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white font-medium">Instagram Reels</span>
                <span className="font-metric text-purple-300">1 block (17%)</span>
              </div>
              <div className="w-full bg-[#10081C] h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white font-medium">Twitter / X Feed</span>
                <span className="font-metric text-purple-300">1 block (17%)</span>
              </div>
              <div className="w-full bg-[#10081C] h-2 rounded-full overflow-hidden">
                <div className="bg-purple-700 h-full rounded-full" style={{ width: '17%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#170F26] border border-purple-900/40 text-center space-y-1.5">
        <p className="font-arabic text-xl text-white font-bold leading-loose" dir="rtl">
          وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ إِنَّهُ لَكُمْ عَدُوٌّ مُّبِينٌ
        </p>
        <p className="text-xs text-purple-200 italic font-sans">
          “Do not follow the footsteps of Satan. Indeed, he is to you an open enemy.”
        </p>
        <span className="text-[10px] text-purple-400/80 font-metric block">
          — Surah Al-Baqarah (Quran 2:168)
        </span>
      </div>
    </div>
  );
};
