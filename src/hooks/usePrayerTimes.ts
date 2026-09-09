import { useState, useEffect, useCallback, useMemo } from 'react';

export interface PrayerTimeItem {
  name: 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  arabicName: string;
  time: string; // e.g. "05:12" (24h) or "5:12 AM"
  timestamp: number; // epoch ms today
  isNext: boolean;
}

export interface UpcomingPrayerInfo {
  name: string;
  arabicName: string;
  formattedTime: string;
  countdown: string;
  minutesRemaining: number;
  isApproachingSoon: boolean; // < 20 mins
}

const PRAYER_ARABIC: Record<string, string> = {
  Fajr: 'الفَجْر',
  Sunrise: 'الشُّرُوق',
  Dhuhr: 'الظُّهْر',
  Asr: 'العَصْر',
  Maghrib: 'المَغْرِب',
  Isha: 'العِشَاء',
};

const DEFAULT_FALLBACK_TIMINGS = {
  Fajr: '05:12',
  Sunrise: '06:34',
  Dhuhr: '12:20',
  Asr: '15:45',
  Maghrib: '18:18',
  Isha: '19:48',
};

export function usePrayerTimes() {
  const [timings, setTimings] = useState<Record<string, string>>(DEFAULT_FALLBACK_TIMINGS);
  const [cityLabel, setCityLabel] = useState<string>('Local Time');
  const [hijriDate, setHijriDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(() => new Date());

  const fetchTimings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Determine user's local timezone
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Riyadh';
      
      // Attempt to fetch from Aladhan API using current timestamp & timezone
      const timestamp = Math.floor(Date.now() / 1000);
      const url = `https://api.aladhan.com/v1/timings/${timestamp}?timezonestring=${encodeURIComponent(
        timeZone
      )}&method=4`;

      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.timings) {
          setTimings(json.data.timings);
          const cleanTz = timeZone.split('/').pop()?.replace(/_/g, ' ') || 'Local';
          setCityLabel(cleanTz);

          if (json.data.date?.hijri) {
            const h = json.data.date.hijri;
            setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
          }
        }
      }
    } catch {
      // Fallback silently if offline or blocked by adblockers
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimings();
  }, [fetchTimings]);

  // Keep internal clock ticking every 30s for smooth countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute next prayer
  const upcomingPrayer: UpcomingPrayerInfo = useMemo(() => {
    const prayersToCheck: Array<'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'> = [
      'Fajr',
      'Dhuhr',
      'Asr',
      'Maghrib',
      'Isha',
    ];

    const currentHours = now.getHours();
    const currentMins = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMins;

    // Convert prayer timing string "HH:MM" (e.g. "05:12" or "05:12 (EEST)") to minutes from midnight
    const parseTimeToMinutes = (timeStr?: string): number => {
      if (!timeStr) return 0;
      const clean = timeStr.split(' ')[0]; // remove timezone tag if any
      const [h, m] = clean.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    let nextPrayerName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | null = null;
    let nextMinutes = 0;

    for (const prayer of prayersToCheck) {
      const pMins = parseTimeToMinutes(timings[prayer]);
      if (pMins > currentTotalMinutes) {
        nextPrayerName = prayer;
        nextMinutes = pMins - currentTotalMinutes;
        break;
      }
    }

    // If all prayers today have passed, next prayer is tomorrow's Fajr
    if (!nextPrayerName) {
      nextPrayerName = 'Fajr';
      const fajrMins = parseTimeToMinutes(timings['Fajr']);
      const minutesUntilMidnight = 24 * 60 - currentTotalMinutes;
      nextMinutes = minutesUntilMidnight + fajrMins;
    }

    // Format countdown string
    const hoursRem = Math.floor(nextMinutes / 60);
    const minsRem = nextMinutes % 60;
    let countdownStr = '';
    if (hoursRem > 0) {
      countdownStr = `in ${hoursRem}h ${minsRem}m`;
    } else {
      countdownStr = `in ${minsRem}m`;
    }

    // Format 12-hour display time
    const rawTime = timings[nextPrayerName] ? timings[nextPrayerName].split(' ')[0] : '05:00';
    const [hNum, mNum] = rawTime.split(':').map(Number);
    const period = (hNum || 0) >= 12 ? 'PM' : 'AM';
    const hour12 = (hNum || 0) % 12 || 12;
    const formattedTime = `${hour12}:${String(mNum || 0).padStart(2, '0')} ${period}`;

    return {
      name: nextPrayerName,
      arabicName: PRAYER_ARABIC[nextPrayerName] || nextPrayerName,
      formattedTime,
      countdown: countdownStr,
      minutesRemaining: nextMinutes,
      isApproachingSoon: nextMinutes <= 25,
    };
  }, [timings, now]);

  return {
    upcomingPrayer,
    timings,
    cityLabel,
    hijriDate,
    isLoading,
    refreshPrayerTimes: fetchTimings,
  };
}
