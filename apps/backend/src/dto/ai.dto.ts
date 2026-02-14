import { IsString, IsOptional, IsArray } from 'class-validator';

export class ImproveSummaryDto {
  @IsString()
  summary: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;
}

export class ImproveBulletDto {
  @IsString()
  bullet: string;
}

export class SuggestSkillsDto {
  @IsString()
  jobTitle: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currentSkills?: string[];
}

export class GenerateSummaryDto {
  @IsArray()
  experiences: any[];

  @IsString()
  jobTitle: string;
}

export class ImproveSummaryResponseDto {
  suggestions: string[];
  improved: string;
  originalLength: number;
  improvedLength: number;
}

export class ImproveBulletResponseDto {
  suggestions: string[];
  improved: string;
  metrics: {
    hasActionVerb: boolean;
    hasMetrics: boolean;
    score: number;
  };
}

export class SuggestSkillsResponseDto {
  suggested: string[];
  trending: string[];
  basedOn: string;
}

export class GenerateSummaryResponseDto {
  summary: string;
  alternatives: string[];
  keyHighlights: string[];
}

export class AIUsageResponseDto {
  remaining: number;
  total: number;
  usedThisMonth: number;
  resetsAt: Date;
}
