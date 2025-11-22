import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CodesService } from './codes.service';

@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Post('generate')
  async generate(@Body() body: { managerId: number; subscriberId: number; duration: number }) {
    return this.codesService.generateCode(
      body.managerId,
      body.subscriberId,
      body.duration
    );
  }

  @Get('manager/:managerId')
  async managerCodes(@Param('managerId') managerId: string) {
    return this.codesService.getCodesByManager(+managerId);
  }
}