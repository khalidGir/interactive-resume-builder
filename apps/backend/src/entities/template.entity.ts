import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Resume } from './resume.entity';

export enum TemplateCategory {
  Professional = 'professional',
  Modern = 'modern',
  Creative = 'creative',
  Minimal = 'minimal',
  Academic = 'academic',
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['professional', 'modern', 'creative', 'minimal', 'academic'],
  })
  category: TemplateCategory;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array')
  features: string[];

  @Column({ default: false, name: 'is_pro' })
  isPro: boolean;

  @Column({ name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column('simple-array', { name: 'available_colors' })
  availableColors: string[];

  @Column({ type: 'text', name: 'html_template' })
  htmlTemplate: string;

  @Column({ type: 'jsonb' })
  styles: Record<string, any>;

  @OneToMany(() => Resume, (resume) => resume.template)
  resumes: Resume[];
}
