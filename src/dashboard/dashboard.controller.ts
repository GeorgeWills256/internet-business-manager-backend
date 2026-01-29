import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { DashboardService } from './dashboard.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager', 'salesperson')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * MANAGER OVERVIEW
   */
  @Get('overview')
  getOverview(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.dashboardService.getOverview(user.userId);
  }

  /**
   * 🔔 SUBSCRIPTION BANNER ONLY
   */
  @Get('subscription-banner')
  async getSubscriptionBanner(@Req() req: Request) {
    const user = req.user as { userId: number };
    const overview =
      await this.dashboardService.getOverview(user.userId);
    return overview?.subscriptionBanner ?? { visible: false };
  }

  /**
   * ACTIVE INTERNET SESSIONS
   */
  @Get('sessions')
  getActiveSessions(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.dashboardService.getActiveSessions(user.userId);
  }

  /**
   * LIVE INTERNET SESSIONS
   */
  @Get('live-sessions')
  getLiveSessions(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.dashboardService.getLiveSessions(user.userId);
  }

  /**
   * SESSION LIMIT STATUS
   */
  @Get('session-limits')
  getSessionLimits(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.dashboardService.getLiveSessionsWithLimits(
      user.userId,
    );
  }

  /**
   * SUBSCRIBER SUMMARY
   */
  @Get('subscribers')
  getSubscriberStats(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.dashboardService.getSubscriberStats(user.userId);
  }
}