import { Module } from "@nestjs/common";
import { CheckInsService } from "./checkins.service";
import { CheckInsController } from "./checkins.controller";
import { PrismaService } from "../common/prisma.service";
import { MilestonesModule } from "../milestones/milestones.module";
import { WsModule } from "../websocket/ws.module";

@Module({
  imports: [MilestonesModule, WsModule],
  controllers: [CheckInsController],
  providers: [CheckInsService, PrismaService],
  exports: [CheckInsService],
})
export class CheckInsModule {}
