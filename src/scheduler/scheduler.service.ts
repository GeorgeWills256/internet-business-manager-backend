import { Injectable, Logger } from '@nestjs/common';
import * as schedule from 'node-schedule';
import { ManagersService } from '../managers/managers.service';
import { SubscribersService } from '../subscribers/subscribers.service';
import { CodesService, CodeStatus } from '../codes/codes.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger('SchedulerService');

  constructor(
    private readonly managersService: ManagersService,
    private readonly subscribersService: SubscribersService,
    private readonly codesService: CodesService,
  ) {
    this.setupJobs();
  }

  setupJobs() {
    /** 🔸 Job 1 — Saturday 18:00 (Just logs unpaid managers) */
    schedule.scheduleJob('0 18 * * 6', () => {
      this.logger.log('Saturday 18:00 — Checking service fee balances');

      const managers = this.managersService.findAll();

      managers.forEach(m => {
        if (m.pendingServiceFee > 0) {
          this.logger.warn(
            `Manager ${m.name} still owes service fees: ${m.pendingServiceFee}`,
          );
        }
      });
    });

    /** 🔸 Job 2 — Saturday 23:59 (Expire codes + disconnect subscribers) */
    schedule.scheduleJob('59 23 * * 6', () => {
      this.logger.log('Saturday 23:59 — Disconnecting unpaid managers');

      const managers = this.managersService.findAll();

      managers.forEach(manager => {
        if (manager.pendingServiceFee > 0) {
          this.logger.warn(
            `Disconnecting subscribers for manager ${manager.name} due to unpaid fees...`,
          );

          // 1️⃣ Expire all codes
          this.codesService.expireCodesByManager(manager.id);

          // 2️⃣ Disconnect all subscribers under this manager
          const subs = this.subscribersService
            .list()
            .filter(s => s.managerId === manager.id);

          subs.forEach(sub => (sub.activeUntil = null));
        }
      });
    });
  }
}