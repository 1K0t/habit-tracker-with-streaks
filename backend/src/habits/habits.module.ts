import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { PrismaService } from '../common/prisma.service';
import { JwtAuthGuard } from '../common/guards';

@Module({
  controllers: [HabitsController],
  providers: [HabitsService, PrismaService, JwtAuthGuard],
  exports: [HabitsService],
})
export class HabitsModule {}
