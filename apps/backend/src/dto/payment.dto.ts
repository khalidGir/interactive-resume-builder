import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum PaymentProvider {
  SantimPay = 'santimpay',
  Telebirr = 'telebirr',
  Cash = 'cash',
}

export enum SubscriptionPlan {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsString()
  phoneNumber: string;

  @IsEnum(PaymentProvider)
  @IsOptional()
  provider?: PaymentProvider;
}

export class PaymentCallbackDto {
  @IsString()
  transactionId: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class ApplyCouponDto {
  @IsString()
  couponCode: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  checkoutUrl?: string;
}
