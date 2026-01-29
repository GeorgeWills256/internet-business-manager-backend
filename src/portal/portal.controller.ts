import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PortalService } from './portal.service';

@Controller('portal')
export class PortalController {
  constructor(
    private readonly portalService: PortalService,
  ) {}

  /**
   * =====================================
   * ROUTER → START PORTAL SESSION
   * =====================================
   */
  @Get('start')
  async startSession(
    @Query('managerId') managerId: string,
    @Query('mac') macAddress: string,
    @Query('ip') ipAddress?: string,
    @Query('routerId') routerId?: string,
  ) {
    if (!managerId || !macAddress) {
      throw new BadRequestException(
        'managerId and mac are required',
      );
    }

    return this.portalService.createSession({
      managerId: Number(managerId),
      macAddress,
      ipAddress,
      routerId,
    });
  }

  /**
   * =====================================
   * ROUTER → CHECK INTERNET ACCESS
   * =====================================
   */
  @Get('check-access')
  async checkAccess(
    @Query('mac') macAddress: string,
  ) {
    return this.portalService.checkAccess(macAddress);
  }

  /**
   * =====================================
   * 💰 SUBSCRIBER PRICE PREVIEW (PUBLIC)
   * =====================================
   */
  @Get('price-preview')
  async previewPrice(
    @Query('managerId') managerId: string,
    @Query('package') pkg: string,
    @Query('devices') devices = '1',
  ) {
    if (!managerId || !pkg) {
      throw new BadRequestException(
        'managerId and package are required',
      );
    }

    return this.portalService.previewPrice({
      managerId: Number(managerId),
      package: pkg,
      devices: Number(devices),
    });
  }

  /**
   * =====================================
   * 💳 PAY-NOW DEEP LINK
   * =====================================
   * Example:
   * /portal/pay-now?sessionId=abc&package=7d&devices=3
   */
  @Get('pay-now')
  async payNow(
    @Query('sessionId') sessionId: string,
    @Query('package') pkg: string,
    @Query('devices') devices = '1',
  ) {
    if (!sessionId || !pkg) {
      throw new BadRequestException(
        'sessionId and package are required',
      );
    }

    return this.portalService.preparePayNow({
      sessionId,
      package: pkg,
      devices: Number(devices),
    });
  }
}
