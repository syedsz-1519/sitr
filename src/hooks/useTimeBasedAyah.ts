import { useState, useEffect, useMemo, useCallback } from 'react';
import { AyahItem, AyahTheme } from '../types';
import rawAyahs from '../data/ayahs.json';

export interface TimeOfDayInfo {
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Late Night';
  slotLabel: string;
  timeRange: string;
  focusTheme: AyahTheme;
  themeLabel: string;
  icon: string;
  isHighRiskWindow: boolean;
  spiritualNote: string;
}

export function getTimeOfDayInfo(date: Date = new Date()): TimeOfDayInfo {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return {
      period: 'Morning',
      slotLabel: 'Dawn & Morning Awakening',
      timeRange: '05:00 – 11:59',
      focusTheme: 'dhikr',
      themeLabel: 'Dhikr & Morning Steadfastness',
      icon: '🌅',
      isHighRiskWindow: false,
      spiritualNote: 'Start your morning in Allah’s remembrance to build an impenetrable shield for the day.',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      period: 'Afternoon',
      slotLabel: 'Midday Focus & Public Life',
      timeRange: '12:00 – 16:59',
      focusTheme: 'self-control',
      themeLabel: 'Lowering the Gaze & Vigilance',
      icon: '☀️',
      isHighRiskWindow: false,
      spiritualNote: 'Maintain conscious awareness — guard your eyes and speech amidst daily routines.',
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      period: 'Evening',
      slotLabel: 'Evening Sakinah & Reflection',
      timeRange: '17:00 – 21:59',
      focusTheme: 'mercy',
      themeLabel: 'Mercy, Gratitude & Peace',
      icon: '🌆',
      isHighRiskWindow: false,
      spiritualNote: 'Wind down with Quranic comfort; reflect on the blessings and seek His forgiving mercy.',
    };
  } else {
    // 22:00 to 04:59 (Late night / Solitude danger zone)
    return {
      period: 'Late Night',
      slotLabel: 'Night Solitude & Vigilance Zone',
      timeRange: '22:00 – 04:59',
      focusTheme: 'self-control',
      themeLabel: 'Muraqabah & Resisting Solitude Triggers',
      icon: '🌙',
      isHighRiskWindow: true,
      spiritualNote: 'Danger window: screen solitude in the dark. Remember that Allah sees every pixel and breath.',
    };
  }
}

/**
 * Custom hook to fetch and rotate through curated ayahs from src/data/ayahs.json
 * based on the current time of day and natural spiritual intervals.
 */
export function useTimeBasedAyah() {
  const ayahsList: AyahItem[] = useMemo(() => {
    return (rawAyahs as any[]).map((a) => ({
      ...a,
      surahName: a.surahName || a.surah,
    }));
  }, []);

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Time of day info based on current time
  const timePeriod = useMemo(() => getTimeOfDayInfo(currentTime), [currentTime]);

  // Compute a deterministic base index based on day of the year + hour
  const calculateBaseIndex = useCallback((date: Date, list: AyahItem[]) => {
    if (!list.length) return 0;
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const hour = date.getHours();

    // Prioritize ayahs that match the current time period focus theme
    const currentInfo = getTimeOfDayInfo(date);
    const themedIndices = list
      .map((item, idx) => {
        const matches =
          item.theme === currentInfo.focusTheme ||
          (currentInfo.focusTheme === 'self-control' && (item.theme === 'self_control' as any)) ||
          (currentInfo.focusTheme === 'dhikr' && (item.theme === 'remembrance' as any));
        return matches ? idx : -1;
      })
      .filter((idx) => idx !== -1);

    if (themedIndices.length > 0) {
      // Pick a themed verse that rotates with the hour
      const slotIndex = (dayOfYear * 24 + hour) % themedIndices.length;
      return themedIndices[slotIndex];
    }

    // Fallback deterministic index across all 40
    return (dayOfYear * 7 + hour) % list.length;
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    calculateBaseIndex(new Date(), ayahsList)
  );

  // Timer to update current time every minute and check for period/hour change
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 60000); // every minute

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate ayah every 45 seconds if enabled
  useEffect(() => {
    if (!isAutoRotating || ayahsList.length <= 1) return;

    const rotateInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ayahsList.length);
    }, 45000); // 45 seconds

    return () => clearInterval(rotateInterval);
  }, [isAutoRotating, ayahsList.length]);

  const activeAyah: AyahItem = useMemo(() => {
    if (!ayahsList.length) {
      return {
        id: 'fallback',
        reference: 'Quran 96:14',
        arabic: 'أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَىٰ',
        translation: 'Does he not know that Allah sees?',
        theme: 'self-control',
      };
    }
    return ayahsList[currentIndex % ayahsList.length];
  }, [ayahsList, currentIndex]);

  const handleNextAyah = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ayahsList.length);
  }, [ayahsList.length]);

  const handlePrevAyah = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + ayahsList.length) % ayahsList.length);
  }, [ayahsList.length]);

  const handleRandomAyah = useCallback(() => {
    if (ayahsList.length <= 1) return;
    setCurrentIndex((prev) => {
      let next = Math.floor(Math.random() * ayahsList.length);
      if (next === prev) next = (next + 1) % ayahsList.length;
      return next;
    });
  }, [ayahsList.length]);

  const resetToCurrentTimePeriod = useCallback(() => {
    const now = new Date();
    setCurrentTime(now);
    setCurrentIndex(calculateBaseIndex(now, ayahsList));
  }, [calculateBaseIndex, ayahsList]);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => !prev);
  }, []);

  return {
    ayahs: ayahsList,
    activeAyah,
    currentAyahIndex: currentIndex,
    totalAyahs: ayahsList.length,
    timePeriod,
    handleNextAyah,
    handlePrevAyah,
    handleRandomAyah,
    resetToCurrentTimePeriod,
    isAutoRotating,
    toggleAutoRotate,
  };
}
