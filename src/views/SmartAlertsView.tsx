import React, { useEffect, useState } from 'react';
import { Bell, Clock, Compass, RefreshCw, CheckCircle2, ShieldCheck, Moon } from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';

export const SmartAlertsView: React.FC = () => {
  const {
    alerts,
    toggleAlert,
    prayerTimes,
    prayerTimesLoading,
    fetchPrayerTimes,
    salahLock,
    toggleSalahLock,
  } = useSitrStore();

  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setNotificationPermission(result);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          <h1 className="text-lg font-bold text-white">Smart Alerts & Prayer Times</h1>
        </div>
        <p className="text-xs text-purple-200/70 mt-0.5">
          Dynamic notifications linked to Islamic prayer times and vulnerable circadian windows.
        </p>
      </div>

      {/* Notification Status Banner */}
      <div className="rounded-2xl bg-[#170F26] border border-purple-900/30 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-300">
            <Bell className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Device Push Notifications</span>
            <span className="text-[10px] text-purple-300/70 font-metric">
              Status:{' '}
              <strong className="text-amber-300 capitalize">{notificationPermission}</strong>
            </span>
          </div>
        </div>

        {notificationPermission !== 'granted' ? (
          <button
            onClick={handleRequestPermission}
            className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold font-metric transition-colors"
          >
            Allow
          </button>
        ) : (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold font-metric">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active</span>
          </div>
        )}
      </div>

      {/* Live Prayer Times Card via Aladhan API */}
      <div className="rounded-2xl bg-[#170F26] border border-purple-900/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase font-metric tracking-wider">
              Prayer Times Sync (Aladhan API)
            </h2>
          </div>
          <button
            onClick={() => fetchPrayerTimes()}
            disabled={prayerTimesLoading}
            className="text-[10px] uppercase font-metric text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${prayerTimesLoading ? 'animate-spin' : ''}`} />
            <span>{prayerTimesLoading ? 'Syncing...' : 'Sync Timings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#10081C] border border-purple-900/40 text-center">
            <span className="text-[10px] text-purple-300/70 font-metric block">Fajr</span>
            <span className="text-xs font-bold text-white font-metric mt-0.5 block">
              {prayerTimes.Fajr}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#10081C] border border-purple-900/40 text-center">
            <span className="text-[10px] text-purple-300/70 font-metric block">Dhuhr</span>
            <span className="text-xs font-bold text-white font-metric mt-0.5 block">
              {prayerTimes.Dhuhr}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#10081C] border border-purple-900/40 text-center">
            <span className="text-[10px] text-purple-300/70 font-metric block">Asr</span>
            <span className="text-xs font-bold text-white font-metric mt-0.5 block">
              {prayerTimes.Asr}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#10081C] border border-purple-900/40 text-center">
            <span className="text-[10px] text-purple-300/70 font-metric block">Maghrib</span>
            <span className="text-xs font-bold text-white font-metric mt-0.5 block">
              {prayerTimes.Maghrib}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#10081C] border border-purple-900/40 text-center">
            <span className="text-[10px] text-purple-300/70 font-metric block">Isha</span>
            <span className="text-xs font-bold text-white font-metric mt-0.5 block">
              {prayerTimes.Isha}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#10081C] border border-purple-900/40 text-center">
            <span className="text-[10px] text-purple-300/70 font-metric block">Sunrise</span>
            <span className="text-xs font-bold text-amber-300 font-metric mt-0.5 block">
              {prayerTimes.Sunrise}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-purple-400 font-metric">
          <span>Location: {prayerTimes.city || 'Mecca / Auto Geo'}</span>
          {prayerTimes.lastUpdated && <span>Updated: {prayerTimes.lastUpdated}</span>}
        </div>
      </div>

      {/* Suggested Smart Alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-white uppercase font-metric tracking-wider">
            Circadian Spiritual Alerts
          </span>
          <span className="text-[10px] text-purple-300/70 font-metric">
            Adaptive timing
          </span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-[#170F26] border border-purple-900/30 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{alert.title}</span>
                  <span className="text-[10px] font-metric px-2 py-0.5 rounded-full bg-purple-950 text-amber-300 font-semibold border border-purple-800/40">
                    {alert.time}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  {alert.description}
                </p>
                <span className="text-[10px] text-purple-400 font-metric block pt-0.5">
                  Trigger: {alert.prayerRelation}
                </span>
              </div>

              <button
                onClick={() => toggleAlert(alert.id)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 mt-1 ${
                  alert.enabled ? 'bg-purple-600' : 'bg-zinc-800'
                }`}
                type="button"
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    alert.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Ayah */}
      <div className="p-5 rounded-2xl bg-[#170F26] border border-purple-900/40 text-center space-y-1.5">
        <p className="font-arabic text-xl text-white font-bold leading-loose" dir="rtl">
          حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ
        </p>
        <p className="text-xs text-purple-200 italic font-sans">
          “Maintain with care the [obligatory] prayers and [in particular] the middle prayer and stand before Allah, devoutly obedient.”
        </p>
        <span className="text-[10px] text-purple-400/80 font-metric block">
          — Surah Al-Baqarah (Quran 2:238)
        </span>
      </div>
    </div>
  );
};
