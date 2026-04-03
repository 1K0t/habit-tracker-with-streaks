import { Module } from "@nestjs/common";
import { MilestonesService } from "./milestones.service";
import { PrismaService } from "../common/prisma.service";

@Module({
  providers: [MilestonesService, PrismaService],
  exports: [MilestonesService],
})
export class MilestonesModule {}
