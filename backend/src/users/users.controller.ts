import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards';
import { UserId } from '../common/decorators';
import { UserProfileDto } from '../common/dto/swagger.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ description: 'User profile returned', type: UserProfileDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getMe(@UserId() userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  }
}
