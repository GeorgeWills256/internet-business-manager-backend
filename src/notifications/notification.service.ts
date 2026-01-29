import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendSMS(phone: string, message: string) {
    if (!phone) return;

    // 🔌 Africa's Talking integration point
    this.logger.log(
      `[SMS] To ${phone}: ${message}`,
    );

    // TODO: Plug Africa's Talking SDK here
  }

  async sendEmail(
    email: string,
    subject: string,
    body: string,
  ) {
    if (!email) return;

    // 🔌 Email provider integration point
    this.logger.log(
      `[EMAIL] To ${email}: ${subject}`,
    );

    // TODO: Plug SendGrid / SMTP / Resend here
  }
}
