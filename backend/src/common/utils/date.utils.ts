export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function toStartOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}
