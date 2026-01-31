import { Module } from '@nestjs/common';
import { DeadlinesService } from './deadlines.service';
import { DeadlinesController } from './deadlines.controller';

@Module({
  providers: [DeadlinesService],
  controllers: [DeadlinesController]
})
export class DeadlinesModule {}
