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

/**
 * AUTH & ROLES
 */
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Payments')
@ApiBearerAuth() // 🔒 Swagger shows Bearer token
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * PROCESS PAYMENT
   * - Manager
   * - Salesperson (acting under manager)
   */
  @Post('process')
  @Roles('manager', 'salesperson')
  @Throttle({
    default: {
      ttl: 60,
      limit: 10, // 10 payment attempts per minute per IP
    },
  })
  @ApiOperation({
    summary: 'Process payment and optionally activate subscriber',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async process(@Body() dto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(dto);
  }
}