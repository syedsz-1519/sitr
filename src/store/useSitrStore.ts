import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BlockRule,
  BlockEvent,
  DhikrType,
  PrayerTimes,
  SmartAlert,
  RuleType,
  UserProfile,
  DailyReflectionEntry,
  DailyReminderConfig,
  TaqwaReminderItem,
} from '../types';
import confetti from 'canvas-confetti';
import { dhikrAmbientAudio } from '../utils/ambientAudioEngine';
import { getDailyScheduledReminder } from '../data/taqwaReminders';

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
  userProfile: UserProfile;

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
  authModalOpen: boolean;

  // Daily Reflection & Evening Muhasabah
  dailyReflections: DailyReflectionEntry[];
  dailyReflectionModalOpen: boolean;

  // Daily Taqwa & Quranic Reminder Scheduler
  dailyReminderConfig: DailyReminderConfig;
  activeTaqwaReminder: TaqwaReminderItem | null;
  reminderSchedulerModalOpen: boolean;

  // Dhikr Breath Pause
  breathPauseModalOpen: boolean;
  breathPausesCompleted: number;

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
  setStreakDays: (days: number) => void;
  setPartnerName: (name: string) => void;
  setUserName: (name: string) => void;

  // Auth actions
  login: (email: string, name?: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  setAuthModalOpen: (open: boolean) => void;

  // Daily Reflection Actions
  saveDailyReflection: (entry: Omit<DailyReflectionEntry, 'id' | 'timestamp'>) => void;
  deleteDailyReflection: (id: string) => void;
  setDailyReflectionModalOpen: (open: boolean) => void;
  getTodayReflection: () => DailyReflectionEntry | undefined;

  // Daily Taqwa Reminder Scheduler Actions
  updateDailyReminderConfig: (config: Partial<DailyReminderConfig>) => void;
  setReminderSchedulerModalOpen: (open: boolean) => void;
  triggerScheduledReminder: (customReminder?: TaqwaReminderItem) => void;
  dismissTaqwaReminder: () => void;

  toggleAlert: (id: string) => void;
  fetchPrayerTimes: () => Promise<void>;

  setUrgentRescueOpen: (open: boolean, reason?: string) => void;
  setTechnicalNoteOpen: (open: boolean) => void;
  setMenuDrawerOpen: (open: boolean) => void;
  setBreathPauseModalOpen: (open: boolean) => void;
  incrementBreathPause: () => void;

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
const getInitialReflections = (): DailyReflectionEntry[] => {
  const now = new Date();
  const getOffsetDate = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'ref-seed-1',
      date: getOffsetDate(1),
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      promptId: 'ref-1',
      quoteText: 'Hold yourselves accountable before you are held accountable, and weigh your deeds before they are weighed for you.',
      quoteSource: 'Sayyiduna Umar ibn al-Khattab (RA) • Kitab az-Zuhd',
      quoteArabic: 'حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا',
      promptQuestion: 'As this day closes, how did you guard your eyes, heart, and thoughts when you were alone?',
      journalText: 'Alhamdulillah, resisted opening short-form video reels around 10 PM. Put the phone on airplane mode on the desk and read Surat Al-Mulk instead. Felt a distinct stillness in my chest.',
      spiritualState: 'guarded',
      gratitudeNote: 'Grateful for the ability to pray Isha with congregation and for Bilal’s reminder message.',
      cleanDayLogged: true,
      auditChecklist: {
        gazeGuarded: true,
        salahKhushu: true,
        dhikrTongue: true,
        urgeConfronted: true,
        digitalDiscipline: true,
      },
      auditScore: 5,
      emotionalMood: 'mahfuz',
      calmnessLevel: 4,
      primaryTrigger: 'Late Night Reels',
      lessonLearned: 'Leaving the phone outside the bedroom shuts down 90% of midnight vulnerability.',
    },
    {
      id: 'ref-seed-2',
      date: getOffsetDate(2),
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      promptId: 'ref-6',
      quoteText: 'Unquestionably, by the remembrance of Allah do hearts find rest.',
      quoteSource: 'Surah Ar-Ra’d • 13:28',
      quoteArabic: 'أَلاَ بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
      promptQuestion: 'Which prayer or moment of Dhikr brought your soul genuine stillness and peace today?',
      journalText: 'Fajr prayer was heavy with gratitude. Did 99 counts of SubhanAllah wa bihamdihi on the SITR counter on my morning commute instead of mindless browsing.',
      spiritualState: 'peaceful',
      gratitudeNote: 'Peace of mind and waking up on time for Tahajjud.',
      cleanDayLogged: true,
      auditChecklist: {
        gazeGuarded: true,
        salahKhushu: true,
        dhikrTongue: true,
        urgeConfronted: true,
        digitalDiscipline: true,
      },
      auditScore: 5,
      emotionalMood: 'sakinah',
      calmnessLevel: 5,
      primaryTrigger: 'None - Protected',
      lessonLearned: 'Commute dhikr sets an impenetrable shield for the whole working afternoon.',
    },
    {
      id: 'ref-seed-3',
      date: getOffsetDate(3),
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      promptId: 'ref-2',
      quoteText: 'The true mujahid is the one who strives against his own self in obedience to Allah.',
      quoteSource: 'Sunan at-Tirmidhi • Sahih Hadith',
      quoteArabic: 'الْمُجَاهِدُ مَنْ جَاهَدَ نَفْسَهُ فِي سَبِيلِ اللَّهِ',
      promptQuestion: 'Where did you face the greatest friction today, and how did you conquer it?',
      journalText: 'Was fatigued after work and caught myself lingering on image feeds. Did the 30-second Dhikr Breath Pause and recited La Hawla. The urge dissipated after 2 minutes.',
      spiritualState: 'striving',
      gratitudeNote: 'Grateful that SITR intercepted the trigger before I engaged.',
      cleanDayLogged: true,
      auditChecklist: {
        gazeGuarded: true,
        salahKhushu: true,
        dhikrTongue: true,
        urgeConfronted: true,
        digitalDiscipline: false,
      },
      auditScore: 4,
      emotionalMood: 'mujahid',
      calmnessLevel: 3,
      primaryTrigger: 'Work Fatigue',
      lessonLearned: 'When tired, don’t turn to screens for comfort—turn to wudu and sleep.',
    },
    {
      id: 'ref-seed-4',
      date: getOffsetDate(4),
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      promptId: 'ref-5',
      quoteText: 'Every son of Adam makes mistakes, and the best of those who make mistakes are the repentant.',
      quoteSource: 'Sunan Ibn Majah • Hasan Hadith',
      quoteArabic: 'كُلُّ ابْنِ آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
      promptQuestion: 'What heedlessness or slip of the gaze do you ask Allah to erase tonight?',
      journalText: 'Glanced at an intrusive pop-up notification on my laptop during late study hours. Felt an immediate pang of guilt, closed the laptop, made sincere wudu and prayed 2 raka’at tawbah.',
      spiritualState: 'repentant',
      gratitudeNote: 'The door of repentance is forever open without an appointment.',
      cleanDayLogged: true,
      auditChecklist: {
        gazeGuarded: false,
        salahKhushu: true,
        dhikrTongue: true,
        urgeConfronted: true,
        digitalDiscipline: false,
      },
      auditScore: 3,
      emotionalMood: 'taib',
      calmnessLevel: 3,
      primaryTrigger: 'Late Study Screen',
      lessonLearned: 'Guilt is a mercy when it moves your limbs into sajdah.',
    },
    {
      id: 'ref-seed-5',
      date: getOffsetDate(5),
      timestamp: new Date(Date.now() - 432000000).toISOString(),
      promptId: 'ref-3',
      quoteText: 'Know that victory comes with patience, and relief comes with distress.',
      quoteSource: 'Musnad Ahmad • Sahih',
      quoteArabic: 'وَاعْلَمْ أَنَّ النَّصْرَ مَعَ الصَّبْرِ، وَأَنَّ الْفَرَجَ مَعَ الْكَرْبِ',
      promptQuestion: 'How did patience protect your peace of mind and soul today?',
      journalText: 'A high-stress day with family responsibilities. Used the Misbaha counter for 100x Astaghfirullah during traffic. Kept my gaze protected even in crowded public spaces.',
      spiritualState: 'guarded',
      gratitudeNote: 'Health, patience, and good company of righteous friends.',
      cleanDayLogged: true,
      auditChecklist: {
        gazeGuarded: true,
        salahKhushu: true,
        dhikrTongue: true,
        urgeConfronted: true,
        digitalDiscipline: true,
      },
      auditScore: 5,
      emotionalMood: 'mahfuz',
      calmnessLevel: 4,
      primaryTrigger: 'Public Crowd',
      lessonLearned: 'Looking down is not weakness; it is royal dignity before the King of kings.',
    },
  ];
};

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
      userProfile: {
        name: 'Shahnawaz (Fixxells)',
        email: 'syedshahnawaz1519@gmail.com',
        isLoggedIn: true,
        accountType: 'founder',
        memberSince: 'Shawwal 1447',
        cloudSyncEnabled: true,
      },

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
      authModalOpen: false,
      dailyReflectionModalOpen: false,
      dailyReflections: getInitialReflections(),

      // Daily Taqwa & Quranic Reminder Scheduler
      dailyReminderConfig: {
        enabled: true,
        time: '21:30',
        contentType: 'both',
        soundEnabled: true,
        vibrate: true,
        lastTriggeredDate: undefined,
      },
      activeTaqwaReminder: null,
      reminderSchedulerModalOpen: false,

      // Dhikr Breath Pause
      breathPauseModalOpen: false,
      breathPausesCompleted: 0,

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

      setStreakDays: (days: number) => {
        const d = Math.max(0, days);
        const longest = Math.max(get().longestStreak, d);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([30, 40]);
          } catch {
            // ignore
          }
        }
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#A78BFA', '#F59E0B', '#10B981', '#DDD6FE'],
        });
        set({
          currentStreak: d,
          longestStreak: longest,
        });
      },

      setPartnerName: (name) => set({ partnerName: name }),
      setUserName: (name) => set((s) => ({ userName: name, userProfile: { ...s.userProfile, name } })),

      setAuthModalOpen: (open) => set({ authModalOpen: open }),

      login: (email: string, name?: string) => {
        const finalName = name?.trim() || email.split('@')[0] || 'Brother';
        set((s) => ({
          userName: finalName,
          userProfile: {
            ...s.userProfile,
            name: finalName,
            email: email.trim(),
            isLoggedIn: true,
            accountType: 'founder',
            cloudSyncEnabled: true,
          },
          authModalOpen: false,
        }));
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#A78BFA', '#F59E0B', '#10B981'],
        });
      },

      signup: (email: string, name: string) => {
        const finalName = name.trim() || 'Brother';
        set((s) => ({
          userName: finalName,
          userProfile: {
            name: finalName,
            email: email.trim(),
            isLoggedIn: true,
            accountType: 'standard',
            memberSince: 'Dhul Qi‘dah 1447',
            cloudSyncEnabled: true,
          },
          authModalOpen: false,
        }));
        confetti({
          particleCount: 85,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#10B981', '#F59E0B', '#A78BFA'],
        });
      },

      logout: () => {
        set((s) => ({
          userName: 'Guest Brother',
          userProfile: {
            name: 'Guest Brother',
            email: '',
            isLoggedIn: false,
            accountType: 'guest',
            cloudSyncEnabled: false,
          },
          authModalOpen: false,
        }));
      },

      setDailyReflectionModalOpen: (open) => set({ dailyReflectionModalOpen: open }),

      getTodayReflection: () => {
        const todayStr = new Date().toISOString().split('T')[0];
        return get().dailyReflections.find((r) => r.date === todayStr);
      },

      saveDailyReflection: (entryData) => {
        const existingIndex = get().dailyReflections.findIndex((r) => r.date === entryData.date);
        const newEntry: DailyReflectionEntry = {
          ...entryData,
          id: existingIndex >= 0 ? get().dailyReflections[existingIndex].id : `ref-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        let updatedReflections: DailyReflectionEntry[];
        if (existingIndex >= 0) {
          updatedReflections = [...get().dailyReflections];
          updatedReflections[existingIndex] = newEntry;
        } else {
          updatedReflections = [newEntry, ...get().dailyReflections];
        }

        // If marked clean day, also reinforce streak
        if (entryData.cleanDayLogged) {
          get().recordCleanDay();
        }

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 50, 40]);
          } catch {
            // ignore
          }
        }

        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#A78BFA', '#F59E0B', '#10B981', '#E0E7FF'],
        });

        set({
          dailyReflections: updatedReflections,
          dailyReflectionModalOpen: false,
        });
      },

      deleteDailyReflection: (id) => {
        set((s) => ({
          dailyReflections: s.dailyReflections.filter((r) => r.id !== id),
        }));
      },

      updateDailyReminderConfig: (config) => {
        set((s) => ({
          dailyReminderConfig: {
            ...s.dailyReminderConfig,
            ...config,
          },
        }));
      },

      setReminderSchedulerModalOpen: (open) => set({ reminderSchedulerModalOpen: open }),

      triggerScheduledReminder: (customReminder) => {
        const { dailyReminderConfig } = get();
        const reminder =
          customReminder || getDailyScheduledReminder(dailyReminderConfig.contentType);

        if (dailyReminderConfig.soundEnabled) {
          dhikrAmbientAudio.playNotificationChime();
        }

        if (
          dailyReminderConfig.vibrate &&
          typeof navigator !== 'undefined' &&
          'vibrate' in navigator
        ) {
          try {
            navigator.vibrate([120, 80, 120]);
          } catch {}
        }

        if (
          typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          try {
            new Notification(`Sitr: ${reminder.title}`, {
              body: `${reminder.text} — ${reminder.source}`,
              icon: '/vite.svg',
            });
          } catch {}
        }

        const todayStr = new Date().toISOString().split('T')[0];
        set({
          activeTaqwaReminder: reminder,
          dailyReminderConfig: {
            ...dailyReminderConfig,
            lastTriggeredDate: todayStr,
          },
        });
      },

      dismissTaqwaReminder: () => set({ activeTaqwaReminder: null }),

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
      setBreathPauseModalOpen: (open) => set({ breathPauseModalOpen: open }),
      incrementBreathPause: () =>
        set((s) => ({
          breathPausesCompleted: s.breathPausesCompleted + 1,
          dhikrSessionsCompletedToday: s.dhikrSessionsCompletedToday + 1,
        })),

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
        dailyReflections: state.dailyReflections,
        dailyReminderConfig: state.dailyReminderConfig,
        breathPausesCompleted: state.breathPausesCompleted,
      }),
    }
  )
);
