import { Module } from "@nestjs/common";
import { StateCheckerController } from "./state-checker.controller";

@Module({
  controllers: [StateCheckerController],
})
export class StateCheckerModule {}
