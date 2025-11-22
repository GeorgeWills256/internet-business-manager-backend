import { Injectable } from '@nestjs/common';
import { AfricasTalkingService } from '../africas-talking/africas-talking.service';

@Injectable()
export class SubscribersService {
  private subscribers = [];
  private codeCounter = 1000;

  constructor(private readonly sms: AfricasTalkingService) {}

  register(dto: { phone: string; managerId: number }) {
    const subscriber = {
      id: this.subscribers.length + 1,
      phone: dto.phone,
      managerId: dto.managerId,
      activeUntil: null,
    };
    this.subscribers.push(subscriber);
    return subscriber;
  }

  generateCode(days: number) {
    return `NET${this.codeCounter++}-${days}D`;
  }

  async activate(dto: { subscriberId: number; days: number; code: string }) {
    const subscriber = this.subscribers.find(s => s.id === dto.subscriberId);
    if (!subscriber) throw new Error('Subscriber not found');

    const now = new Date();
    const expiry = new Date(now.getTime() + dto.days * 24 * 60 * 60 * 1000);
    subscriber.activeUntil = expiry;

    await this.sms.sendSMS(
      subscriber.phone,
      `Your internet has been activated for ${dto.days} days. Expiry: ${expiry.toISOString()}`
    );

    return { message: 'Subscriber activated', subscriber };
  }

  deactivateExpired() {
    const now = new Date();
    this.subscribers.forEach(sub => {
      if (sub.activeUntil && now > sub.activeUntil) {
        sub.activeUntil = null;
      }
    });
  }

  list() {
    return this.subscribers;
  }
}