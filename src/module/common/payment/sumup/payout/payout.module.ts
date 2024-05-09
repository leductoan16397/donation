import { Module } from '@nestjs/common';
import { SumUpPayoutService } from './payout.service';
import { SumUpBaseModule } from '../base/base.module';

@Module({
  controllers: [],
  exports: [SumUpPayoutService],
  imports: [SumUpBaseModule],
  providers: [SumUpPayoutService],
})
export class SumUpPayoutModule {}
