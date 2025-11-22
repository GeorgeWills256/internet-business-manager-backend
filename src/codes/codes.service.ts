import { Injectable } from '@nestjs/common';
import { SubscribersService } from '../subscribers/subscribers.service';
import { ManagersService } from '../managers/managers.service';
import { AfricasTalkingService } from '../africas-talking/africas-talking.service';

export enum CodeStatus {
  UNUSED = 'unused',
  GIVEN = 'given',
  EXPIRED = 'expired',
}

@Injectable()
export class CodesService {
  private codes: any[] = [];
  private nextId = 1;

  constructor(
    private readonly subscribersService: SubscribersService,
    private readonly managersService: ManagersService,
    private readonly sms: AfricasTalkingService,
  ) {}

  /** Generate a random 12-character code */
  generateRandomCode(len = 12): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < len; i++) {
      out += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return out;
  }

  /** Create a new code and send it to the subscriber */
  async generateCode(
    managerId: number,
    subscriberId: number,
    duration: number
  ) {
    const codeStr = this.generateRandomCode();
    
    const code = {
      id: this.nextId++,
      code: codeStr,
      managerId,
      subscriberId,
      duration,
      status: CodeStatus.GIVEN,
    };

    this.codes.push(code);

    // Find subscriber to send SMS
    const sub = this.subscribersService.list().find(s => s.id === subscriberId);

    if (sub) {
      await this.sms.sendSMS(
        sub.phone,
        `Your internet code is ${codeStr}. Valid for ${duration} days.`
      );
    }

    return code;
  }

  /** Fetch codes for a specific manager */
  getCodesByManager(managerId: number) {
    const codes = this.codes.filter(c => c.managerId === managerId);

    const summary = {
      total: codes.length,
      given: codes.filter(c => c.status === CodeStatus.GIVEN).length,
      unused: codes.filter(c => c.status === CodeStatus.UNUSED).length,
      expired: codes.filter(c => c.status === CodeStatus.EXPIRED).length,
      codes,
    };

    return summary;
  }

  /** Mark codes as expired */
  expireCodesByManager(managerId: number) {
    this.codes.forEach(code => {
      if (code.managerId === managerId && code.status === CodeStatus.GIVEN) {
        code.status = CodeStatus.EXPIRED;
      }
    });
  }
}