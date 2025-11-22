import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post('create')
  create(@Body() dto: CreateManagerDto) {
    return this.managersService.create(dto);
  }

  @Get()
  list() {
    return this.managersService.findAll();
  }

  @Post(':id/add-fee')
  addFee(@Param('id') id, @Body() body) {
    return this.managersService.addServiceFee(+id, body.amount);
  }

  @Post(':id/clear-fee')
  clearFee(@Param('id') id) {
    return this.managersService.clearServiceFee(+id);
  }
}