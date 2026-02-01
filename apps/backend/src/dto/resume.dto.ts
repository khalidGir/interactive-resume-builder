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
  ArrayMaxSize,
  MaxLength,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';

enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

enum LanguageProficiency {
  Elementary = 'Elementary',
  Limited = 'Limited',
  Professional = 'Professional',
  Native = 'Native',
}

class ProfileDto {
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
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  summary?: string;
}

class ExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  currentlyWorking?: boolean;
}

class EducationDto {
  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  fieldOfStudy: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  gpa?: number;
}

class SkillDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SkillLevel)
  @IsOptional()
  level?: SkillLevel;
}

class ProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ArrayMaxSize(10)
  technologies?: string[];
}

class LanguageDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsEnum(LanguageProficiency)
  @IsOptional()
  proficiency?: LanguageProficiency;
}

export class CreateResumeDto {
  @ValidateNested()
  @Type(() => Object)
  readonly data: {
    profile: ProfileDto;
    experiences?: ExperienceDto[];
    education?: EducationDto[];
    skills?: SkillDto[];
    projects?: ProjectDto[];
    languages?: LanguageDto[];
  };
}

export class UpdateResumeDto {
  @ValidateNested()
  @Type(() => Object)
  readonly data: {
    profile: ProfileDto;
    experiences?: ExperienceDto[];
    education?: EducationDto[];
    skills?: SkillDto[];
    projects?: ProjectDto[];
    languages?: LanguageDto[];
  };
}