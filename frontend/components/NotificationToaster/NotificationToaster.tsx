'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebsocket } from '@/hooks/useWebsocket';
import type { MilestoneNotification } from '@habit/shared';

interface ToastMessage {
  id: string;
  notification: MilestoneNotification;
  expiresAt: number;
}

export function NotificationToaster(): React.ReactNode {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const acknowledgeRef = useRef<(milestoneId: string) => void>(() => {});

  const handleNotification = useCallback(
    (notification: MilestoneNotification): void => {
      const toastId = `${notification.habitId}-${notification.milestone}`;
      const expiresAt = Date.now() + 5000;

      setToasts((prev) => {
        if (prev.some((t) => t.id === toastId)) {
          return prev;
        }
        return [...prev, { id: toastId, notification, expiresAt }];
      });

      acknowledgeRef.current(notification.habitId);
    },
    [],
  );

  const { acknowledge } = useWebsocket({ onNotification: handleNotification });
  useEffect(() => {
    acknowledgeRef.current = acknowledge;
  }, [acknowledge]);

  // Remove expired toasts
  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((prev) => prev.filter((toast) => Date.now() < toast.expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMilestoneMessage = (milestone: number): string => {
    if (milestone === 3) return '🔥 3-Day Streak!';
    if (milestone === 7) return '🌟 7-Day Streak!';
    if (milestone === 30) return '🏆 30-Day Streak!';
    return `🎉 ${milestone}-Day Streak!`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top fade-in pointer-events-auto"
        >
          <p className="font-semibold text-sm">
            {getMilestoneMessage(toast.notification.milestone)}
          </p>
          <p className="text-xs opacity-90">Keep it up! 💪</p>
        </div>
      ))}
    </div>
  );
}
