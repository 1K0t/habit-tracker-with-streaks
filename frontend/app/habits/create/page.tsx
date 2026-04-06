import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateHabitPageClient } from '@/components/CreateHabitPageClient/CreateHabitPageClient';

export default async function CreateHabitPage(): Promise<React.ReactNode> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return <CreateHabitPageClient />;
}
