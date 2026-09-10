import React, { useEffect } from 'react';
import { useSitrStore } from '../store/useSitrStore';
import { ActiveTaqwaReminderAlert } from './ActiveTaqwaReminderAlert';
import { DailyNotificationSchedulerModal } from './DailyNotificationSchedulerModal';
import { ExtendedView } from '../types';

interface DailyNotificationRunnerProps {
  onNavigate?: (view: ExtendedView) => void;
}

export const DailyNotificationRunner: React.FC<DailyNotificationRunnerProps> = ({ onNavigate }) => {
  const {
    dailyReminderConfig,
    triggerScheduledReminder,
  } = useSitrStore();

  useEffect(() => {
    // Check scheduler every 15 seconds
    const checkSchedule = () => {
      if (!dailyReminderConfig.enabled) return;

      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${h}:${m}`;
      const todayStr = now.toISOString().split('T')[0];

      // If matches time and has not already triggered today
      if (currentTime === dailyReminderConfig.time && dailyReminderConfig.lastTriggeredDate !== todayStr) {
        triggerScheduledReminder();
      }
    };

    // Initial check
    checkSchedule();

    const intervalId = setInterval(checkSchedule, 15000);
    return () => clearInterval(intervalId);
  }, [dailyReminderConfig, triggerScheduledReminder]);

  return (
    <>
      {/* Active In-App Reminder Overlay when triggered */}
      <ActiveTaqwaReminderAlert onNavigate={onNavigate} />

      {/* Configuration & Schedule Settings Modal */}
      <DailyNotificationSchedulerModal />
    </>
  );
};
