import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

// Entities needed
import { Manager } from '../entities/manager.entity';
import { Subscriber } from '../entities/subscriber.entity';
import { ServiceFeeSummary } from '../entities/service-fee-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manager,
      Subscriber,
      ServiceFeeSummary,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}