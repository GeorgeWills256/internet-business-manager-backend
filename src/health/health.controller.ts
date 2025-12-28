import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Health check for backend and database' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        database: 'up',
        uptime: 123.45,
        timestamp: '2025-12-27T14:21:35.794Z',
      },
    },
  })
  async healthCheck() {
    let database = 'down';

    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        database = 'up';
      }
    } catch {
      database = 'down';
    }

    return {
      status: 'ok',
      database,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}