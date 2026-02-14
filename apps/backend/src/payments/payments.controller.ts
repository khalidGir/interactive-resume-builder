import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  CreateSubscriptionDto,
  PaymentCallbackDto,
  ApplyCouponDto,
} from '../dto/payment.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('payments')
@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
  async getPlans() {
    return this.paymentsService.getPlans();
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to a plan' })
  @ApiResponse({ status: 200, description: 'Subscription created' })
  @ApiResponse({ status: 400, description: 'Invalid plan' })
  async subscribe(
    @CurrentUser() userId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.paymentsService.createSubscription(userId, dto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle payment gateway callbacks' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleWebhook(@Body() dto: PaymentCallbackDto) {
    await this.paymentsService.handlePaymentCallback(dto);
    return { success: true };
  }

  @Post('create-portal-session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create customer portal session' })
  @ApiResponse({ status: 200, description: 'Portal session created' })
  async createPortalSession(@CurrentUser() userId: string) {
    return this.paymentsService.createPortalSession(userId);
  }

  @Post('apply-coupon')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply coupon code' })
  @ApiResponse({ status: 200, description: 'Coupon applied' })
  async applyCoupon(@Body() dto: ApplyCouponDto) {
    return this.paymentsService.applyCoupon(dto);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancelSubscription(@CurrentUser() userId: string) {
    await this.paymentsService.cancelSubscription(userId);
    return { success: true };
  }
}
