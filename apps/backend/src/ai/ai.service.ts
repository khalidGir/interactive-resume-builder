import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HuggingFaceService } from './huggingface.service';
import { User, UserPlan } from '../entities/user.entity';
import { AIUsage, AIFeature } from '../entities/ai-usage.entity';
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

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly FREE_TIER_LIMIT = 5;

  constructor(
    private configService: ConfigService,
    private huggingFaceService: HuggingFaceService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AIUsage)
    private aiUsageRepository: Repository<AIUsage>,
  ) {}

  async improveSummary(
    userId: string,
    dto: ImproveSummaryDto,
  ): Promise<ImproveSummaryResponseDto> {
    // Check rate limit
    await this.checkAndTrackUsage(userId, 'improve_summary', dto.summary);

    // TODO: Implement actual AI improvement logic
    // For now, return mock response
    const improved = `Experienced ${dto.jobTitle || 'professional'} with a proven track record of delivering exceptional results. ${dto.summary}`;

    return {
      suggestions: [
        improved,
        `Results-driven ${dto.jobTitle || 'professional'} with expertise in delivering high-impact solutions.`,
        `Dynamic ${dto.jobTitle || 'professional'} recognized for driving innovation and achieving measurable outcomes.`,
      ],
      improved,
      originalLength: dto.summary.length,
      improvedLength: improved.length,
    };
  }

  async improveBullet(
    userId: string,
    dto: ImproveBulletDto,
  ): Promise<ImproveBulletResponseDto> {
    // Check rate limit
    await this.checkAndTrackUsage(userId, 'improve_bullet', dto.bullet);

    // Use the HuggingFace service to improve the bullet point
    const improvedText = await this.huggingFaceService.improveBulletPoint(
      dto.bullet,
    );

    // Calculate metrics
    const hasActionVerb = this.hasActionVerb(improvedText);
    const hasMetrics = this.hasMetrics(improvedText);
    const score = this.calculateBulletScore(
      improvedText,
      hasActionVerb,
      hasMetrics,
    );

    return {
      suggestions: [improvedText],
      improved: improvedText,
      metrics: {
        hasActionVerb,
        hasMetrics,
        score,
      },
    };
  }

  async suggestSkills(
    userId: string,
    dto: SuggestSkillsDto,
  ): Promise<SuggestSkillsResponseDto> {
    // Check rate limit
    await this.checkAndTrackUsage(userId, 'suggest_skills', dto.jobTitle);

    // TODO: Implement actual AI suggestion logic
    // Mock suggestions based on job title
    const skillMap: Record<string, string[]> = {
      'software engineer': [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'AWS',
        'Docker',
        'Git',
      ],
      'data scientist': [
        'Python',
        'R',
        'SQL',
        'Machine Learning',
        'TensorFlow',
        'Pandas',
        'NumPy',
        'Data Visualization',
      ],
      'product manager': [
        'Agile',
        'Scrum',
        'JIRA',
        'Data Analysis',
        'User Research',
        'Roadmapping',
        'Stakeholder Management',
      ],
      designer: [
        'Figma',
        'Adobe Creative Suite',
        'UI/UX Design',
        'Prototyping',
        'User Research',
        'Design Systems',
      ],
    };

    const normalizedTitle = dto.jobTitle.toLowerCase();
    const suggested = skillMap[normalizedTitle] || [
      'Communication',
      'Problem Solving',
      'Teamwork',
      'Time Management',
      'Leadership',
    ];

    return {
      suggested: suggested.slice(0, 5),
      trending: suggested.slice(5, 8),
      basedOn: `Based on current industry trends and requirements for ${dto.jobTitle} positions`,
    };
  }

  async generateSummary(
    userId: string,
    dto: GenerateSummaryDto,
  ): Promise<GenerateSummaryResponseDto> {
    // Check rate limit
    await this.checkAndTrackUsage(
      userId,
      'generate_summary',
      JSON.stringify(dto.experiences),
    );

    // TODO: Implement actual AI generation logic
    const summary = `Experienced ${dto.jobTitle} with ${dto.experiences.length} years of professional experience. Proven track record of delivering results and driving innovation.`;

    return {
      summary,
      alternatives: [
        `Results-driven ${dto.jobTitle} with extensive experience in delivering impactful solutions.`,
        `Dynamic ${dto.jobTitle} recognized for excellence and innovation in fast-paced environments.`,
      ],
      keyHighlights: ['Leadership', 'Innovation', 'Results-driven'],
    };
  }

  async getUsage(userId: string): Promise<AIUsageResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Pro users have unlimited access
    if (user && user.plan !== UserPlan.Free) {
      return {
        remaining: -1, // Unlimited
        total: -1,
        usedThisMonth: 0,
        resetsAt: this.getNextResetDate(),
      };
    }

    // Count usage for free users
    const startOfMonth = this.getStartOfMonth();
    const usedThisMonth = await this.aiUsageRepository.count({
      where: {
        userId,
        createdAt: MoreThan(startOfMonth),
      },
    });

    return {
      remaining: Math.max(0, this.FREE_TIER_LIMIT - usedThisMonth),
      total: this.FREE_TIER_LIMIT,
      usedThisMonth,
      resetsAt: this.getNextResetDate(),
    };
  }

  private async checkAndTrackUsage(
    userId: string,
    feature: AIFeature,
    input: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Pro users have unlimited access
    if (user && user.plan !== UserPlan.Free) {
      // Track usage but don't limit
      await this.trackUsage(userId, feature, input, 'unlimited');
      return;
    }

    // Check free tier limit
    const usage = await this.getUsage(userId);
    if (usage.remaining <= 0) {
      throw new ForbiddenException(
        'You have reached your monthly AI usage limit. Upgrade to Pro for unlimited AI features.',
      );
    }

    // Track usage
    await this.trackUsage(userId, feature, input, 'limited');
  }

  private async trackUsage(
    userId: string,
    feature: AIFeature,
    input: string,
    type: string,
  ): Promise<void> {
    const usage = new AIUsage();
    usage.userId = userId;
    usage.feature = feature;
    usage.input = input.substring(0, 1000); // Limit input size
    usage.output = type; // Simplified output tracking
    usage.tokensUsed = 0; // Would be set by actual AI service

    await this.aiUsageRepository.save(usage);
  }

  private getStartOfMonth(): Date {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getNextResetDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private hasActionVerb(text: string): boolean {
    const actionVerbs = [
      'achieved',
      'improved',
      'developed',
      'led',
      'managed',
      'created',
      'implemented',
      'increased',
      'reduced',
      'spearheaded',
      'launched',
      'designed',
      'built',
      'delivered',
      'optimized',
      'streamlined',
      'coordinated',
      'supervised',
    ];
    const lowerText = text.toLowerCase();
    return actionVerbs.some((verb) => lowerText.includes(verb));
  }

  private hasMetrics(text: string): boolean {
    // Check for numbers, percentages, or specific metrics
    return /\d+%|\$\d+|\d+\s*(million|thousand|k|m|hours|days|months|years)/i.test(
      text,
    );
  }

  private calculateBulletScore(
    text: string,
    hasActionVerb: boolean,
    hasMetrics: boolean,
  ): number {
    let score = 50; // Base score

    if (hasActionVerb) score += 20;
    if (hasMetrics) score += 20;
    if (text.length > 50 && text.length < 150) score += 10; // Optimal length

    return Math.min(100, score);
  }
}
