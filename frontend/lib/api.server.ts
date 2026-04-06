import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Habit, CheckIn, GetHabitsParams } from '@habit/shared';

const API_URL = process.env.BACKEND_API_URL;

async function serverFetch<T>(
  path: string,
  params?: Record<string, string | boolean | undefined>,
): Promise<T> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.jwt;

  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    let message = `API error: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function fetchHabits(params?: GetHabitsParams): Promise<Habit[]> {
  return serverFetch<Habit[]>('/habits', params as Record<string, string>);
}

export async function fetchHabit(id: string): Promise<Habit> {
  return serverFetch<Habit>(`/habits/${id}`);
}

export async function fetchCheckIns(habitId: string): Promise<CheckIn[]> {
  return serverFetch<CheckIn[]>(`/habits/${habitId}/checkins`);
}
