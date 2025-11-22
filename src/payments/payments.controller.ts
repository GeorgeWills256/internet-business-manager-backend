import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

type PaymentMethod = "Cash" | "MobileMoney";

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('process')
  async process(
    @Body()
    dto: {
      subscriberId: number;
      managerId: number;
      amount: number;
      paymentMethod: PaymentMethod;
    },
  ) {
    return this.paymentsService.processPayment(
      dto.subscriberId,
      dto.managerId,
      dto.amount,
      dto.paymentMethod as PaymentMethod, // ✅ FIX
    );
  }
}