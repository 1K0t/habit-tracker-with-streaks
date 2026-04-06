'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

interface TodayCheckInButtonProps {
  habitId: string;
  isCheckedInToday: boolean;
  onSuccess: (isCheckedIn: boolean) => void;
}

export function TodayCheckInButton({
  habitId,
  isCheckedInToday,
  onSuccess,
}: TodayCheckInButtonProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggleCheckIn(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      if (isCheckedInToday) {
        await apiClient.undoCheckInToday(habitId);
        onSuccess(false);
      } else {
        await apiClient.checkInToday(habitId);
        onSuccess(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update check-in';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleToggleCheckIn}
        disabled={isLoading}
        variant={isCheckedInToday ? 'default' : 'outline'}
        size="lg"
        className={cn(
          'transition-all',
          isCheckedInToday
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'text-slate-700 hover:bg-slate-100',
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {isCheckedInToday ? 'Undoing...' : 'Checking in...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {isCheckedInToday ? (
              <>
                <span>✓</span>
                <span>Checked in today</span>
              </>
            ) : (
              <span>Check in today</span>
            )}
          </span>
        )}
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
