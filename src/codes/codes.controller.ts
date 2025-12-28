import { Controller, Post, Body } from '@nestjs/common';
import { CodesService } from './codes.service';

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post('free')
  generateFree(@Body() body: { managerId: number }) {
    return this.codesService.generateFreeCode(body.managerId);
  }

  @Post('redeem')
  redeem(@Body() body: { code: string; subscriberId: number }) {
    return this.codesService.redeemCode({
      codeValue: body.code,
      subscriberId: body.subscriberId,
    });
  }
}