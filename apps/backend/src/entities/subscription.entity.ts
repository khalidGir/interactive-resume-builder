import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum SubscriptionStatus {
  Active = 'active',
  Canceled = 'canceled',
  PastDue = 'past_due',
  Unpaid = 'unpaid',
}

export enum SubscriptionInterval {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'stripe_subscription_id' })
  stripeSubscriptionId: string;

  @Column({ name: 'stripe_customer_id' })
  stripeCustomerId: string;

  @Column({
    type: 'enum',
    enum: ['active', 'canceled', 'past_due', 'unpaid'],
  })
  status: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: ['monthly', 'yearly'],
  })
  interval: SubscriptionInterval;

  @Column({ type: 'timestamp', name: 'current_period_start' })
  currentPeriodStart: Date;

  @Column({ type: 'timestamp', name: 'current_period_end' })
  currentPeriodEnd: Date;

  @Column({ nullable: true, name: 'canceled_at' })
  canceledAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
