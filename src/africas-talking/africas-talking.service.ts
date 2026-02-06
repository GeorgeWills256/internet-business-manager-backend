import { Injectable, Logger } from '@nestjs/common';
import * as AT from 'africastalking';

@Injectable()
export class AfricasTalkingService {
  private readonly logger = new Logger('AfricasTalking');

  private readonly sms;

  constructor() {
    const username = process.env.AT_USERNAME;
    const apiKey = process.env.AT_API_KEY;

    if (!username || !apiKey) {
      this.logger.warn("Africa's Talking not configured (AT_USERNAME/AT_API_KEY missing)");
      return;
    }

    const africasTalking = AT.default({
      apiKey,
      username,
    });

    this.sms = africasTalking.SMS;
  }

  async sendSMS(phone: string, message: string) {
    if (!this.sms) {
      this.logger.warn('SMS skipped (Africa’s Talking not configured)');
      return;
    }

    try {
      const res = await this.sms.send({
        to: phone,
        message,
      });
      this.logger.log(`SMS sent to ${phone}`);
      return res;
    } catch (err) {
      this.logger.error(`SMS failed: ${err.message}`);
      throw err;
    }
  }
}