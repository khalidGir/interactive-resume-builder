import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Define interfaces for each section of the resume
interface Profile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  currentlyWorking?: boolean;
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}

interface Skill {
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Project {
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
}

interface Language {
  language: string;
  proficiency?: 'Elementary' | 'Limited' | 'Professional' | 'Native';
}

export class CreateResumeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  readonly data: {
    profile: Profile;
    experiences?: Experience[];
    education?: Education[];
    skills?: Skill[];
    projects?: Project[];
    languages?: Language[];
  };
}

export class UpdateResumeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  readonly data: {
    profile: Profile;
    experiences?: Experience[];
    education?: Education[];
    skills?: Skill[];
    projects?: Project[];
    languages?: Language[];
  };
}