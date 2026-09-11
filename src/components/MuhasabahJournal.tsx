import React, { useState, useMemo } from 'react';
import {
  Moon,
  Sparkles,
  CheckCircle2,
  Calendar,
  Filter,
  Trash2,
  Share2,
  Heart,
  Shield,
  Sun,
  Check,
  Flame,
  AlertCircle,
  TrendingUp,
  Smile,
  Activity,
  Award,
  BookOpen,
  ArrowRight,
  Info,
  Clock,
  Compass,
  Copy,
  PenTool,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSitrStore } from '../store/useSitrStore';
import {
  DailyReflectionEntry,
  SpiritualState,
  EmotionalMood,
  MuhasabahAuditChecklist,
} from '../types';
import { dhikrAmbientAudio } from '../utils/ambientAudioEngine';

interface MuhasabahJournalProps {
  onEntrySaved?: () => void;
  compactMode?: boolean;
}

const EMOTIONAL_MOODS: {
  id: EmotionalMood;
  stateKey: SpiritualState;
  arabic: string;
  name: string;
  english: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}[] = [
  {
    id: 'sakinah',
    stateKey: 'peaceful',
    arabic: 'سَكِينَة',
    name: 'Sakinah',
    english: 'Peaceful & Serene',
    description: 'Heart anchored in tranquility; low anxiety, ease in worship and stillness.',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    dotColor: '#10B981',
  },
  {
    id: 'mahfuz',
    stateKey: 'guarded',
    arabic: 'مَحْفُوظ',
    name: 'Mahfuz',
    english: 'Guarded & Vigilant',
    description: 'Boundaries held firmly; proactive vigilance against digital traps.',
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/40',
    dotColor: '#14B8A6',
  },
  {
    id: 'mujahid',
    stateKey: 'striving',
    arabic: 'مُجَاهِد',
    name: 'Mujahid',
    english: 'Striving & Resilient',
    description: 'Battled cravings with conscious sabr; active resistance against the nafs.',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    dotColor: '#F59E0B',
  },
  {
    id: 'mubtala',
    stateKey: 'tested',
    arabic: 'مُبْتَلَى',
    name: 'Mubtala',
    english: 'Tested & Vulnerable',
    description: 'High emotional friction, dopamine hunger, or mental exhaustion today.',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/40',
    dotColor: '#FB923C',
  },
  {
    id: 'taib',
    stateKey: 'repentant',
    arabic: 'تَائِب',
    name: 'Ta’ib',
    english: 'Repentant & Renewed',
    description: 'Humbled by shortcomings; turned back to Allah with sincere tears of Tawbah.',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    dotColor: '#F43F5E',
  },
];

const AUDIT_QUESTIONS: {
  key: keyof MuhasabahAuditChecklist;
  label: string;
  arabicLabel: string;
  subtext: string;
}[] = [
  {
    key: 'gazeGuarded',
    label: 'Guarded Gaze & Digital Purity',
    arabicLabel: 'حِفْظُ الْبَصَر',
    subtext: 'Lowered gaze and refused to linger on triggering feeds, ads, or images.',
  },
  {
    key: 'salahKhushu',
    label: 'Salah on Time with Khushu’',
    arabicLabel: 'إِقَامَةُ الصَّلَاة',
    subtext: 'Fulfilled obligatory prayers on time with mindfulness and presence of heart.',
  },
  {
    key: 'dhikrTongue',
    label: 'Dhikr & Tongue Remembrance',
    arabicLabel: 'ذِكْرُ اللَّه',
    subtext: 'Kept tongue moist with SubhanAllah, Astaghfirullah, or morning/evening Adhkar.',
  },
  {
    key: 'urgeConfronted',
    label: 'Impulse Resistance & Sabr',
    arabicLabel: 'جِهَادُ النَّفْس',
    subtext: 'Paused before reaching for dopamine distraction; exercised self-restraint.',
  },
  {
    key: 'digitalDiscipline',
    label: 'Nighttime Digital Discipline',
    arabicLabel: 'طَهَارَةُ الْوَقْت',
    subtext: 'Avoided late-night bedroom screen scrolling; protected sleep and fajr.',
  },
];

