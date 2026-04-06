'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateHabitDto } from '@habit/shared';
import { apiClient } from '@/lib/api';
import { HabitForm } from '@/components/HabitForm/HabitForm';

export function CreateHabitPageClient(): React.ReactNode {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  async function handleSubmit(dto: CreateHabitDto): Promise<void> {
    setIsLoading(true);
    setSubmitError(undefined);
    try {
      await apiClient.createHabit(dto);
      router.push('/habits');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to create habit. Please try again.';
      setSubmitError(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Create New Habit
      </h1>
      {submitError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}
      <HabitForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
