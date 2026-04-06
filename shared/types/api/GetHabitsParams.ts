import { HabitStatus } from "../domain";

export interface GetHabitsParams {
  search?: string;
  status?: HabitStatus;
  completedToday?: boolean;
}
