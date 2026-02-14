import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { TemplateCategory } from '../entities/template.entity';

export class TemplateQueryDto {
  @IsEnum(TemplateCategory)
  @IsOptional()
  category?: TemplateCategory;

  @IsBoolean()
  @IsOptional()
  isPro?: boolean;

  @IsString()
  @IsOptional()
  search?: string;
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  @IsOptional()
  isPro?: boolean;

  @IsString()
  thumbnailUrl: string;

  @IsArray()
  @IsString({ each: true })
  availableColors: string[];

  @IsString()
  htmlTemplate: string;

  @IsOptional()
  styles?: Record<string, any>;
}
