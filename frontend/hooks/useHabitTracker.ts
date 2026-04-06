'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Habit, MilestoneNotification } from '@habit/shared';
import { useWebsocket } from './useWebsocket';

interface UseHabitTrackerReturn {
  habits: Habit[];
  milestoneNotifications: MilestoneNotification[];
  refetch: () => void;
  wsConnected: boolean;
  acknowledgeMilestone: (milestoneId: string) => void;
}

export function useHabitTracker(initialHabits: Habit[]): UseHabitTrackerReturn {
  const router = useRouter();
  const { notifications, connected, acknowledge } = useWebsocket();

  const refetch = useCallback((): void => {
    router.refresh();
  }, [router]);

  return {
    habits: initialHabits,
    milestoneNotifications: notifications,
    refetch,
    wsConnected: connected,
    acknowledgeMilestone: acknowledge,
  };
}
