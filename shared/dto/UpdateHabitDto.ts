import { HabitStatus } from "../types/domain";

export interface UpdateHabitDto {
  name?: string;
  description?: string;
  status?: HabitStatus;
}
