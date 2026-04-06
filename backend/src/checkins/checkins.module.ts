import { Module } from '@nestjs/common';
import { CheckInsService } from './checkins.service';
import { CheckInsController } from './checkins.controller';
import { PrismaService } from '../common/prisma.service';
import { MilestonesModule } from '../milestones/milestones.module';
import { WsModule } from '../websocket/ws.module';
import { JwtAuthGuard } from '../common/guards';

@Module({
  imports: [MilestonesModule, WsModule],
  controllers: [CheckInsController],
  providers: [CheckInsService, PrismaService, JwtAuthGuard],
  exports: [CheckInsService],
})
export class CheckInsModule {}
