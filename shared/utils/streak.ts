import { CheckIn } from "../types/api/CheckIn";

export function calculateStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;

  const sorted = [...checkIns].sort((a, b) => a.date.localeCompare(b.date));

  let streak = 1;

  for (let i = sorted.length - 1; i > 0; i--) {
    const cur = new Date(sorted[i].date);
    const prev = new Date(sorted[i - 1].date);
    const diff = (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) streak++;
    else break;
  }

  return streak;
}
