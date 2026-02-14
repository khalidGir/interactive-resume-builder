import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Resume } from './resume.entity';
import { Subscription } from './subscription.entity';
import { AIUsage } from './ai-usage.entity';

export enum UserPlan {
  Free = 'free',
  Pro = 'pro',
  Teams = 'teams',
}

export interface UserPreferences {
  defaultTemplate?: string;
  autoSaveInterval?: number;
  showAiSuggestions?: boolean;
  emailNotifications?: {
    tips: boolean;
    updates: boolean;
    marketing: boolean;
  };
  editorPreferences?: {
    fontSize: 'small' | 'medium' | 'large';
    colorScheme: 'light' | 'dark' | 'system';
  };
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Column({ nullable: true, name: 'photo_url' })
  photoUrl?: string;

  @Column({
    type: 'enum',
    enum: ['free', 'pro', 'teams'],
    default: 'free',
  })
  plan: UserPlan;

  @Column({ default: false, name: 'email_verified' })
  emailVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: UserPreferences;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => AIUsage, (aiUsage) => aiUsage.user)
  aiUsages: AIUsage[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
