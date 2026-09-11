import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  RotateCcw,
  BookOpen,
  ShieldAlert,
} from 'lucide-react';
import { useSitrStore } from '../store/useSitrStore';
import { ReminderContentType } from '../types';
import { getDailyScheduledReminder, getRandomReminder } from '../data/taqwaReminders';
import { dhikrAmbientAudio } from '../utils/ambientAudioEngine';

export const DailyNotificationSchedulerModal: React.FC = () => {
  const {
    dailyReminderConfig,
    updateDailyReminderConfig,
    reminderSchedulerModalOpen,
    setReminderSchedulerModalOpen,
    triggerScheduledReminder,
  } = useSitrStore();

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [previewReminder, setPreviewReminder] = useState(() =>
    getDailyScheduledReminder(dailyReminderConfig.contentType)
  );
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [reminderSchedulerModalOpen]);

  // Update preview when contentType changes
  useEffect(() => {
    setPreviewReminder(getDailyScheduledReminder(dailyReminderConfig.contentType));
  }, [dailyReminderConfig.contentType]);

  if (!reminderSchedulerModalOpen) return null;

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

  const handleTestChime = () => {
    dhikrAmbientAudio.playNotificationChime();
  };

  const handleSendTestReminder = () => {
    setTestSent(true);
    triggerScheduledReminder(previewReminder);
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleShufflePreview = () => {
    setPreviewReminder(getRandomReminder(dailyReminderConfig.contentType));
  };

  // Convert "HH:MM" 24h to 12h display
  const formatTime12h = (time24: string) => {
    const [hStr, mStr] = time24.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return time24;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const PRESETS = [
    { label: 'Fajr Awakening', time: '05:30', note: 'Start day with Taqwa' },
    { label: 'Morning Guard', time: '09:00', note: 'Protect focus at work' },
    { label: 'Midday Reset', time: '14:30', note: 'Post-Dhuhr recharge' },
    { label: 'Evening Muhasabah', time: '21:30', note: 'Nightly self-reckoning' },
    { label: 'Night Sanctuary', time: '23:00', note: 'Shield before sleep' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0D3827] via-[#082318] to-[#04140E] border border-amber-500/35 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/20 flex items-center justify-between bg-[#061D14]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-50">Daily Taqwa Scheduler</h2>
                <span className="text-[10px] font-metric px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                  {dailyReminderConfig.enabled ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Automated daily inspirational Taqwa prompt & Quranic reminder
              </p>
            </div>
          </div>

          <button
            onClick={() => setReminderSchedulerModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Toggle Switch */}
          <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/20 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-amber-50 block">Enable Daily Notification</span>
              <span className="text-xs text-emerald-200/70">
                Trigger daily reminder at {formatTime12h(dailyReminderConfig.time)} automatically
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                updateDailyReminderConfig({ enabled: !dailyReminderConfig.enabled })
              }
              className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center shrink-0 ${
                dailyReminderConfig.enabled ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  dailyReminderConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Time Picker Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-100 uppercase font-metric tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Scheduled Time of Day</span>
              </label>
              <span className="text-xs font-metric font-bold text-amber-300 bg-[#04160F] px-2.5 py-1 rounded-lg border border-amber-500/30">
                {formatTime12h(dailyReminderConfig.time)} ({dailyReminderConfig.time})
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={dailyReminderConfig.time}
                  onChange={(e) => updateDailyReminderConfig({ time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#03110B] border border-amber-500/40 text-amber-50 font-metric text-lg font-bold focus:outline-none focus:border-amber-400 text-center"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[10px] uppercase font-metric text-amber-300/80 font-semibold block mb-2">
                  Recommended Spiritual Windows
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.time}
                      type="button"
                      onClick={() => updateDailyReminderConfig({ time: p.time })}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        dailyReminderConfig.time === p.time
                          ? 'bg-amber-500/25 border-amber-400 text-white shadow-sm'
                          : 'bg-[#04160F] border-amber-500/15 text-emerald-200/80 hover:border-amber-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-metric text-amber-300">{formatTime12h(p.time)}</span>
                        {dailyReminderConfig.time === p.time && (
                          <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-200/70 block truncate mt-0.5">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Preference Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-amber-100 uppercase font-metric tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prompt Inspiration Theme</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both', label: 'Both (Alternating)', desc: 'Quran & Taqwa wisdoms' },
                { id: 'taqwa', label: 'Taqwa Inspirations', desc: 'Inner restraint & nafs' },
                { id: 'quran', label: 'Quranic Prompts', desc: 'Ayahs of contemplation' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    updateDailyReminderConfig({
                      contentType: type.id as ReminderContentType,
                    })
                  }
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    dailyReminderConfig.contentType === type.id
                      ? 'bg-emerald-800/40 border-amber-400 text-amber-50 shadow-md'
                      : 'bg-[#061D14] border-amber-500/20 text-emerald-200/70 hover:bg-[#0A2D1F]'
                  }`}
                >
                  <span className="text-xs font-bold block text-amber-300">{type.label}</span>
                  <span className="text-[10px] text-emerald-200/60 block mt-1 leading-snug">
                    {type.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound, Haptics & Notification Permission Settings */}
          <div className="p-4 rounded-2xl bg-[#061D14] border border-amber-500/20 space-y-3">
            <span className="text-[11px] font-bold text-amber-100 uppercase font-metric tracking-wider block">
              Audio & Device Triggers
            </span>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                {dailyReminderConfig.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                )}
                <div>
                  <span className="text-xs font-semibold text-amber-50 block">Serene Two-Tone Chime</span>
                  <span className="text-[10px] text-emerald-200/60">Gentle acoustic tone on alert</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestChime}
                  className="px-2 py-1 rounded-lg bg-[#04160F] text-amber-300 hover:text-white border border-amber-500/30 text-[10px] font-metric flex items-center gap-1 transition-colors"
                  title="Test Sound"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Hear</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateDailyReminderConfig({
                      soundEnabled: !dailyReminderConfig.soundEnabled,
                    })
                  }
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                    dailyReminderConfig.soundEnabled ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      dailyReminderConfig.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-500/15">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-amber-50 block">Gentle Vibration</span>
                  <span className="text-[10px] text-emerald-200/60">Haptic pulse on mobile devices</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateDailyReminderConfig({
                    vibrate: !dailyReminderConfig.vibrate,
                  })
                }
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                  dailyReminderConfig.vibrate ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    dailyReminderConfig.vibrate ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Browser Permission Status */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-500/15">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-amber-50 block">System Push Alerts</span>
                  <span className="text-[10px] text-emerald-200/60 font-metric">
                    Permission: <strong className="text-amber-300 capitalize">{notificationPermission}</strong>
                  </span>
                </div>
              </div>

              {notificationPermission !== 'granted' ? (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3 py-1 rounded-full bg-emerald-700 hover:bg-emerald-600 text-amber-100 text-[11px] font-semibold font-metric transition-colors"
                >
                  Enable
                </button>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-metric font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Granted</span>
                </div>
              )}
            </div>
          </div>

          {/* Today's Scheduled Prompt Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-100 uppercase font-metric tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Today's Prompt Preview</span>
              </span>
              <button
                type="button"
                onClick={handleShufflePreview}
                className="text-[10px] text-amber-400 hover:text-amber-200 flex items-center gap-1 font-metric"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Shuffle Sample</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#04160F] border border-amber-500/30 relative overflow-hidden space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">{previewReminder.title}</span>
                <span className="text-[9px] font-metric uppercase px-2 py-0.5 rounded-full bg-[#082318] text-amber-200 border border-amber-500/30">
                  {previewReminder.type}
                </span>
              </div>

              {previewReminder.arabic && (
                <p className="font-arabic text-xl text-amber-300 leading-relaxed text-center drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" dir="rtl">
                  {previewReminder.arabic}
                </p>
              )}

              <p className="text-xs text-amber-50 italic leading-relaxed font-serif">
                “{previewReminder.text}”
              </p>

              <span className="text-[10px] text-emerald-300 font-metric block">
                — {previewReminder.source}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-amber-500/20 bg-[#061D14]/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSendTestReminder}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#04160F] hover:bg-[#0C3323] text-amber-200 hover:text-white border border-amber-500/30 text-xs font-semibold font-metric flex items-center justify-center gap-2 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{testSent ? 'Reminder Fired!' : 'Test Reminder Now'}</span>
          </button>

          <button
            type="button"
            onClick={() => setReminderSchedulerModalOpen(false)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-metric transition-colors shadow-lg shadow-amber-500/20"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
