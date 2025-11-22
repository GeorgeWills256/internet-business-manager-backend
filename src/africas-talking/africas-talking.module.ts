import { Module } from '@nestjs/common';
import { AfricasTalkingService } from './africas-talking.service';

@Module({
  providers: [AfricasTalkingService],
  exports: [AfricasTalkingService], // Important!
})
export class AfricasTalkingModule {}