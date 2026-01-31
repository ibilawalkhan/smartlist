import { Module } from '@nestjs/common';
import { PlanFeesService } from './plan_fees.service';
import { PlanFeesController } from './plan_fees.controller';

@Module({
  providers: [PlanFeesService],
  controllers: [PlanFeesController]
})
export class PlanFeesModule {}
