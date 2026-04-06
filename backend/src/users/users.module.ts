import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../common/prisma.service';
import { JwtAuthGuard } from '../common/guards';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
