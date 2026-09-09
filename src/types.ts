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

export type NavTab = 'shield' | 'dhikr' | 'taqwa' | 'ayah';

export type ExtendedView =
  | 'dashboard'
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
