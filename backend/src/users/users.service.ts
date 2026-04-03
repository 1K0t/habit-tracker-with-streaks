import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string): Promise<User> {
    this.logger.debug(`Looking up user ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
