import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, UserPlan } from '../entities/user.entity';
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionInterval,
} from '../entities/subscription.entity';
import {
  CreateSubscriptionDto,
  PaymentCallbackDto,
  ApplyCouponDto,
  PaymentPlan,
  PaymentResponse,
  SubscriptionPlan,
} from '../dto/payment.dto';

@Injectable()
export class PaymentsService {
  private readonly plans: PaymentPlan[] = [
    {
      id: 'pro-monthly',
      name: 'Pro Monthly',
      price: 450, // ETB
      currency: 'ETB',
      interval: 'monthly',
      features: [
        'Unlimited resumes',
        'All premium templates',
        'Unlimited AI features',
        'PDF export without watermark',
        'Priority support',
      ],
    },
    {
      id: 'pro-yearly',
      name: 'Pro Yearly',
      price: 4500, // ETB (2 months free)
      currency: 'ETB',
      interval: 'yearly',
      features: [
        'Unlimited resumes',
        'All premium templates',
        'Unlimited AI features',
        'PDF export without watermark',
        'Priority support',
        'Save 17%',
      ],
    },
  ];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private configService: ConfigService,
  ) {}

  async getPlans(): Promise<{ plans: PaymentPlan[] }> {
    return { plans: this.plans };
  }

  async createSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<PaymentResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const plan = this.plans.find((p) => p.interval === dto.plan);
    if (!plan) {
      throw new BadRequestException('Invalid plan selected');
    }

    // Create pending subscription
    const subscription = new Subscription();
    subscription.userId = userId;
    subscription.stripeSubscriptionId = `pending-${Date.now()}`;
    subscription.stripeCustomerId = userId;
    subscription.status = SubscriptionStatus.Active;
    subscription.interval =
      dto.plan === SubscriptionPlan.Monthly
        ? SubscriptionInterval.Monthly
        : SubscriptionInterval.Yearly;
    subscription.currentPeriodStart = new Date();
    subscription.currentPeriodEnd = new Date(
      Date.now() +
        (dto.plan === SubscriptionPlan.Monthly ? 30 : 365) *
          24 *
          60 *
          60 *
          1000,
    );

    await this.subscriptionRepository.save(subscription);

    // TODO: Integrate with actual payment gateway (Santim Pay, Telebirr, etc.)
    // For now, return mock response
    return {
      success: true,
      transactionId: subscription.stripeSubscriptionId,
      message:
        'Payment initiated. Please complete payment on your mobile device.',
      checkoutUrl: `https://payment.resumeai.com/checkout/${subscription.stripeSubscriptionId}`,
    };
  }

  async handlePaymentCallback(dto: PaymentCallbackDto): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: dto.transactionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (dto.status === 'success') {
      subscription.status = SubscriptionStatus.Active;
      await this.subscriptionRepository.save(subscription);

      // Update user plan
      const user = await this.userRepository.findOne({
        where: { id: subscription.userId },
      });
      if (user) {
        user.plan = UserPlan.Pro;
        await this.userRepository.save(user);
      }
    } else {
      subscription.status = SubscriptionStatus.Unpaid;
      await this.subscriptionRepository.save(subscription);
    }
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    // For local payment gateways, this might be a simple profile page
    return {
      url: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/settings/billing`,
    };
  }

  async applyCoupon(
    dto: ApplyCouponDto,
  ): Promise<{ valid: boolean; discount: number; message: string }> {
    // TODO: Implement coupon validation logic
    const validCoupons: Record<string, number> = {
      STARTUP20: 20,
      STUDENT50: 50,
      RESUME2024: 15,
    };

    const discount = validCoupons[dto.couponCode.toUpperCase()];

    if (discount) {
      return {
        valid: true,
        discount,
        message: `Coupon applied! ${discount}% discount`,
      };
    }

    return {
      valid: false,
      discount: 0,
      message: 'Invalid or expired coupon code',
    };
  }

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.Active },
      order: { createdAt: 'DESC' },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    subscription.status = SubscriptionStatus.Canceled;
    subscription.canceledAt = new Date();
    await this.subscriptionRepository.save(subscription);
  }
}
