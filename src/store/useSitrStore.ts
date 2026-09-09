import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlockRule, BlockEvent, DhikrType, PrayerTimes, SmartAlert, RuleType } from '../types';
import confetti from 'canvas-confetti';

interface SitrState {
  // Mode statuses
  isArmed: boolean;
  nightGuard: boolean;
  salahLock: boolean;
  focusWindowActive: boolean;
  customBlockModeEnabled: boolean;

  // Rules & Events
  rules: BlockRule[];
  customRules: BlockRule[];
  events: BlockEvent[];

  // Dhikr Counter
  dhikrCount: number;
  dhikrTarget: number; // 11, 33, 99
  selectedDhikrType: DhikrType;
  dhikrSessionsCompletedToday: number;

  // Taqwa Streak
  currentStreak: number;
  longestStreak: number;
  lastCleanDate: string;
  hasSealedNiyyahToday: boolean;

  // Profile & Accountability
  userName: string;
  partnerName: string;

  // Prayer times
  prayerTimes: PrayerTimes;
  prayerTimesLoading: boolean;

  // Smart Alerts
  alerts: SmartAlert[];

  // Modals & Active Intervention
  urgentRescueOpen: boolean;
  lastInterventionReason?: string;
  technicalNoteOpen: boolean;
  menuDrawerOpen: boolean;

  // Actions
  toggleArmed: () => void;
  toggleNightGuard: () => void;
  toggleSalahLock: () => void;
  toggleCustomBlockMode: () => void;
  addRule: (rule: { label: string; target: string; type: RuleType }) => void;
  toggleRule: (id: string) => void;
  deleteRule: (id: string) => void;
  addCustomRule: (rule: { label: string; target: string; type: RuleType }) => void;
  toggleCustomRule: (id: string) => void;
  deleteCustomRule: (id: string) => void;
  logBlockEvent: (target: string, label?: string, type?: RuleType, simulated?: boolean) => void;
  simulateBlockPrompt: (rule?: BlockRule) => void;
  
  incrementDhikr: () => void;
  resetDhikr: () => void;
  setDhikrTarget: (target: number) => void;
  setDhikrType: (type: DhikrType) => void;
  
  sealNiyyah: () => void;
  recordCleanDay: () => void;
  setPartnerName: (name: string) => void;
  setUserName: (name: string) => void;

  toggleAlert: (id: string) => void;
  fetchPrayerTimes: () => Promise<void>;

  setUrgentRescueOpen: (open: boolean, reason?: string) => void;
  setTechnicalNoteOpen: (open: boolean) => void;
  setMenuDrawerOpen: (open: boolean) => void;

  // Computed helper
  getNafsScore: () => {
    score: number;
    levelName: string;
    arabicName: string;
    description: string;
    color: string;
  };
}

// Generate realistic seeded blocks so Heatmap shows 9am & 2pm peaks as seen in design
const getInitialEvents = (): BlockEvent[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const makeIso = (hour: number, minute: number) => 
    `${year}-${month}-${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`;

  return [
    { id: 'ev-1', label: 'YouTube Shorts', target: 'youtube.com', type: 'app', blockedAt: makeIso(9, 12), durationSeconds: 600 },
    { id: 'ev-2', label: 'YouTube', target: 'youtube.com', type: 'website', blockedAt: makeIso(9, 28), durationSeconds: 900 },
    { id: 'ev-3', label: 'Instagram Explore', target: 'com.instagram.android', type: 'app', blockedAt: makeIso(9, 45), durationSeconds: 300 },
    { id: 'ev-4', label: 'Instagram Reels', target: 'com.instagram.android', type: 'app', blockedAt: makeIso(14, 5), durationSeconds: 450 },
    { id: 'ev-5', label: 'X / Twitter Feed', target: 'x.com', type: 'website', blockedAt: makeIso(14, 22), durationSeconds: 450 },
    { id: 'ev-6', label: 'TikTok Feed', target: 'tiktok.com', type: 'app', blockedAt: makeIso(14, 48), durationSeconds: 600 },
  ];
};

const INITIAL_RULES: BlockRule[] = [
  { id: 'rule-yt', type: 'app', label: 'YouTube (Shorts)', target: 'com.google.android.youtube', enabled: true, createdAt: '2026-05-01', blocksCount: 2 },
  { id: 'rule-ig', type: 'app', label: 'Instagram', target: 'com.instagram.android', enabled: true, createdAt: '2026-05-01', blocksCount: 1 },
  { id: 'rule-tw', type: 'website', label: 'Twitter / X', target: 'x.com', enabled: true, createdAt: '2026-05-02', blocksCount: 1 },
  { id: 'rule-tt', type: 'app', label: 'TikTok', target: 'com.zhiliaoapp.musically', enabled: true, createdAt: '2026-05-03', blocksCount: 1 },
  { id: 'rule-kw', type: 'keyword', label: 'NSFW Triggers', target: 'nsfw, triggers', enabled: true, createdAt: '2026-05-04', blocksCount: 1 },
];

