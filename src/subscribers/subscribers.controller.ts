import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post('register')
  register(@Body() dto: { phone: string; managerId: number }) {
    return this.subscribersService.register(dto);
  }

@Post(':id/activate')
activate(
  @Param('id') id: string,
  @Body() body: { days: number; code: string }
) {
  return this.subscribersService.activate({
    subscriberId: +id,
    days: body.days,
    code: body.code,
  });
}


  @Get()
  list() {
    return this.subscribersService.list();
  }
}