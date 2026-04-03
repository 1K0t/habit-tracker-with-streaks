import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
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
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { HabitsService } from "./habits.service";
import { JwtAuthGuard } from "../common/guards";
import { UserId } from "../common/decorators";
import { CreateHabitDto, UpdateHabitDto } from "@habit/shared";
import { HabitStatus } from "@prisma/client";
import {
  HabitResponseDto,
  CreateHabitBodyDto,
  UpdateHabitBodyDto,
  SuccessResponseDto,
} from "../common/dto/swagger.dto";

@ApiTags("habits")
@ApiBearerAuth()
@Controller("habits")
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new habit" })
  @ApiBody({ type: CreateHabitBodyDto })
  @ApiCreatedResponse({ description: "Habit created", type: HabitResponseDto })
  @ApiBadRequestResponse({ description: "Invalid data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async create(@UserId() userId: string, @Body() dto: CreateHabitDto) {
    return this.habitsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get list of habits for authenticated user" })
  @ApiOkResponse({
    description: "List returned",
    type: HabitResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search by habit name",
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["ACTIVE", "PAUSED", "ARCHIVED"],
  })
  @ApiQuery({
    name: "completedToday",
    required: false,
    description: "Filter by today's check-in (true/false)",
  })
  async findAll(
    @UserId() userId: string,
    @Query("search") search?: string,
    @Query("status") status?: HabitStatus,
    @Query("completedToday") completedToday?: string,
  ) {
    return this.habitsService.findAll(userId, {
      search,
      status,
      completedToday:
        completedToday !== undefined ? completedToday === "true" : undefined,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get habit by ID with streak info" })
  @ApiOkResponse({ description: "Habit returned", type: HabitResponseDto })
  @ApiNotFoundResponse({ description: "Habit not found" })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async findOne(@UserId() userId: string, @Param("id") id: string) {
    return this.habitsService.findOne(userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update habit fields" })
  @ApiBody({ type: UpdateHabitBodyDto })
  @ApiOkResponse({ description: "Habit updated", type: HabitResponseDto })
  @ApiBadRequestResponse({ description: "Cannot update an archived habit" })
  @ApiNotFoundResponse({ description: "Habit not found" })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async update(
    @UserId() userId: string,
    @Param("id") id: string,
    @Body() dto: UpdateHabitDto,
  ) {
    return this.habitsService.update(userId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a habit" })
  @ApiOkResponse({ description: "Habit deleted", type: SuccessResponseDto })
  @ApiNotFoundResponse({ description: "Habit not found" })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async remove(@UserId() userId: string, @Param("id") id: string) {
    await this.habitsService.remove(userId, id);
    return { success: true };
  }
}
