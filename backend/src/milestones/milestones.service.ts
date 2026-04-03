import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

const MILESTONES = [3, 7, 30];

@Injectable()
export class MilestonesService {
  private readonly logger = new Logger(MilestonesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkAndLog(
    habitId: string,
    currentStreak: number,
  ): Promise<number | null> {
    this.logger.debug(
      `Checking milestones for habit ${habitId}, streak: ${currentStreak}`,
    );

    for (const milestone of MILESTONES) {
      if (currentStreak >= milestone) {
        const alreadyLogged = await this.prisma.milestoneLog.findUnique({
          where: { habitId_milestone: { habitId, milestone } },
        });

        if (!alreadyLogged) {
          await this.prisma.milestoneLog.create({
            data: { habitId, milestone },
          });
          this.logger.log(
            `Milestone ${milestone}-day achieved for habit ${habitId}`,
          );
          return milestone;
        }
      }
    }

    return null;
  }
}
