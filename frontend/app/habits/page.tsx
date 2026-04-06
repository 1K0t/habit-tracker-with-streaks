import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Habit } from "@habit/shared";
import { authOptions } from "@/lib/auth";
import { fetchHabits } from "@/lib/api.server";
import { HabitsPageClient } from "@/components/HabitsPageClient/HabitsPage";

export default async function HabitsPage(): Promise<React.ReactNode> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  let initialHabits: Habit[] = [];
  let error: string | undefined;

  try {
    initialHabits = await fetchHabits();
  } catch {
    error = "Failed to load habits. Please try again later.";
  }

  return <HabitsPageClient initialHabits={initialHabits} error={error} />;
}
