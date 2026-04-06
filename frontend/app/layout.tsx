import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your habits and build streaks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
