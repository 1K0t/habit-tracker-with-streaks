'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { NotificationToaster } from './NotificationToaster';
import { ErrorBoundary } from './ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactNode {
  return (
    <SessionProvider>
      <ErrorBoundary name="root">
        {children}
        <NotificationToaster />
      </ErrorBoundary>
    </SessionProvider>
  );
}
