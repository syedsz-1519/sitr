import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Share2,
  Search,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Shield,
  Heart,
  Flame,
  Sun,
  Clock,
  Compass,
} from 'lucide-react';
import { AYAH_POOL } from '../data/ayahs';
import { AyahItem, AyahTheme } from '../types';

export const AyahReflectionView: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  const themes: { id: string; label: string; icon: React.ReactNode; count: number }[] = useMemo(() => {
    const counts = AYAH_POOL.reduce<Record<string, number>>((acc, a) => {
      acc[a.theme] = (acc[a.theme] || 0) + 1;
      return acc;
    }, {});

    return [
      { id: 'all', label: 'All Verses', icon: <BookOpen className="w-3.5 h-3.5" />, count: AYAH_POOL.length },
      { id: 'self-control', label: 'Self-Control & Zina', icon: <Shield className="w-3.5 h-3.5" />, count: (counts['self-control'] || 0) + (counts['self_control'] || 0) },
      { id: 'repentance', label: 'Repentance (Tawbah)', icon: <Flame className="w-3.5 h-3.5" />, count: counts['repentance'] || 0 },
      { id: 'mercy', label: "Allah's Vast Mercy", icon: <Heart className="w-3.5 h-3.5" />, count: counts['mercy'] || 0 },
      { id: 'dhikr', label: "Allah's Remembrance", icon: <Sun className="w-3.5 h-3.5" />, count: (counts['dhikr'] || 0) + (counts['remembrance'] || 0) },
      { id: 'patience', label: 'Patience (Sabr)', icon: <Clock className="w-3.5 h-3.5" />, count: counts['patience'] || 0 },
      { id: 'consistency', label: 'Consistency (Istiqamah)', icon: <Sparkles className="w-3.5 h-3.5" />, count: counts['consistency'] || 0 },
    ];
  }, []);

  const filteredAyahs = useMemo(() => {
    return AYAH_POOL.filter((ayah) => {
      const matchesTheme =
        selectedTheme === 'all' ||
        ayah.theme === selectedTheme ||
        (selectedTheme === 'self-control' && (ayah.theme === 'self_control' as string)) ||
        (selectedTheme === 'dhikr' && (ayah.theme === 'remembrance' as string));
      if (!matchesTheme) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        ayah.translation.toLowerCase().includes(q) ||
        ayah.reference.toLowerCase().includes(q) ||
        (ayah.surahName && ayah.surahName.toLowerCase().includes(q)) ||
        (ayah.themeLabel && ayah.themeLabel.toLowerCase().includes(q)) ||
        (ayah.transliteration && ayah.transliteration.toLowerCase().includes(q)) ||
        (ayah.reflectionLesson && ayah.reflectionLesson.toLowerCase().includes(q)) ||
        ayah.arabic.includes(q)
      );
    });
  }, [selectedTheme, searchQuery]);

  const handleCopy = (ayah: AyahItem) => {
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n— ${ayah.reference} (Surah ${ayah.surahName || ''})\n\nReflection: ${ayah.reflectionLesson || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(ayah.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (ayah: AyahItem) => {
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n— ${ayah.reference} (Surah ${ayah.surahName || ''})\n\nReflection: ${ayah.reflectionLesson || ''}\n\nShared via SITR (Guard Your Gaze)`;
    const shareData = {
      title: `Quranic Reflection — ${ayah.reference}`,
      text,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setCopiedId(ayah.id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopy(ayah);
        }
      }
    } else {
      handleCopy(ayah);
    }
  };

  const handleShuffleSpotlight = () => {
    const nextIdx = Math.floor(Math.random() * AYAH_POOL.length);
    setSpotlightIndex(nextIdx);
  };

  const spotlightAyah = AYAH_POOL[spotlightIndex] || AYAH_POOL[0];

  const quickFilterTopics = [
    { label: '🚫 Stay Away from Zina', query: 'zina' },
    { label: '🤲 Sincere Repentance', query: 'repent' },
    { label: '🕊️ Mercy Encompasses All', query: 'mercy' },
    { label: '📿 Remember Me, I Remember You', query: 'remember me' },
    { label: '🌱 Consistency & Istiqamah', query: 'steadfast' },
    { label: '✨ Hardship with Ease', query: 'ease' },
    { label: '👁️ Does Allah Not See?', query: 'sees' },
  ];

  return (
    <div className="space-y-6 pb-14 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#08261A] border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-sm">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-amber-50 tracking-tight">
              Quranic Reflections & Anchors
            </h1>
            <p className="text-xs text-emerald-200/80">
              40 curated verses with accurate translations to conquer nafs conflicts and revive your heart.
            </p>
          </div>
        </div>
      </div>

      {/* Daily Spotlight Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#061D14] via-[#08261A] to-[#04140E] border border-amber-500/40 p-6 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-metric tracking-widest text-amber-300 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D3827] border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Core Spiritual Anchor
            </span>
            {spotlightAyah.themeLabel && (
              <span className="text-[10px] uppercase font-metric tracking-wider text-emerald-200 px-2 py-0.5 rounded-full bg-[#08261A] border border-amber-500/30">
                {spotlightAyah.themeLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShuffleSpotlight}
              className="p-2 rounded-xl bg-[#04160E] hover:bg-[#0B3824] text-amber-300 hover:text-white transition-colors text-xs flex items-center gap-1 font-metric border border-amber-500/25 cursor-pointer"
              title="Shuffle another Ayah"
              type="button"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Shuffle</span>
            </button>
            <button
              onClick={() => handleCopy(spotlightAyah)}
              className="p-2 rounded-xl bg-[#04160E] hover:bg-[#0B3824] text-amber-300 hover:text-white transition-colors border border-amber-500/25 cursor-pointer"
              title="Copy Ayah"
              type="button"
            >
              {copiedId === spotlightAyah.id ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => handleShare(spotlightAyah)}
              className="p-2 rounded-xl bg-[#04160E] hover:bg-[#0B3824] text-amber-300 hover:text-white transition-colors border border-amber-500/25 cursor-pointer"
              title="Share Ayah (Web Share API)"
              type="button"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Arabic Text */}
        <p
          className="font-arabic text-2xl sm:text-3xl text-amber-50 my-3 leading-loose text-right font-bold drop-shadow-sm tracking-wide"
          dir="rtl"
        >
          {spotlightAyah.arabic}
        </p>

        {/* Transliteration */}
        {spotlightAyah.transliteration && (
          <p className="text-xs text-emerald-200/80 font-mono italic tracking-wide leading-relaxed">
            {spotlightAyah.transliteration}
          </p>
        )}

        {/* English Translation */}
        <div className="p-3.5 rounded-2xl bg-[#04160E]/80 border border-amber-500/30 space-y-1">
          <span className="text-[10px] uppercase font-metric tracking-wider text-amber-400 font-semibold block">
            Translation
          </span>
          <p className="text-sm text-emerald-50/95 leading-relaxed font-medium">
            "{spotlightAyah.translation}"
          </p>
        </div>

        {/* Overcoming Nafs Conflict Lesson */}
        {spotlightAyah.reflectionLesson && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#08261A] to-[#0D3827] border border-amber-500/35 text-xs text-emerald-100/90 leading-relaxed">
            <span className="text-[10px] uppercase font-metric tracking-wider text-amber-300 font-bold block mb-1">
              💡 Nafs Antidote & Wisdom
            </span>
            {spotlightAyah.reflectionLesson}
          </div>
        )}

        {/* Reference Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-500/20 text-xs text-emerald-200 font-metric">
          <span className="font-bold text-amber-300">{spotlightAyah.reference}</span>
          <span>Surah {spotlightAyah.surahName}</span>
        </div>
      </div>

      {/* Search Bar & Quick Tags */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, e.g. 'zina', 'repent', 'mercy', 'remember me'..."
            className="w-full bg-[#061D14] border border-amber-500/30 hover:border-amber-500/50 focus:border-amber-400 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-emerald-400/50 focus:outline-none transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Discovery Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickFilterTopics.map((topic) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => {
                setSearchQuery(topic.query);
                setSelectedTheme('all');
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                searchQuery.toLowerCase() === topic.query.toLowerCase()
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-amber-400 text-white'
                  : 'bg-[#061D14] border-amber-500/25 text-emerald-200/80 hover:bg-[#08261A] hover:text-white'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Filters Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTheme(t.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedTheme === t.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-amber-400/60'
                : 'bg-[#061D14] text-emerald-200/80 hover:text-white border border-amber-500/25 hover:bg-[#08261A]'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-metric ${
                selectedTheme === t.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#04160E] text-amber-300 border border-amber-500/30'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1 text-xs text-emerald-200/70 font-metric">
        <span>
          Showing <strong className="text-amber-100">{filteredAyahs.length}</strong> of 40 Curated Ayahs
        </span>
        {searchQuery && (
          <span className="text-amber-400">
            Filtered by "{searchQuery}"
          </span>
        )}
      </div>

      {/* Ayahs List */}
      {filteredAyahs.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#061D14] border border-amber-500/25 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-amber-400/60 mx-auto" />
          <p className="text-sm text-amber-50 font-bold">No verses match your search</p>
          <p className="text-xs text-emerald-200/70">
            Try clearing the search query or selecting "All Verses".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTheme('all');
            }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAyahs.map((ayah) => {
            const isLessonOpen = expandedLessonId === ayah.id;
            return (
              <div
                key={ayah.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#061D14] border border-amber-500/25 space-y-3.5 transition-all hover:border-amber-500/50 shadow-md"
              >
                {/* Reference & Badge Header */}
                <div className="flex items-center justify-between text-xs text-amber-400 font-metric">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs px-2.5 py-1 rounded-lg bg-[#04160E] border border-amber-500/35">
                      {ayah.reference}
                    </span>
                    {ayah.themeLabel && (
                      <span className="text-[10px] text-amber-300 font-medium px-2 py-0.5 rounded-md bg-[#08261A] border border-amber-500/30">
                        {ayah.themeLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {ayah.surahName && (
                      <span className="text-[11px] text-emerald-200/80">
                        Surah {ayah.surahName}
                      </span>
                    )}
                    <button
                      onClick={() => handleCopy(ayah)}
                      className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-[#08261A] transition-colors cursor-pointer"
                      title="Copy verse"
                      type="button"
                    >
                      {copiedId === ayah.id ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(ayah)}
                      className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-[#08261A] transition-colors cursor-pointer"
                      title="Share verse"
                      type="button"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Arabic Script */}
                <p
                  className="font-arabic text-2xl sm:text-3xl text-amber-50 text-right leading-loose font-bold my-1 tracking-wide"
                  dir="rtl"
                >
                  {ayah.arabic}
                </p>

                {/* Transliteration */}
                {ayah.transliteration && (
                  <p className="text-[11px] text-emerald-200/70 font-mono italic leading-relaxed">
                    {ayah.transliteration}
                  </p>
                )}

                {/* Translation */}
                <p className="text-xs sm:text-sm text-emerald-50/95 leading-relaxed font-medium bg-[#04160E] p-3 rounded-xl border border-amber-500/25">
                  "{ayah.translation}"
                </p>

                {/* Nafs Reflection Insight Accordion */}
                {ayah.reflectionLesson && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLessonId(isLessonOpen ? null : ayah.id)
                      }
                      className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-[#08261A] hover:bg-[#0B3322] border border-amber-500/30 text-xs text-emerald-100 font-medium transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        How this overcomes Nafs conflicts
                      </span>
                      {isLessonOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>

                    {isLessonOpen && (
                      <div className="mt-2 p-3.5 rounded-xl bg-[#08261A] border border-amber-500/35 text-xs text-emerald-100/90 leading-relaxed animate-in fade-in duration-200">
                        {ayah.reflectionLesson}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Closing Inspiration Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#061D14] via-[#08261A] to-[#04140E] border border-amber-500/35 text-center space-y-2">
        <p className="text-xs text-emerald-200 font-medium">
          “The believers are only those who, when Allah is mentioned, their hearts become fearful, and when His verses are recited to them, it increases them in faith...”
        </p>
        <span className="text-[10px] text-amber-400 font-metric block">
          — Surah Al-Anfal (Quran 8:2)
        </span>
      </div>
    </div>
  );
};
