import { Injectable } from '@nestjs/common';
import { SubscribersService } from '../subscribers/subscribers.service';
import { ManagersService } from '../managers/managers.service';
import { AfricasTalkingService } from '../africas-talking/africas-talking.service';

const SERVICE_FEE_PERCENT = Number(process.env.SERVICE_FEE_PERCENT || 10);

@Injectable()
export class PaymentsService {
  constructor(
    private readonly subscribersService: SubscribersService,
    private readonly managersService: ManagersService,
    private readonly sms: AfricasTalkingService,
  ) {}

  async processPayment(
    subscriberId: number,
    managerId: number,
    amount: number,
    method: 'Cash' | 'MobileMoney'
  ) {
    // Calculate fee
    const serviceFee = (amount * SERVICE_FEE_PERCENT) / 100;
    const subscriberAmount = amount - serviceFee;

    // If paid in cash → manager owes the fee
    if (method === 'Cash') {
      this.managersService.addServiceFee(managerId, serviceFee);
    }

    // Convert amount → days of internet
    const days = Math.max(1, Math.floor(subscriberAmount / 100));

    // Generate the activation code
    const code = this.subscribersService.generateCode(days);

    // Activate subscriber
    const activation = await this.subscribersService.activate({
      subscriberId,
      days,
      code, // ⭐ now valid
    });

    return {
      message: 'Payment processed',
      subscriberId,
      managerId,
      amount,
      serviceFee,
      days,
      code,
      activation,
    };
  }
}
