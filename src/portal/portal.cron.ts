import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import {
  PortalSession,
  PortalSessionStatus,
} from './entities/portal-session.entity';

@Injectable()
export class PortalExpiryCron {
  constructor(
    @InjectRepository(PortalSession)
    private readonly portalRepo: Repository<PortalSession>,
  ) {}

  /**
   * ================================
   * AUTO-EXPIRE PORTAL SESSIONS
   * ================================
   * Runs every 5 minutes
   */
  @Cron('*/5 * * * *')
  async expireSessions() {
    await this.portalRepo.update(
      {
        status: PortalSessionStatus.ACCESS_GRANTED,
        expiresAt: LessThan(new Date()),
      },
      {
        status: PortalSessionStatus.EXPIRED,
      },
    );
  }
}
