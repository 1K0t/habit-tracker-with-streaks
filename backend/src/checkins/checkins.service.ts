import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { HabitStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { getTodayISO, toStartOfDay } from '../common/utils/date.utils';
import { calculateCurrentStreak } from '@habit/shared';
import { MilestonesService } from '../milestones/milestones.service';
import { WsGateway } from '../websocket/ws.gateway';
import type { CheckIn } from '@habit/shared';

@Injectable()
export class CheckInsService {
  private readonly logger = new Logger(CheckInsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly milestonesService: MilestonesService,
    private readonly wsGateway: WsGateway,
  ) {}

  async createToday(userId: string, habitId: string) {
    const habit = await this.findOwnedActiveHabit(userId, habitId);
    const todayDate = toStartOfDay(getTodayISO());

    const existing = await this.prisma.checkIn.findUnique({
      where: { habitId_date: { habitId, date: todayDate } },
    });

    if (existing) {
      throw new ConflictException('Already checked in today');
    }

    await this.prisma.checkIn.create({
      data: { habitId, date: todayDate },
    });
    this.logger.log(`Check-in created for habit ${habitId}`);

    // Calculate current streak after check-in
    const checkIns = await this.prisma.checkIn.findMany({
      where: { habitId },
    });

    const currentStreak = calculateCurrentStreak(checkIns.map((c) => c.date));
    this.logger.debug(`Current streak for habit ${habitId}: ${currentStreak}`);

    // Check milestones
    const milestoneTriggered = await this.milestonesService.checkAndLog(
      habitId,
      currentStreak,
    );

    if (milestoneTriggered) {
      this.wsGateway.sendMilestone(habit.userId, {
        type: 'milestone',
        habitId,
        milestone: milestoneTriggered,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      currentStreak,
      milestoneTriggered,
    };
  }

  async getForHabit(userId: string, habitId: string): Promise<CheckIn[]> {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const checkIns = await this.prisma.checkIn.findMany({
      where: { habitId },
      orderBy: { date: 'asc' },
    });

    return checkIns.map((c) => ({
      id: c.id,
      habitId: c.habitId,
      date: c.date.toISOString().split('T')[0],
    }));
  }

  async removeToday(userId: string, habitId: string) {
    await this.findOwnedActiveHabit(userId, habitId);
    const todayDate = toStartOfDay(getTodayISO());

    const existing = await this.prisma.checkIn.findUnique({
      where: { habitId_date: { habitId, date: todayDate } },
    });

    if (!existing) {
      throw new NotFoundException('No check-in found for today');
    }

    await this.prisma.checkIn.delete({
      where: { id: existing.id },
    });
    this.logger.log(`Check-in undone for habit ${habitId}`);

    return { success: true };
  }

  private async findOwnedActiveHabit(userId: string, habitId: string) {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (habit.status !== HabitStatus.ACTIVE) {
      throw new BadRequestException('Can only check in to active habits');
    }

    return habit;
  }
}
