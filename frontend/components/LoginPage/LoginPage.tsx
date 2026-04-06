'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2 mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Habit Tracker</h1>
          <p className="text-slate-500">
            Track your habits, build streaks, stay consistent.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            className="w-full cursor-pointer hover:bg-slate-700 hover:text-white transition-colors"
            onClick={() => signIn('google', { callbackUrl: '/habits' })}
          >
            Sign in with Google
          </Button>

          <div className="flex items-center gap-3">
            <hr className="flex-1" style={{ borderTop: '1px solid #e2e8f0' }} />
            <span className="text-sm text-slate-400">or</span>
            <hr className="flex-1" style={{ borderTop: '1px solid #e2e8f0' }} />
          </div>

          <Button
            variant="outline"
            className="w-full cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => signIn('github', { callbackUrl: '/habits' })}
          >
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
