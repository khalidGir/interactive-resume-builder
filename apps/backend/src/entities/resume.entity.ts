import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Template } from './template.entity';

export enum ResumeStatus {
  Draft = 'draft',
  Complete = 'complete',
  Archived = 'archived',
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  gpa: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export interface CustomItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  summary?: string;
  photoUrl?: string;
}

export interface ResumeData {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  customSections: CustomSection[];
  sectionOrder: string[];
}

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.resumes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => Template, (template) => template.resumes)
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'complete', 'archived'],
    default: 'draft',
  })
  status: ResumeStatus;

  @Column({ type: 'int', default: 0, name: 'completion_percentage' })
  completionPercentage: number;

  @Column({ type: 'jsonb' })
  data: ResumeData;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true, name: 'last_opened_at' })
  lastOpenedAt: Date;
}
