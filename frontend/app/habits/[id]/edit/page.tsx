import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchHabit } from '@/lib/api.server';
import { EditHabitPageClient } from '@/components/EditHabitPageClient/EditHabitPageClient';

interface EditHabitPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHabitPage({
  params,
}: EditHabitPageProps): Promise<React.ReactNode> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { id } = await params;

  let habit;

  try {
    habit = await fetchHabit(id);
  } catch (err) {
    const status = (err as { message?: string })?.message;
    if (status?.includes('404')) {
      notFound();
    }
    throw err;
  }

  return <EditHabitPageClient habit={habit} />;
}
