import { AyahItem, Milestone } from '../types';
import rawAyahs from './ayahs.json';

export const AYAH_POOL: AyahItem[] = (rawAyahs as AyahItem[]).map((a) => ({
  ...a,
  surahName: a.surahName || a.surah,
}));

export const MILESTONES: Milestone[] = [
  { days: 1, name: 'First Step', icon: '🌱', line: 'Bismillah — the journey begins', unlocked: true },
  { days: 3, name: 'Three Days', icon: '🌿', line: 'The Prophet ﷺ did ibadah in 3s', unlocked: false },
  { days: 7, name: 'One Week', icon: '⭐', line: 'A full week of guarding your nafs', unlocked: false },
  { days: 14, name: 'Two Weeks', icon: '🌙', line: 'Consistency is loved by Allah', unlocked: false },
  { days: 21, name: '21 Days', icon: '🔥', line: 'New habit forming — subhanAllah', unlocked: false },
  { days: 30, name: 'One Month', icon: '🏆', line: 'Like fasting a full month — blessed', unlocked: false },
  { days: 40, name: '40 Days', icon: '💎', line: '40 days of sincere ibadah transforms hearts', unlocked: false },
  { days: 100, name: '100 Days', icon: '👑', line: 'Nafs al-Mutmainnah territory', unlocked: false },
];
