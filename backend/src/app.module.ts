import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HabitsModule } from './habits/habits.module';
import { CheckInsModule } from './checkins/checkins.module';
import { MilestonesModule } from './milestones/milestones.module';
import { WsModule } from './websocket/ws.module';
import { StateCheckerModule } from './common/state-checker/state-checker.module';
import { RateLimitMiddleware } from './common/decorators/rate-limit.decorator';

@Module({
  imports: [
    StateCheckerModule,
    AuthModule,
    UsersModule,
    HabitsModule,
    CheckInsModule,
    MilestonesModule,
    WsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
