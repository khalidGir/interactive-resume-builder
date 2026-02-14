import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export type AIFeature =
  | 'improve_summary'
  | 'improve_bullet'
  | 'suggest_skills'
  | 'generate_summary';

@Entity('ai_usage')
export class AIUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.aiUsages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: [
      'improve_summary',
      'improve_bullet',
      'suggest_skills',
      'generate_summary',
    ],
  })
  feature: AIFeature;

  @Column({ type: 'text' })
  input: string;

  @Column({ type: 'text' })
  output: string;

  @Column({ type: 'int', name: 'tokens_used' })
  tokensUsed: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
