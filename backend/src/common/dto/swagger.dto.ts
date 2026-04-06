import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ── Request DTOs ──────────────────────────────────────────────

export class CreateHabitBodyDto {
  @ApiProperty({ example: 'Drink Water' })
  name: string;

  @ApiPropertyOptional({ example: '8 glasses per day' })
  description?: string;

  @ApiProperty({ example: '2026-04-03' })
  startDate: string;
}

export class UpdateHabitBodyDto {
  @ApiPropertyOptional({ example: 'Drink Water' })
  name?: string;

  @ApiPropertyOptional({ example: '8 glasses per day' })
  description?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'PAUSED', 'ARCHIVED'] })
  status?: string;
}

// ── Response DTOs ─────────────────────────────────────────────

export class HabitResponseDto {
  @ApiProperty({ example: 'clxyz123' })
  id: string;

  @ApiProperty({ example: 'user_456' })
  userId: string;

  @ApiProperty({ example: 'Drink Water' })
  name: string;

  @ApiPropertyOptional({ example: '8 glasses per day' })
  description: string | null;

  @ApiProperty({ example: '2026-04-03T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ enum: ['ACTIVE', 'PAUSED', 'ARCHIVED'], example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 5 })
  currentStreak: number;

  @ApiProperty({ example: 12 })
  bestStreak: number;

  @ApiProperty({ example: 20 })
  totalCheckIns: number;
}

export class CheckInTodayResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 3 })
  currentStreak: number;

  @ApiProperty({
    example: 3,
    nullable: true,
    description: '3, 7, or 30 — null if no milestone',
  })
  milestoneTriggered: number | null;
}

export class UserProfileDto {
  @ApiProperty({ example: 'user_456' })
  id: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  name: string | null;

  @ApiPropertyOptional({ example: 'john@example.com' })
  email: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  image: string | null;
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 'BAD_REQUEST' })
  error: string;

  @ApiProperty({ example: 'Invalid input data' })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: '2026-04-06T10:00:00.000Z' })
  timestamp: string;
}
