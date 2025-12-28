import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';

@ApiTags('Subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new subscriber (inactive by default)' })
  @ApiResponse({ status: 201, description: 'Subscriber registered' })
  async register(
    @Body()
    dto: { phone: string; managerId: number },
  ) {
    return this.subscribersService.register(dto);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate a subscriber' })
  @ApiResponse({ status: 200, description: 'Subscriber activated' })
  async activate(
    @Body()
    dto: { subscriberId: number; days: number; source: 'payment' | 'code' },
  ) {
    return this.subscribersService.activate(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all subscribers' })
  @ApiResponse({ status: 200, description: 'Subscribers retrieved' })
  async list() {
    return this.subscribersService.list();
  }
}