import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('process')
  @Roles('manager', 'salesperson')
  @Throttle({ default: { ttl: 60, limit: 10 } })
  @ApiOperation({
    summary: 'Process subscriber or portal payment',
  })
  @ApiResponse({ status: 200 })
  async process(@Body() dto: ProcessPaymentDto) {
    return this.paymentsService.processPayment({
      managerId: dto.managerId,
      subscriberId: dto.subscriberId,
      portalSessionId: dto.portalSessionId,
      method: dto.method,
      mobileReference: dto.mobileReference,
      days: 0,
      amount: 0
    });
  }
}