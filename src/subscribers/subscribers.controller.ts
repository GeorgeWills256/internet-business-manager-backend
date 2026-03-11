import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Subscribers')
@Controller('subscribers')
@UseGuards(JwtAuthGuard)
export class SubscribersController {
  constructor(
    private readonly subscribersService: SubscribersService,
  ) {}

  /* =========================
     PUBLIC-LIKE ROUTES (still guarded globally)
  ========================= */

  @Post('register')
  async register(
    @Body()
    dto: { phone: string; managerId: number },
  ) {
    return this.subscribersService.register(dto);
  }

  @Post('activate')
  async activate(
    @Body()
    dto: {
      subscriberId: number;
      days: number;
      source: 'payment' | 'code';
    },
  ) {
    return this.subscribersService.activate(dto);
  }

  /* ---------- LIST ---------- */
  @Get()
  async list(
    @Query() query: any,
    @Req() req: any,
  ) {
    return this.subscribersService.list(
      query,
      req.user,
    );
  }

  /* ---------- STATS ---------- */
  @Get('stats')
  async stats(@Req() req: any) {
    return this.subscribersService.getStats(
      req.user,
    );
  }

  /* ---------- GET ONE ---------- */
  @Get(':id')
  async getOne(
    @Param('id') id: number,
    @Req() req: any,
  ) {
    return this.subscribersService.getOne(
      Number(id),
      req.user,
    );
  }

  /* ---------- UPDATE ---------- */
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.subscribersService.updateSubscriber(
      Number(id),
      dto,
      req.user,
    );
  }

  /* ---------- TOGGLE ---------- */
  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id') id: number,
    @Req() req: any,
  ) {
    return this.subscribersService.toggleStatus(
      Number(id),
      req.user,
    );
  }

  /* ---------- SOFT DELETE ---------- */
  @Delete(':id')
  async softDelete(
    @Param('id') id: number,
    @Req() req: any,
  ) {
    return this.subscribersService.softDelete(
      Number(id),
      req.user,
    );
  }
}