import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Habit, HabitStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import {
  CreateHabitDto,
  UpdateHabitDto,
  calculateCurrentStreak,
  calculateBestStreak,
} from '@habit/shared';

export interface HabitWithStreaks {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  startDate: Date;
  status: HabitStatus;
  currentStreak: number;
  bestStreak: number;
  totalCheckIns: number;
}

interface HabitFilters {
  search?: string;
  status?: HabitStatus;
  completedToday?: boolean;
}

@Injectable()
export class HabitsService {
  private readonly logger = new Logger(HabitsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateHabitDto): Promise<HabitWithStreaks> {
    const habit = await this.prisma.habit.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        startDate: new Date(dto.startDate),
        status: HabitStatus.ACTIVE,
      },
    });

    this.logger.log(`Habit created: ${habit.id} for user ${userId}`);
    return this.toHabitWithStreaks(habit, []);
  }

  async findAll(
    userId: string,
    filters: HabitFilters,
  ): Promise<HabitWithStreaks[]> {
    this.logger.log(`Listing habits for user ${userId}`);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const where: Record<string, unknown> = { userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    const habits = await this.prisma.habit.findMany({
      where,
      include: { checkIns: true },
      orderBy: { startDate: 'desc' },
    });

    let results = habits.map((h) => this.toHabitWithStreaks(h, h.checkIns));

    if (filters.completedToday !== undefined) {
      results = results.filter((h) => {
        const hasToday = habits
          .find((raw) => raw.id === h.id)
          ?.checkIns.some((c) => {
            const d = new Date(c.date);
            d.setUTCHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
          });
        return filters.completedToday ? hasToday : !hasToday;
      });
    }

    return results;
  }

  async findOne(userId: string, habitId: string): Promise<HabitWithStreaks> {
    this.logger.log(
      `Retrieving habit by id: "${habitId}" for user: "${userId}".`,
    );
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
      include: { checkIns: true },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.toHabitWithStreaks(habit, habit.checkIns);
  }

  async update(
    userId: string,
    habitId: string,
    dto: UpdateHabitDto,
  ): Promise<HabitWithStreaks> {
    this.logger.log(
      `Updating habit by id: "${habitId}" for user: "${userId}".`,
    );
    const habit = await this.findOwnedHabit(userId, habitId);

    if (habit.status === HabitStatus.ARCHIVED) {
      throw new BadRequestException('Cannot update an archived habit');
    }

    const updated = await this.prisma.habit.update({
      where: { id: habitId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status as HabitStatus }),
      },
      include: { checkIns: true },
    });

    this.logger.debug(`Habit updated: ${habitId} successfully.`);
    return this.toHabitWithStreaks(updated, updated.checkIns);
  }

  async remove(userId: string, habitId: string): Promise<void> {
    this.logger.log(
      `Removing habit by id: "${habitId}" for user: "${userId}".`,
    );
    await this.findOwnedHabit(userId, habitId);

    await this.prisma.habit.delete({
      where: { id: habitId },
    });
    this.logger.log(`Habit deleted: ${habitId}`);
  }

  private async findOwnedHabit(
    userId: string,
    habitId: string,
  ): Promise<Habit> {
    const habit = await this.prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    if (habit.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return habit;
  }

  private toHabitWithStreaks(
    habit: Habit,
    checkIns: { date: Date }[],
  ): HabitWithStreaks {
    const dates = checkIns.map((c) => c.date);
    return {
      id: habit.id,
      userId: habit.userId,
      name: habit.name,
      description: habit.description,
      startDate: habit.startDate,
      status: habit.status,
      currentStreak: calculateCurrentStreak(dates),
      bestStreak: calculateBestStreak(dates),
      totalCheckIns: checkIns.length,
    };
  }
}
