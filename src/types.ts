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
}
