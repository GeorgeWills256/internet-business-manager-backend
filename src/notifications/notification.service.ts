import { Injectable, Logger } from '@nestjs/common';
import { AfricasTalkingService } from '../africas-talking/africas-talking.service';
import { Resend } from 'resend';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly resend: Resend;

  constructor(private readonly africasTalkingService: AfricasTalkingService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendSMS(phone: string, message: string) {
    if (!phone) return;

    try {
      const result = await this.africasTalkingService.sendSMS(phone, message);
      this.logger.log(`[SMS] Successfully sent to ${phone}`);
      return result;
    } catch (err) {
      this.logger.error(`[SMS] Failed to send to ${phone}: ${err.message}`);
      throw err;
    }
  }

  async sendEmail(
    email: string,
    subject: string,
    body: string,
  ) {
    if (!email) return;

    try {
      const result = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
        to: email,
        subject,
        html: body,
      });

      if (result.error) {
        this.logger.error(`[EMAIL] Failed to send to ${email}: ${result.error.message}`);
        throw new Error(result.error.message);
      }

      this.logger.log(`[EMAIL] Successfully sent to ${email}`);
      return result;
    } catch (err) {
      this.logger.error(`[EMAIL] Failed to send to ${email}: ${err.message}`);
      throw err;
    }
  }
}
