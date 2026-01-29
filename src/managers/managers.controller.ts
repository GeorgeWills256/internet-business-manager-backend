import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CreateManagerDto } from './dto/create-manager.dto';

/**
 * AUTH & ROLES
 */
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Managers')
@ApiBearerAuth() // 🔒 Shows Bearer token in Swagger
@Controller('managers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagersController {
  constructor() {}

  /**
   * CREATE MANAGER
   * Only ADMIN should create managers
   */
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new manager (Admin only)' })
  @ApiResponse({ status: 201, description: 'Manager created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() dto: CreateManagerDto) {}

  /**
   * LIST ALL MANAGERS
   * Admin + Manager allowed
   */
  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all managers' })
  @ApiResponse({ status: 200, description: 'Managers retrieved successfully' })
  async findAll() {}

  /**
   * GET MANAGER BY ID
   * Admin + Manager allowed
   */
  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get manager by ID' })
  @ApiResponse({ status: 200, description: 'Manager retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  async getById(@Param('id') id: string) {}
}