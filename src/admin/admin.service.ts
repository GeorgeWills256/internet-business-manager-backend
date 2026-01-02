import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';
import { ServiceFeeSummary } from '../entities/service-fee-summary.entity';

@Injectable()
export class AdminService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Read-only system-wide metrics (ADMIN ONLY)
   */
  async getMetrics() {
    const managerRepo = this.dataSource.getRepository(Manager);
    const subscriberRepo =
      this.dataSource.getRepository(Subscriber);
    const feeRepo =
      this.dataSource.getRepository(ServiceFeeSummary);

    const totalManagers = await managerRepo.count();
    const totalSubscribers = await subscriberRepo.count();

    /**
     * Admin revenue = sum of service fees collected
     */
    const { sum } = await feeRepo
      .createQueryBuilder('f')
      .select('COALESCE(SUM(f.amount), 0)', 'sum')
      .getRawOne<{ sum: string }>();

    return {
      totalManagers,
      totalSubscribers,
      totalRevenue: Number(sum),
    };
  }
}