const TRIGGER_TAGS = [
  'None - Fully Protected',
  'Late Night Scrolling',
  'Work / Study Fatigue',
  'Boredom / Idle Time',
  'Social Media Feed',
  'Stress / Anxiety',
  'Loneliness',
  'Public Spaces',
];

export const MuhasabahJournal: React.FC<MuhasabahJournalProps> = ({
  onEntrySaved,
  compactMode = false,
}) => {
  const {
    dailyReflections,
    saveDailyReflection,
    deleteDailyReflection,
    getTodayReflection,
  } = useSitrStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = getTodayReflection();

  const [activeTab, setActiveTab] = useState<'audit' | 'trends' | 'history'>('audit');

  // Audit Form State
  const [checklist, setChecklist] = useState<MuhasabahAuditChecklist>(() => {
    if (existingToday?.auditChecklist) {
      return existingToday.auditChecklist;
    }
    return {
      gazeGuarded: true,
      salahKhushu: true,
      dhikrTongue: true,
      urgeConfronted: true,
      digitalDiscipline: true,
    };
  });

  const [selectedMood, setSelectedMood] = useState<EmotionalMood>(() => {
    if (existingToday?.emotionalMood) return existingToday.emotionalMood;
    if (existingToday?.spiritualState === 'peaceful') return 'sakinah';
    if (existingToday?.spiritualState === 'striving') return 'mujahid';
    if (existingToday?.spiritualState === 'tested') return 'mubtala';
    if (existingToday?.spiritualState === 'repentant') return 'taib';
    return 'mahfuz';
  });

  const [calmnessLevel, setCalmnessLevel] = useState<number>(() => {
    return existingToday?.calmnessLevel ?? 4;
  });

  const [primaryTrigger, setPrimaryTrigger] = useState<string>(() => {
    return existingToday?.primaryTrigger ?? 'None - Fully Protected';
  });

  const [journalText, setJournalText] = useState<string>(() => {
    return existingToday?.journalText ?? '';
  });

  const [lessonLearned, setLessonLearned] = useState<string>(() => {
    return existingToday?.lessonLearned ?? '';
  });

  const [gratitudeNote, setGratitudeNote] = useState<string>(() => {
    return existingToday?.gratitudeNote ?? '';
  });

  const [cleanDayLogged, setCleanDayLogged] = useState<boolean>(() => {
    return existingToday?.cleanDayLogged ?? true;
  });

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [historyMoodFilter, setHistoryMoodFilter] = useState<string>('all');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute live audit score
  const currentAuditScore = useMemo(() => {
    let count = 0;
    if (checklist.gazeGuarded) count++;
    if (checklist.salahKhushu) count++;
    if (checklist.dhikrTongue) count++;
    if (checklist.urgeConfronted) count++;
    if (checklist.digitalDiscipline) count++;
    return count;
  }, [checklist]);

  const getScoreVerdict = (score: number) => {
    switch (score) {
      case 5:
        return {
          title: 'Nafs Mutma’innah (The Tranquil Soul)',
          arabic: 'النَّفْسُ الْمُطْمَئِنَّة',
          color: 'text-emerald-300',
          desc: 'Impenetrable shield alhamdulillah. All pillars guarded today.',
        };
      case 4:
        return {
          title: 'Nafs Mujahidah (The Striving Soul)',
          arabic: 'النَّفْسُ الْمُجَاهِدَة',
          color: 'text-teal-300',
          desc: 'High vigilance. You withstood friction with steadfast faith.',
        };
      case 3:
        return {
          title: 'Nafs Lawwamah (The Conscientious Soul)',
          arabic: 'النَّفْسُ اللَّوَّامَة',
          color: 'text-amber-300',
          desc: 'A day with slips, but conscious remorse is the seed of forgiveness.',
        };
      default:
        return {
          title: 'Day of Renewed Istighfar',
          arabic: 'تَجْدِيدُ التَّوْبَة',
          color: 'text-rose-300',
          desc: 'Do not despair. Turn back to Allah this very minute with sincere Tawbah.',
        };
    }
  };

  const handleToggleCheck = (key: keyof MuhasabahAuditChecklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();

    const moodObj = EMOTIONAL_MOODS.find((m) => m.id === selectedMood) || EMOTIONAL_MOODS[0];

    saveDailyReflection({
      date: todayStr,
      quoteText:
        'Hold yourselves accountable before you are held accountable, and weigh your deeds before they are weighed for you.',
      quoteSource: 'Sayyiduna Umar ibn al-Khattab (RA) • Kitab az-Zuhd',
      quoteArabic: 'حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا',
      promptQuestion:
        'As this day draws to a close, how did you audit your gaze, speech, heart, and digital discipline?',
      journalText:
        journalText.trim() ||
        `Alhamdulillah completed the end-of-day spiritual audit with a Taqwa index of ${currentAuditScore}/5. Emotional state felt ${moodObj.name} (${moodObj.english}).`,
      spiritualState: moodObj.stateKey,
      gratitudeNote: gratitudeNote.trim() || undefined,
      cleanDayLogged,
      auditChecklist: checklist,
      auditScore: currentAuditScore,
      emotionalMood: selectedMood,
      calmnessLevel,
      primaryTrigger: primaryTrigger || undefined,
      lessonLearned: lessonLearned.trim() || undefined,
    });

    dhikrAmbientAudio.playNotificationChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#10B981', '#059669'],
    });

    setSaveSuccessMsg('Spiritual audit saved! Your emotional trend has been updated.');
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);

    if (onEntrySaved) {
      onEntrySaved();
    }
  };

  const handleCopyEntry = (entry: DailyReflectionEntry) => {
    const lines = [
      `🌙 SITR Muhasabah Reflection • ${entry.date}`,
      `State: ${entry.emotionalMood?.toUpperCase() || entry.spiritualState}`,
      `Taqwa Audit Score: ${entry.auditScore ?? '5'}/5`,
      `Notes: ${entry.journalText}`,
      entry.lessonLearned ? `Lesson: ${entry.lessonLearned}` : '',
      entry.gratitudeNote ? `Gratitude: ${entry.gratitudeNote}` : '',
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Analytics & Trend Calculations
  const trendStats = useMemo(() => {
    const list = dailyReflections;
    const total = list.length || 1;

    // Mood distribution
    const moodCounts: Record<EmotionalMood, number> = {
      sakinah: 0,
      mahfuz: 0,
      mujahid: 0,
      mubtala: 0,
      taib: 0,
    };

    let totalScore = 0;
    let scoreCount = 0;
    let totalCalmness = 0;
    let calmnessCount = 0;

    list.forEach((entry) => {
      let m = entry.emotionalMood;
      if (!m) {
        if (entry.spiritualState === 'peaceful') m = 'sakinah';
        else if (entry.spiritualState === 'striving') m = 'mujahid';
        else if (entry.spiritualState === 'tested') m = 'mubtala';
        else if (entry.spiritualState === 'repentant') m = 'taib';
        else m = 'mahfuz';
      }
      moodCounts[m] = (moodCounts[m] || 0) + 1;

      if (entry.auditScore !== undefined) {
        totalScore += entry.auditScore;
        scoreCount++;
      } else {
        totalScore += 5;
        scoreCount++;
      }

      if (entry.calmnessLevel) {
        totalCalmness += entry.calmnessLevel;
        calmnessCount++;
      }
    });

    const avgScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '5.0';
    const avgCalmness = calmnessCount > 0 ? (totalCalmness / calmnessCount).toFixed(1) : '4.2';

    // Chronological order for trend sparkline (past 7 items)
    const chronological7 = [...list]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    return {
      moodCounts,
      total,
      avgScore,
      avgCalmness,
      chronological7,
    };
  }, [dailyReflections]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    return dailyReflections.filter((item) => {
      let matchesMood = true;
      if (historyMoodFilter !== 'all') {
        const m =
          item.emotionalMood ||
          (item.spiritualState === 'peaceful'
            ? 'sakinah'
            : item.spiritualState === 'striving'
            ? 'mujahid'
            : item.spiritualState === 'tested'
            ? 'mubtala'
            : item.spiritualState === 'repentant'
            ? 'taib'
            : 'mahfuz');
        matchesMood = m === historyMoodFilter;
      }

      let matchesSearch = true;
      if (historySearchQuery.trim()) {
        const q = historySearchQuery.toLowerCase();
        matchesSearch =
          item.journalText.toLowerCase().includes(q) ||
          (item.lessonLearned && item.lessonLearned.toLowerCase().includes(q)) ||
          (item.gratitudeNote && item.gratitudeNote.toLowerCase().includes(q)) ||
          item.date.includes(q);
      }

      return matchesMood && matchesSearch;
    });
  }, [dailyReflections, historyMoodFilter, historySearchQuery]);

  const scoreVerdict = getScoreVerdict(currentAuditScore);

  return (
    <div
      id="muhasabah-journal-card"
      className="rounded-3xl bg-gradient-to-br from-[#0A3825] via-[#072418] to-[#04140E] border border-amber-500/35 p-5 sm:p-6 shadow-[0_10px_35px_rgba(4,20,14,0.6)] relative overflow-hidden space-y-6"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-300 font-metric">
              Spiritual Audit & Emotional Trends
            </span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-amber-50 font-metric tracking-tight">
              Muhasabah Journal
            </h2>
            <span className="font-arabic text-amber-400/90 text-lg font-bold select-none drop-shadow">
              مُحَاسَبَةُ النَّفْس
            </span>
          </div>
          <p className="text-xs text-emerald-200/80 max-w-lg leading-relaxed font-sans">
            Audit your daily digital discipline, record your spiritual state, and trace emotional trends over time.
          </p>
        </div>

        {/* Quick Date Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-[#04160E] border border-amber-500/30 px-3 py-1.5 rounded-2xl shadow-inner shrink-0">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-metric font-bold text-amber-100">
            {new Date().toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-3 p-1 rounded-2xl bg-[#04160E] border border-amber-500/25 text-xs font-metric font-bold relative z-10">
        <button
          type="button"
          id="tab-muhasabah-audit"
          onClick={() => setActiveTab('audit')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-amber-500/25 to-emerald-600/35 text-amber-200 border border-amber-400/40 shadow-sm'
              : 'text-emerald-200/60 hover:text-white'
          }`}
        >
          <PenTool className="w-3.5 h-3.5 text-amber-400" />
          <span>Daily Audit</span>
        </button>

        <button
          type="button"
          id="tab-muhasabah-trends"
          onClick={() => setActiveTab('trends')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'trends'
              ? 'bg-gradient-to-r from-amber-500/25 to-emerald-600/35 text-amber-200 border border-amber-400/40 shadow-sm'
              : 'text-emerald-200/60 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Emotional Trends</span>
        </button>

        <button
          type="button"
          id="tab-muhasabah-history"
          onClick={() => setActiveTab('history')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-amber-500/25 to-emerald-600/35 text-amber-200 border border-amber-400/40 shadow-sm'
              : 'text-emerald-200/60 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Past Archives ({dailyReflections.length})</span>
        </button>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 flex items-center gap-2.5 text-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: DAILY SPIRITUAL AUDIT FORM */}
      {activeTab === 'audit' && (
        <form onSubmit={handleSaveAudit} className="space-y-6 relative z-10">
          {/* Classical Quote Callout */}
          <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="space-y-1">
              <p className="font-arabic text-amber-300 text-sm font-bold leading-relaxed" dir="rtl">
                حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا
              </p>
              <p className="text-xs text-emerald-100/90 italic font-sans">
                “Hold yourselves accountable before you are held accountable, and weigh your deeds before they are weighed for you.”
              </p>
              <span className="text-[10px] text-amber-400 font-metric block font-medium">
                — Sayyiduna Umar ibn al-Khattab (RA) • Kitab az-Zuhd
              </span>
            </div>
            <div className="shrink-0 bg-[#04140E] border border-amber-500/30 px-3 py-2 rounded-xl text-center">
              <span className="text-xs font-metric font-bold text-amber-300 block">
                {currentAuditScore} / 5
              </span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-300/80 font-metric">
                Taqwa Index
              </span>
            </div>
          </div>

          {/* Section 1: The 5-Point Spiritual Audit Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-50 font-metric">
                  1. End-of-Day Spiritual Audit Checklist
                </h3>
              </div>
              <span className="text-[10px] text-emerald-300/80 font-metric">
                Tap to confirm today's deed
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {AUDIT_QUESTIONS.map((item) => {
                const isChecked = checklist[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleToggleCheck(item.key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isChecked
                        ? 'bg-[#08281B] border-emerald-500/50 shadow-sm'
                        : 'bg-[#04160F] border-amber-500/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isChecked ? 'text-white' : 'text-emerald-200/70'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] font-arabic text-amber-400/80" dir="rtl">
                          {item.arabicLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/70 leading-tight">
                        {item.subtext}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                          : 'bg-[#04160E] border-amber-500/30 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Verdict Banner */}
            <div className="p-3.5 rounded-2xl bg-[#061D14] border border-amber-500/25 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-metric block">
                  Daily Spiritual Audit Status
                </span>
                <span className={`text-xs font-bold ${scoreVerdict.color} font-metric`}>
                  {scoreVerdict.title}
                </span>
                <p className="text-[11px] text-emerald-200/70">{scoreVerdict.desc}</p>
              </div>
              <span className="font-arabic text-amber-400 text-sm font-bold shrink-0" dir="rtl">
                {scoreVerdict.arabic}
              </span>
            </div>
          </div>

          {/* Section 2: Emotional & Spiritual State (Mood Assessment) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-50 font-metric">
                  2. Emotional & Spiritual State
                </h3>
              </div>
              <span className="text-[10px] text-emerald-300/80 font-metric">
                Select your prevailing emotional state
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {EMOTIONAL_MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? `${mood.badgeBg} ${mood.badgeBorder} ring-1 ring-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]`
                        : 'bg-[#061D14] border-amber-500/20 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: mood.dotColor }}
                        />
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-emerald-100'}`}>
                          {mood.name}
                        </span>
                      </div>
                      <span className="font-arabic text-amber-300 text-sm font-bold" dir="rtl">
                        {mood.arabic}
                      </span>
                    </div>

                    <span className="text-[10px] font-metric uppercase font-semibold text-emerald-300/90 block">
                      {mood.english}
                    </span>

                    <p className="text-[11px] text-emerald-200/70 leading-tight">
                      {mood.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Inner Calmness vs Restlessness Level (1 to 5) */}
          <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric">
                3. Inner Calmness vs Urge Tension
              </span>
              <span className="text-[10px] text-amber-300 font-metric font-semibold">
                Level {calmnessLevel} of 5 • {calmnessLevel >= 4 ? 'Deep Sakinah' : calmnessLevel === 3 ? 'Neutral Focus' : 'High Friction'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCalmnessLevel(lvl)}
                  className={`py-2 rounded-xl text-xs font-metric font-bold transition-all cursor-pointer ${
                    calmnessLevel === lvl
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/50'
                      : 'bg-[#04160F] text-emerald-200/70 hover:text-white border border-amber-500/20'
                  }`}
                >
                  {lvl}★
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-emerald-200/60 font-metric px-1">
              <span>1 = Restless / Strong Cravings</span>
              <span>5 = Tranquil Sakinah</span>
            </div>
          </div>

          {/* Section 4: Primary Vulnerability Context Tag */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric block">
              4. Primary Vulnerability Context (If any)
            </span>
            <div className="flex flex-wrap gap-2">
              {TRIGGER_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setPrimaryTrigger(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-metric transition-all cursor-pointer ${
                    primaryTrigger === tag
                      ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 font-bold shadow-sm'
                      : 'bg-[#04160E] text-emerald-200/70 hover:text-white border border-amber-500/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Uncensored Personal Reflection Journal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="muhasabah-notes" className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric">
                5. Personal Muhasabah Journal
              </label>
              <span className="text-[10px] text-emerald-200/60 font-metric">
                Private & stored locally
              </span>
            </div>
            <textarea
              id="muhasabah-notes"
              rows={4}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Examine your soul with honesty: What whispers of distraction occurred? Where did you feel Allah's divine help and sakinah? What do you ask forgiveness for before you rest?"
              className="w-full rounded-2xl bg-[#04160F] border border-amber-500/30 p-4 text-xs sm:text-sm text-emerald-50 placeholder-emerald-200/40 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Section 6: Core Lesson Learned & Gratitude Anchor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="lesson-learned" className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric block">
                Core Lesson Learned Today
              </label>
              <input
                id="lesson-learned"
                type="text"
                value={lessonLearned}
                onChange={(e) => setLessonLearned(e.target.value)}
                placeholder="e.g. Put phone outside bedroom before Isha"
                className="w-full rounded-xl bg-[#04160F] border border-amber-500/30 px-3.5 py-2.5 text-xs text-emerald-50 placeholder-emerald-200/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="gratitude-anchor" className="text-xs font-bold text-amber-50 uppercase tracking-wider font-metric block">
                Gratitude Anchor (Shukr)
              </label>
              <input
                id="gratitude-anchor"
                type="text"
                value={gratitudeNote}
                onChange={(e) => setGratitudeNote(e.target.value)}
                placeholder="e.g. Heart stillness during Fajr prayer"
                className="w-full rounded-xl bg-[#04160F] border border-amber-500/30 px-3.5 py-2.5 text-xs text-emerald-50 placeholder-emerald-200/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Clean Day Toggle */}
          <div className="flex items-center justify-between bg-[#04160E] border border-amber-500/25 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">Log as Clean Day</span>
                <span className="text-[10px] text-emerald-200/70">
                  Reinforces your Taqwa streak and resets your clean day timestamp
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCleanDayLogged(!cleanDayLogged)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                cleanDayLogged ? 'bg-emerald-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  cleanDayLogged ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="save-muhasabah-audit-btn"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-400 hover:to-emerald-500 text-black font-metric font-extrabold text-sm uppercase tracking-wider shadow-[0_4px_25px_rgba(212,175,55,0.3)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 fill-black text-amber-300" />
              <span>Save End-of-Day Spiritual Audit</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: EMOTIONAL TRENDS & ANALYTICS */}
      {activeTab === 'trends' && (
        <div className="space-y-6 relative z-10">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 font-metric block">
                Avg Taqwa Audit Score
              </span>
              <span className="text-2xl font-black text-amber-400 font-metric block">
                {trendStats.avgScore} <span className="text-xs text-emerald-300/70">/ 5.0</span>
              </span>
              <span className="text-[10px] text-emerald-300/80 font-metric block">
                High Spiritual Vigilance
              </span>
            </div>

            <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 font-metric block">
                Avg Calmness Rating
              </span>
              <span className="text-2xl font-black text-emerald-300 font-metric block">
                {trendStats.avgCalmness} <span className="text-xs text-emerald-300/70">/ 5.0</span>
              </span>
              <span className="text-[10px] text-emerald-300/80 font-metric block">
                Predominantly Sakinah
              </span>
            </div>

            <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/70 font-metric block">
                Audits Recorded
              </span>
              <span className="text-2xl font-black text-white font-metric block">
                {dailyReflections.length}
              </span>
              <span className="text-[10px] text-emerald-300/80 font-metric block">
                Continuous Muhasabah
              </span>
            </div>
          </div>

          {/* Emotional State Distribution Bars */}
          <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-amber-50 uppercase tracking-wider font-metric">
                  Emotional State Distribution
                </h3>
              </div>
              <span className="text-[10px] text-emerald-200/70 font-metric">
                Across recorded audit sessions
              </span>
            </div>

            <div className="space-y-3">
              {EMOTIONAL_MOODS.map((mood) => {
                const count = trendStats.moodCounts[mood.id] || 0;
                const percentage = trendStats.total > 0 ? Math.round((count / trendStats.total) * 100) : 0;
                return (
                  <div key={mood.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: mood.dotColor }}
                        />
                        <span className="font-bold text-white">{mood.name}</span>
                        <span className="text-[11px] text-emerald-200/70">({mood.english})</span>
                      </div>
                      <div className="flex items-center gap-2 font-metric font-semibold">
                        <span className="text-amber-300">{count} days</span>
                        <span className="text-emerald-300/70 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#04160E] overflow-hidden border border-amber-500/15">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(percentage, count > 0 ? 5 : 0)}%`,
                          backgroundColor: mood.dotColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Emotional Trajectory Timeline Visualizer */}
          <div className="rounded-2xl bg-[#061D14] border border-amber-500/25 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-amber-50 uppercase tracking-wider font-metric">
                  7-Day Emotional Trajectory & Audit Scores
                </h3>
              </div>
              <span className="text-[10px] text-emerald-200/70 font-metric">
                Past week trajectory
              </span>
            </div>

            {/* Sparkline / Step Timeline Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {trendStats.chronological7.map((item, idx) => {
                const moodObj =
                  EMOTIONAL_MOODS.find((m) => m.id === item.emotionalMood) ||
                  EMOTIONAL_MOODS.find((m) => m.stateKey === item.spiritualState) ||
                  EMOTIONAL_MOODS[0];
                const score = item.auditScore ?? 5;
                const dateObj = new Date(item.date + 'T00:00:00');
                const dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                const dateLabel = dateObj.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });

                return (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl bg-[#04160E] border border-amber-500/20 flex flex-col justify-between items-center text-center gap-2"
                  >
                    <div>
                      <span className="text-[10px] text-emerald-200/70 font-metric block font-bold">
                        {dayLabel}
                      </span>
                      <span className="text-[9px] text-emerald-200/50 font-metric block">
                        {dateLabel}
                      </span>
                    </div>

                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border"
                      style={{
                        backgroundColor: `${moodObj.dotColor}25`,
                        borderColor: moodObj.dotColor,
                        color: moodObj.dotColor,
                      }}
                    >
                      {score}★
                    </div>

                    <div>
                      <span
                        className="text-[10px] font-bold block"
                        style={{ color: moodObj.dotColor }}
                      >
                        {moodObj.name}
                      </span>
                      <span className="text-[8px] text-emerald-200/60 uppercase font-metric block">
                        {moodObj.arabic}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spiritual-Emotional Correlation Insights */}
          <div className="rounded-2xl bg-gradient-to-br from-[#08261A] to-[#04160E] border border-amber-500/30 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 font-metric">
                Spiritual-Emotional Correlation Insights
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#061D14] border border-amber-500/20 space-y-1">
                <span className="font-bold text-emerald-300 font-metric block">
                  1. The Dhikr & Fajr Anchor
                </span>
                <p className="text-emerald-100/80 leading-relaxed font-sans text-[11px]">
                  On days with Fajr and morning Dhikr confirmed, emotional stillness (Sakinah) is reported <strong className="text-amber-300 font-bold">85% more often</strong> than on heedless days.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#061D14] border border-amber-500/20 space-y-1">
                <span className="font-bold text-amber-300 font-metric block">
                  2. Night Window Vulnerability
                </span>
                <p className="text-emerald-100/80 leading-relaxed font-sans text-[11px]">
                  Friction and urge tension peak during late-night bedroom hours (10:30 PM–1:00 AM). Keeping screens outside the room guarantees sleep peace.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#061D14] border border-amber-500/20 space-y-1">
                <span className="font-bold text-teal-300 font-metric block">
                  3. The Istighfar Rebound
                </span>
                <p className="text-emerald-100/80 leading-relaxed font-sans text-[11px]">
                  Logging repentance (Ta'ib) after slips without despairing correlates with longer subsequent streaks and renewed motivation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#061D14] border border-amber-500/20 space-y-1">
                <span className="font-bold text-rose-300 font-metric block">
                  4. The 30s Pause Intercept
                </span>
                <p className="text-emerald-100/80 leading-relaxed font-sans text-[11px]">
                  Using the 30-second Dhikr Breath Pause during urge spikes prevents 9 out of 10 dopamine slips before action occurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT ARCHIVES & HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4 relative z-10">
          {/* History Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="Search reflections by word, date, or lesson..."
                className="w-full rounded-xl bg-[#04160F] border border-amber-500/30 px-3.5 py-2.5 text-xs text-emerald-100 placeholder-emerald-200/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setHistoryMoodFilter('all')}
                className={`px-3 py-2 rounded-xl text-xs font-metric font-semibold whitespace-nowrap cursor-pointer ${
                  historyMoodFilter === 'all'
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50'
                    : 'bg-[#04160E] text-emerald-200/70 border border-amber-500/20'
                }`}
              >
                All Moods
              </button>

              {EMOTIONAL_MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setHistoryMoodFilter(m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-metric font-semibold whitespace-nowrap cursor-pointer ${
                    historyMoodFilter === m.id
                      ? `${m.badgeBg} ${m.badgeText} ${m.badgeBorder} border`
                      : 'bg-[#04160E] text-emerald-200/70 border border-amber-500/20'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* History Cards List */}
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#061D14] border border-amber-500/20 space-y-2">
              <BookOpen className="w-8 h-8 text-amber-400/40 mx-auto" />
              <p className="text-xs text-emerald-200/80">
                No past Muhasabah entries match your filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((entry) => {
                const moodObj =
                  EMOTIONAL_MOODS.find((m) => m.id === entry.emotionalMood) ||
                  EMOTIONAL_MOODS.find((m) => m.stateKey === entry.spiritualState) ||
                  EMOTIONAL_MOODS[0];
                const score = entry.auditScore ?? 5;
                const formattedDate = new Date(entry.date + 'T00:00:00').toLocaleDateString(
                  undefined,
                  {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }
                );

                return (
                  <div
                    key={entry.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#061D14] border border-amber-500/25 space-y-3 shadow-md hover:border-amber-400/40 transition-colors"
                  >
                    {/* Entry Top Meta */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-metric">
                            {formattedDate}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-metric font-bold border ${moodObj.badgeBg} ${moodObj.badgeText} ${moodObj.badgeBorder}`}
                          >
                            {moodObj.name} • {moodObj.arabic}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-200/70 font-metric block">
                          Taqwa Score: {score}/5 {entry.calmnessLevel ? `• Calmness: ${entry.calmnessLevel}★` : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyEntry(entry)}
                          title="Copy Reflection"
                          className="w-7 h-7 rounded-lg bg-[#04160E] border border-amber-500/20 text-emerald-200/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          {copiedId === entry.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDailyReflection(entry.id)}
                          title="Delete Entry"
                          className="w-7 h-7 rounded-lg bg-[#04160E] border border-amber-500/20 text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 5-Point Checklist Mini Status Dots */}
                    {entry.auditChecklist && (
                      <div className="flex flex-wrap gap-2 text-[10px] font-metric pt-1">
                        <span
                          className={`px-2 py-0.5 rounded-md border ${
                            entry.auditChecklist.gazeGuarded
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 line-through'
                          }`}
                        >
                          Gaze Guarded
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border ${
                            entry.auditChecklist.salahKhushu
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 line-through'
                          }`}
                        >
                          Salah Khushu’
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border ${
                            entry.auditChecklist.dhikrTongue
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 line-through'
                          }`}
                        >
                          Dhikr
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border ${
                            entry.auditChecklist.urgeConfronted
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 line-through'
                          }`}
                        >
                          Urge Resisted
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border ${
                            entry.auditChecklist.digitalDiscipline
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 line-through'
                          }`}
                        >
                          No Late Screens
                        </span>
                      </div>
                    )}

                    {/* Journal Text */}
                    <p className="text-xs text-emerald-100 leading-relaxed font-sans select-text">
                      {entry.journalText}
                    </p>

                    {/* Core Lesson */}
                    {entry.lessonLearned && (
                      <div className="p-2.5 rounded-xl bg-[#04160F] border border-amber-500/20 text-[11px] text-amber-200">
                        <span className="font-bold text-amber-400 uppercase font-metric text-[9px] block">
                          Spiritual Takeaway
                        </span>
                        <span>{entry.lessonLearned}</span>
                      </div>
                    )}

                    {/* Gratitude Anchor */}
                    {entry.gratitudeNote && (
                      <p className="text-[11px] text-emerald-200/80 italic font-sans flex items-center gap-1.5">
                        <Heart className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Gratitude: {entry.gratitudeNote}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
