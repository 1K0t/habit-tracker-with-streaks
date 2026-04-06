'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Habit, UpdateHabitDto } from '@habit/shared';
import { apiClient } from '@/lib/api';
import { EditHabitForm } from '@/components/EditHabitForm/EditHabitForm';

interface EditHabitPageClientProps {
  habit: Habit;
}

export function EditHabitPageClient({
  habit,
}: EditHabitPageClientProps): React.ReactNode {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  async function handleSubmit(dto: UpdateHabitDto): Promise<void> {
    setIsLoading(true);
    setSubmitError(undefined);
    try {
      await apiClient.updateHabit(habit.id, dto);
      router.push(`/habits/${habit.id}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to update habit. Please try again.';
      setSubmitError(message);
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit Habit</h1>
      {submitError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}
      <EditHabitForm
        initialValues={{ name: habit.name, description: habit.description }}
        cancelHref={`/habits/${habit.id}`}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
