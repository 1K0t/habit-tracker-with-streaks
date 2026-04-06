"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Habit } from "@habit/shared";

interface UseHabitsReturn {
  habits: Habit[];
  refetch: () => void;
}

export function useHabits(initialHabits: Habit[]): UseHabitsReturn {
  const router = useRouter();

  const refetch = useCallback((): void => {
    router.refresh();
  }, [router]);

  return { habits: initialHabits, refetch };
}
