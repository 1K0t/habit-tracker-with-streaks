import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchHabit, fetchCheckIns } from "@/lib/api.server";
import { HabitDetails } from "@/components/HabitDetails/HabitDetails";
import { isToday } from "@habit/shared";

interface HabitDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HabitDetailPage({
  params,
}: HabitDetailPageProps): Promise<React.ReactNode> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const { id } = await params;

  let habit;
  let checkIns;

  try {
    [habit, checkIns] = await Promise.all([
      fetchHabit(id),
      fetchCheckIns(id),
    ]);
  } catch (err) {
    const status = (err as { message?: string })?.message;
    if (status?.includes("404")) {
      notFound();
    }
    throw err;
  }

  const isCheckedInToday = checkIns.some((c) => isToday(c.date));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <HabitDetails
        habit={habit}
        checkIns={checkIns}
        isCheckedInToday={isCheckedInToday}
      />
    </div>
  );
}
