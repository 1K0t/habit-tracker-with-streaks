'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HabitDetailError({
  error,
  reset,
}: ErrorProps): React.ReactNode {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center space-y-4">
        <h2 className="text-lg font-semibold text-red-800">
          Failed to load habit
        </h2>
        <p className="text-sm text-red-600">
          {error.message || 'Something went wrong. Please try again.'}
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/habits">Back to habits</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
