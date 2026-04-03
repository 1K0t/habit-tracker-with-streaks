export interface UpdateHabitDto {
  name?: string;
  description?: string;
  status?: "ACTIVE" | "PAUSED" | "ARCHIVED";
}
