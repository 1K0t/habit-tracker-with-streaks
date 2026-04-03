import { Controller, Post, Delete, Param, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiParam,
} from "@nestjs/swagger";
import { CheckInsService } from "./checkins.service";
import { JwtAuthGuard } from "../common/guards";
import { UserId } from "../common/decorators";
import {
  CheckInTodayResponseDto,
  SuccessResponseDto,
} from "../common/dto/swagger.dto";

@ApiTags("check-ins")
@ApiBearerAuth()
@Controller("habits/:habitId/checkins")
@UseGuards(JwtAuthGuard)
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Post("today")
  @ApiOperation({ summary: "Check in habit for today" })
  @ApiParam({ name: "habitId", description: "Habit ID" })
  @ApiCreatedResponse({
    description: "Check-in added",
    type: CheckInTodayResponseDto,
  })
  @ApiBadRequestResponse({ description: "Habit is paused or archived" })
  @ApiConflictResponse({ description: "Already checked in today" })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async createToday(
    @UserId() userId: string,
    @Param("habitId") habitId: string,
  ) {
    return this.checkInsService.createToday(userId, habitId);
  }

  @Delete("today")
  @ApiOperation({ summary: "Undo today's check-in" })
  @ApiParam({ name: "habitId", description: "Habit ID" })
  @ApiOkResponse({ description: "Check-in removed", type: SuccessResponseDto })
  @ApiNotFoundResponse({ description: "No check-in found for today" })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async removeToday(
    @UserId() userId: string,
    @Param("habitId") habitId: string,
  ) {
    return this.checkInsService.removeToday(userId, habitId);
  }
}
