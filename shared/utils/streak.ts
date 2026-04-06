function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function calculateCurrentStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates]
    .map((d) => normalizeDate(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = normalizeDate(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Streak must include today or yesterday to be "current"
  if (
    sorted[0].getTime() !== today.getTime() &&
    sorted[0].getTime() !== yesterday.getTime()
  ) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const diff =
      (sorted[i].getTime() - sorted[i + 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates]
    .map((d) => normalizeDate(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
      if (current > best) best = current;
    } else if (diff > 1) {
      current = 1;
    }
  }

  return best;
}
