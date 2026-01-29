import {
  Controller,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('dashboard/system-revenue')
  getSystemRevenueSummary() {
    return this.adminService.getSystemRevenueSummary();
  }

  @Get('dashboard/subscriptions')
  getMonthlySubscriptions() {
    return this.adminService.getMonthlySubscriptionOverview();
  }

  @Get('dashboard/managers')
  getManagerCompliance() {
    return this.adminService.getManagerComplianceTable();
  }

  @Get('charts/revenue-daily')
  getDailyRevenue() {
    return this.adminService.getDailyRevenue(30);
  }

  @Get('charts/revenue-monthly')
  getMonthlyRevenue() {
    return this.adminService.getMonthlyRevenue(12);
  }

  @Get('export/system-revenue.csv')
  async exportSystemRevenueCSV() {
    const csv =
      await this.adminService.exportSystemRevenueCSV();

    return {
      filename: `system-revenue-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
      contentType: 'text/csv',
      data: csv,
    };
  }

  /**
   * ======================================================
   * ✅ ADMIN — SUSPEND / UNSUSPEND MANAGER
   * ======================================================
   */
  @Get('manager/suspend')
  suspendManager(
    @Query('managerId') managerId: number,
    @Query('suspend') suspend: string,
    @Query('reason') reason?: string,
  ) {
    return this.adminService.setManagerSuspension(
      Number(managerId),
      suspend === 'true',
      reason,
    );
  }

  /**
   * ======================================================
   * ✅ ADMIN — MANUAL UNBLOCK
   * ======================================================
   */
  @Get('manager/unblock')
  unblockManager(
    @Query('managerId') managerId: number,
  ) {
    return this.adminService.manualUnblockManager(
      Number(managerId),
    );
  }
}