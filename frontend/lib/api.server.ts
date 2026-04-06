import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Habit, GetHabitsParams } from "@habit/shared";

const API_URL = process.env.BACKEND_API_URL;

async function serverFetch<T>(
  path: string,
  params?: Record<string, string | boolean | undefined>
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
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchHabits(params?: GetHabitsParams): Promise<Habit[]> {
  return serverFetch<Habit[]>("/habits", params as Record<string, string>);
}

export async function fetchHabit(id: string): Promise<Habit> {
  return serverFetch<Habit>(`/habits/${id}`);
}
