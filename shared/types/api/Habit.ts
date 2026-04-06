import { HabitStatus } from '../domain';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string;
  status: HabitStatus;

  // computed fields from backend
  currentStreak: number;
  bestStreak: number;
  totalCheckIns: number;
}
