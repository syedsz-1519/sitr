export type RuleType = 'app' | 'website' | 'keyword';

export interface BlockRule {
  id: string;
  type: RuleType;
  label: string;
  target: string;
  enabled: boolean;
  createdAt: string;
  blocksCount: number;
}

export interface BlockEvent {
  id: string;
  ruleId?: string;
  label: string;
  target: string;
  type: RuleType;
  blockedAt: string; // ISO string
  durationSeconds?: number;
  simulated?: boolean;
}

export type DhikrType = 'subhanallah' | 'alhamdulillah' | 'astaghfirullah' | 'lahawla' | 'mixed';

export interface DhikrOption {
  id: DhikrType;
  label: string;
  arabic: string;
  transliteration: string;
  meaning: string;
}

export type AyahTheme =
  | 'self_control'
  | 'self-control'
  | 'repentance'
  | 'mercy'
  | 'remembrance'
  | 'dhikr'
  | 'patience'
  | 'consistency'
  | 'hope_motivation'
  | 'reliance'
  | 'striving'
  | 'rescue';

export interface AyahItem {
  id: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference: string;
  surahNumber?: number;
  ayahNumber?: number | string;
  surahName?: string;
  surah?: string;
  theme: AyahTheme;
  themeLabel?: string;
  reflectionLesson?: string;
}

export interface Milestone {
  days: number;
  name: string;
  icon: string;
  line: string;
  unlocked: boolean;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  lastUpdated?: string;
  city?: string;
}

export interface SmartAlert {
  id: string;
  title: string;
  prayerRelation: string;
  time: string;
  description: string;
  enabled: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  avatarColor?: string;
  memberSince?: string;
  accountType: 'guest' | 'standard' | 'founder';
  cloudSyncEnabled: boolean;
}

export type NavTab = 'shield' | 'dhikr' | 'taqwa' | 'ayah';

export type ExtendedView =
  | 'dashboard'
  | 'daily_reflection'
  | 'reminder_scheduler'
  | 'custom_block_mode'
  | 'nafs_score'
  | 'taqwa_streak'
  | 'temptation_map'
  | 'weekly_report'
  | 'accountability'
  | 'smart_alerts'
  | 'sessions_log'
  | 'dhikr_settings'
  | 'challenges'
  | 'ayah_reflections'
  | 'full_analysis';

export type ReminderContentType = 'both' | 'taqwa' | 'quran';

export interface DailyReminderConfig {
  enabled: boolean;
  time: string; // "HH:MM" (24h)
  contentType: ReminderContentType;
  soundEnabled: boolean;
  vibrate: boolean;
  lastTriggeredDate?: string; // YYYY-MM-DD
}

export interface TaqwaReminderItem {
  id: string;
  title: string;
  arabic?: string;
  text: string;
  source: string;
  type: 'taqwa' | 'quran';
  category: string;
}

export type SpiritualState = 'peaceful' | 'guarded' | 'tested' | 'repentant' | 'striving';

export type EmotionalMood =
  | 'sakinah' // Peaceful & Serene (Heart at tranquil rest)
  | 'mahfuz' // Guarded & Vigilant (Protected boundaries)
  | 'mujahid' // Striving & Resilient (Fought nafs with perseverance)
  | 'mubtala' // Tested & Vulnerable (Heavy craving / high tension)
  | 'taib'; // Repentant & Returning (Humbled in sincere Istighfar)

export interface MuhasabahAuditChecklist {
  gazeGuarded: boolean; // Lowered gaze & avoided trigger reels/images
  salahKhushu: boolean; // Prayed 5 daily prayers on time with heart presence
  dhikrTongue: boolean; // Kept tongue moist with daily Dhikr & Istighfar
  urgeConfronted: boolean; // Paused & resisted dopamine cravings with sabr
  digitalDiscipline: boolean; // Disengaged from screens on time / no late-night browsing
}

export interface ReflectionPrompt {
  id: string;
  quote: {
    arabic?: string;
    text: string;
    source: string;
    category: 'muhasabah' | 'tawbah' | 'gratitude' | 'sabr' | 'istiqamah';
  };
  question: string;
  subtext?: string;
}

export interface DailyReflectionEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  promptId?: string;
  quoteText: string;
  quoteSource: string;
  quoteArabic?: string;
  promptQuestion: string;
  journalText: string;
  spiritualState: SpiritualState;
  gratitudeNote?: string;
  cleanDayLogged: boolean;
  // Muhasabah Spiritual Audit & Emotional Trend data
  auditChecklist?: MuhasabahAuditChecklist;
  auditScore?: number; // 0 to 5
  emotionalMood?: EmotionalMood;
  calmnessLevel?: number; // 1 to 5 (1 = Anxious/Restless, 5 = Deep Sakinah)
  primaryTrigger?: string; // Optional context tag (e.g., 'Late Night', 'Boredom', 'Work Stress')
  lessonLearned?: string; // Core spiritual wisdom from today's trial
}

export interface DailyGratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  items: [string, string, string]; // Three things grateful for today
  categoryNote?: string;
}
