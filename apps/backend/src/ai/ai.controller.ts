import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ImproveSummaryDto,
  ImproveBulletDto,
  SuggestSkillsDto,
  GenerateSummaryDto,
  ImproveSummaryResponseDto,
  ImproveBulletResponseDto,
  SuggestSkillsResponseDto,
  GenerateSummaryResponseDto,
  AIUsageResponseDto,
} from '../dto/ai.dto';

@ApiTags('ai')
@Controller('api/ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('improve-summary')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Improve professional summary' })
  @ApiResponse({
    status: 200,
    description: 'Summary improved successfully',
    type: ImproveSummaryResponseDto,
  })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async improveSummary(
    @CurrentUser() userId: string,
    @Body() dto: ImproveSummaryDto,
  ): Promise<ImproveSummaryResponseDto> {
    return this.aiService.improveSummary(userId, dto);
  }

  @Post('improve-bullet')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Improve a resume bullet point' })
  @ApiResponse({
    status: 200,
    description: 'Bullet point improved successfully',
    type: ImproveBulletResponseDto,
  })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async improveBullet(
    @CurrentUser() userId: string,
    @Body() dto: ImproveBulletDto,
  ): Promise<ImproveBulletResponseDto> {
    return this.aiService.improveBullet(userId, dto);
  }

  @Post('suggest-skills')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Suggest skills for a job title' })
  @ApiResponse({
    status: 200,
    description: 'Skills suggested successfully',
    type: SuggestSkillsResponseDto,
  })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async suggestSkills(
    @CurrentUser() userId: string,
    @Body() dto: SuggestSkillsDto,
  ): Promise<SuggestSkillsResponseDto> {
    return this.aiService.suggestSkills(userId, dto);
  }

  @Post('generate-summary')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Generate professional summary from experience' })
  @ApiResponse({
    status: 200,
    description: 'Summary generated successfully',
    type: GenerateSummaryResponseDto,
  })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async generateSummary(
    @CurrentUser() userId: string,
    @Body() dto: GenerateSummaryDto,
  ): Promise<GenerateSummaryResponseDto> {
    return this.aiService.generateSummary(userId, dto);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get AI usage for current user' })
  @ApiResponse({
    status: 200,
    description: 'Usage retrieved successfully',
    type: AIUsageResponseDto,
  })
  async getUsage(@CurrentUser() userId: string): Promise<AIUsageResponseDto> {
    return this.aiService.getUsage(userId);
  }
}
