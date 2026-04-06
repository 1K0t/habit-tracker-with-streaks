export interface MilestoneNotification {
  type: 'milestone';
  habitId: string;
  milestone: number;
  timestamp: string;
}
