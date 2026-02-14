import {
  IsObject,
  ValidateNested,
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ResumeStatus {
  Draft = 'draft',
  Complete = 'complete',
  Archived = 'archived',
}

export enum SkillLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Expert = 'expert',
}

export enum LanguageProficiency {
  Basic = 'basic',
  Conversational = 'conversational',
  Fluent = 'fluent',
  Native = 'native',
}

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  summary?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;
}

export class ExperienceDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  current?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements?: string[];
}

export class EducationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  fieldOfStudy: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  current?: boolean;

  @IsString()
  @IsOptional()
  gpa?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class SkillDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SkillLevel)
  @IsOptional()
  level?: SkillLevel;

  @IsString()
  @IsOptional()
  category?: string;
}

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}

export class LanguageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsEnum(LanguageProficiency)
  @IsOptional()
  proficiency?: LanguageProficiency;
}

export class CertificationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  issuer: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  link?: string;
}

export class CustomItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  date?: string;
}

export class CustomSectionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomItemDto)
  @IsOptional()
  items?: CustomItemDto[];
}

export class ResumeDataDto {
  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  @IsOptional()
  experiences?: ExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  @IsOptional()
  education?: EducationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  @IsOptional()
  skills?: SkillDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  @IsOptional()
  projects?: ProjectDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  @IsOptional()
  languages?: LanguageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  @IsOptional()
  certifications?: CertificationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomSectionDto)
  @IsOptional()
  customSections?: CustomSectionDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sectionOrder?: string[];
}

export class CreateResumeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ValidateNested()
  @Type(() => ResumeDataDto)
  data: ResumeDataDto;
}

export class UpdateResumeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsEnum(ResumeStatus)
  @IsOptional()
  status?: ResumeStatus;

  @ValidateNested()
  @Type(() => ResumeDataDto)
  @IsOptional()
  data?: ResumeDataDto;
}

export class ReorderSectionsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  sectionOrder: string[];
}

export class DuplicateResumeDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class ExportResumeDto {
  @IsEnum(['pdf', 'docx'])
  @IsOptional()
  format?: 'pdf' | 'docx' = 'pdf';

  @IsString()
  @IsOptional()
  templateId?: string;
}

export class ResumeQueryDto {
  @IsEnum(ResumeStatus)
  @IsOptional()
  status?: ResumeStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt' | 'name' = 'updatedAt';

  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