const INITIAL_ALERTS: SmartAlert[] = [
  {
    id: 'alert-pre-dhuhr',
    title: 'Pre-Dhuhr Check-in',
    prayerRelation: '~15 min before Dhuhr',
    time: '12:45 PM',
    description: 'Midday clarity pulse to step away from screens before prayer window begins.',
    enabled: true,
  },
  {
    id: 'alert-post-asr',
    title: 'Post-Asr Temptation Window',
    prayerRelation: 'Right after Asr',
    time: '4:30 PM',
    description: 'Late afternoon energy slump window. Prime time for mindless scrolling — guard your gaze.',
    enabled: true,
  },
  {
    id: 'alert-pre-isha',
    title: 'Pre-Isha Digital Sunset',
    prayerRelation: '~30 min before Isha',
    time: '8:15 PM',
    description: 'Wind-down nudge to silence notification triggers and prepare for evening ibadah.',
    enabled: true,
  },
];

export const useSitrStore = create<SitrState>()(
  persist(
    (set, get) => ({
      isArmed: true,
      nightGuard: true,
      salahLock: true,
      focusWindowActive: true,
      customBlockModeEnabled: false,

      rules: INITIAL_RULES,
      customRules: [],
      events: getInitialEvents(),

      dhikrCount: 0,
      dhikrTarget: 33,
      selectedDhikrType: 'lahawla',
      dhikrSessionsCompletedToday: 2,

      currentStreak: 1,
      longestStreak: 14,
      lastCleanDate: new Date().toISOString().split('T')[0],
      hasSealedNiyyahToday: true,

      userName: 'Shahnawaz (Fixxells)',
      partnerName: 'Brother Bilal',

      prayerTimes: {
        Fajr: '05:12 AM',
        Sunrise: '06:34 AM',
        Dhuhr: '01:04 PM',
        Asr: '04:42 PM',
        Maghrib: '07:31 PM',
        Isha: '08:48 PM',
        city: 'Dubai / Mecca (Auto UTC)',
      },
      prayerTimesLoading: false,

      alerts: INITIAL_ALERTS,

      urgentRescueOpen: false,
      lastInterventionReason: undefined,
      technicalNoteOpen: false,
      menuDrawerOpen: false,

      toggleArmed: () => set((s) => ({ isArmed: !s.isArmed })),
      toggleNightGuard: () => set((s) => ({ nightGuard: !s.nightGuard })),
      toggleSalahLock: () => set((s) => ({ salahLock: !s.salahLock })),
      toggleCustomBlockMode: () => set((s) => ({ customBlockModeEnabled: !s.customBlockModeEnabled })),

      addRule: ({ label, target, type }) => {
        const newRule: BlockRule = {
          id: `rule-${Date.now()}`,
          label: label.trim(),
          target: target.trim(),
          type,
          enabled: true,
          createdAt: new Date().toISOString(),
          blocksCount: 0,
        };
        set((s) => ({ rules: [newRule, ...s.rules] }));
      },

      toggleRule: (id) =>
        set((s) => ({
          rules: s.rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
        })),

      deleteRule: (id) =>
        set((s) => ({
          rules: s.rules.filter((r) => r.id !== id),
        })),

      addCustomRule: ({ label, target, type }) => {
        const newRule: BlockRule = {
          id: `custom-rule-${Date.now()}`,
          label: label.trim(),
          target: target.trim(),
          type,
          enabled: true,
          createdAt: new Date().toISOString(),
          blocksCount: 0,
        };
        set((s) => ({ customRules: [newRule, ...s.customRules] }));
      },

      toggleCustomRule: (id) =>
        set((s) => ({
          customRules: s.customRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
        })),

      deleteCustomRule: (id) =>
        set((s) => ({
          customRules: s.customRules.filter((r) => r.id !== id),
        })),

      logBlockEvent: (target, label, type = 'app', simulated = false) => {
        const newEvent: BlockEvent = {
          id: `ev-${Date.now()}`,
          target,
          label: label || target,
          type,
          blockedAt: new Date().toISOString(),
          durationSeconds: 300,
          simulated,
        };
        set((s) => ({
          events: [newEvent, ...s.events],
          rules: s.rules.map((r) =>
            r.target.toLowerCase() === target.toLowerCase() || (label && r.label.toLowerCase() === label.toLowerCase())
              ? { ...r, blocksCount: r.blocksCount + 1 }
              : r
          ),
        }));
      },

      simulateBlockPrompt: (rule) => {
        const target = rule ? rule.target : 'instagram.com';
        const label = rule ? rule.label : 'Instagram Explore';
        const type = rule ? rule.type : 'app';
        get().logBlockEvent(target, label, type, true);
        set({
          urgentRescueOpen: true,
          lastInterventionReason: `Shield Intervention: ${label} (${target}) was blocked!`,
        });
      },

      incrementDhikr: () => {
        const { dhikrCount, dhikrTarget } = get();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(25);
          } catch {
            // ignore vibration error
          }
        }

        if (dhikrCount + 1 >= dhikrTarget) {
          // Completed session
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#7C3AED', '#D4A017', '#22C55E', '#A78BFA'],
          });
          set((s) => ({
            dhikrCount: s.dhikrTarget,
            dhikrSessionsCompletedToday: s.dhikrSessionsCompletedToday + 1,
          }));
        } else {
          set({ dhikrCount: dhikrCount + 1 });
        }
      },

      resetDhikr: () => set({ dhikrCount: 0 }),
      setDhikrTarget: (target) => set({ dhikrTarget: target, dhikrCount: 0 }),
      setDhikrType: (type) => set({ selectedDhikrType: type }),

      sealNiyyah: () => {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A3E635', '#7C3AED', '#D4A017'],
        });
        set({ hasSealedNiyyahToday: true });
      },

      recordCleanDay: () => {
        const next = get().currentStreak + 1;
        const newLongest = Math.max(get().longestStreak, next);
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#34D399', '#F59E0B', '#A78BFA', '#10B981'],
        });
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([35, 50, 60]);
          } catch {
            // ignore
          }
        }
        set({
          currentStreak: next,
          longestStreak: newLongest,
        });
      },

      setPartnerName: (name) => set({ partnerName: name }),
      setUserName: (name) => set({ userName: name }),

      toggleAlert: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
        })),

      fetchPrayerTimes: async () => {
        set({ prayerTimesLoading: true });
        try {
          const res = await fetch('https://api.aladhan.com/v1/timings?latitude=24.467&longitude=39.611&method=4');
          if (res.ok) {
            const data = await res.json();
            const timings = data.data.timings;
            set({
              prayerTimes: {
                Fajr: timings.Fajr || '05:12 AM',
                Sunrise: timings.Sunrise || '06:34 AM',
                Dhuhr: timings.Dhuhr || '01:04 PM',
                Asr: timings.Asr || '04:42 PM',
                Maghrib: timings.Maghrib || '07:31 PM',
                Isha: timings.Isha || '08:48 PM',
                city: 'Madinah Al-Munawwarah',
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
              prayerTimesLoading: false,
            });
          } else {
            set({ prayerTimesLoading: false });
          }
        } catch {
          set({ prayerTimesLoading: false });
        }
      },

      setUrgentRescueOpen: (open, reason) =>
        set({ urgentRescueOpen: open, lastInterventionReason: reason }),
      setTechnicalNoteOpen: (open) => set({ technicalNoteOpen: open }),
      setMenuDrawerOpen: (open) => set({ menuDrawerOpen: open }),

      getNafsScore: () => {
        const { events, dhikrSessionsCompletedToday, currentStreak } = get();
        // Today's blocked attempts
        const todayBlocks = events.length;
        const missedSalahLocks = 0; // Guard active
        const cleanHoursStreak = Math.min(14, currentStreak * 6);

        // Algorithm specified in brief:
        // score = 100 - (blocked_app_open_attempts_today * 3) - (missed_salah_lock_windows * 5) + (dhikr_sessions_completed_today * 4) + (clean_hours_streak_today * 1)
        let score = 100 - (todayBlocks * 3) - (missedSalahLocks * 5) + (dhikrSessionsCompletedToday * 4) + (cleanHoursStreak * 1);
        score = Math.max(0, Math.min(100, score));

        // Default or adjusted to match the 46/64 design showcase:
        // If todayBlocks is 6, score = 100 - 18 - 0 + 8 + 14 = 104 -> 100 or user baseline.
        // Let's ensure realistic ranges based on score:
        if (score >= 80) {
          return {
            score,
            levelName: 'Nafs al-Mutma’innah',
            arabicName: 'النَّفْسُ الْمُطْمَئِنَّة',
            description: 'Nafs al-Mutma’inna territory — the soul at peace.',
            color: '#10B981',
          };
        } else if (score >= 50) {
          return {
            score,
            levelName: 'Nafs al-Lawwamah',
            arabicName: 'النَّفْسُ اللَّوَّامَة',
            description: 'Nafs al-Lawwama — the self that struggles and repents. Keep going.',
            color: '#8B5CF6',
          };
        } else {
          return {
            score,
            levelName: 'Nafs al-Ammarah',
            arabicName: 'النَّفْسُ الأَمَّارَة',
            description: 'Nafs al-Ammara is loud today — but Allah’s mercy is louder.',
            color: '#FF5722',
          };
        }
      },
    }),
    {
      name: 'sitr-wellbeing-storage',
      partialize: (state) => ({
        rules: state.rules,
        events: state.events,
        dhikrTarget: state.dhikrTarget,
        selectedDhikrType: state.selectedDhikrType,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        userName: state.userName,
        partnerName: state.partnerName,
        isArmed: state.isArmed,
        nightGuard: state.nightGuard,
        salahLock: state.salahLock,
        customBlockModeEnabled: state.customBlockModeEnabled,
        customRules: state.customRules,
      }),
    }
  )
);
