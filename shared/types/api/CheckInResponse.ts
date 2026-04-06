export interface CheckInTodayResponse {
  success: boolean;
  currentStreak: number;
  milestoneTriggered: number | null;
}
