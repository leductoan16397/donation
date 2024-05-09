import { Module } from '@nestjs/common';
import { SumUpCheckoutService } from './checkout.service';
import { SumUpBaseModule } from '../base/base.module';

@Module({
  controllers: [],
  exports: [SumUpCheckoutService],
  imports: [SumUpBaseModule],
  providers: [SumUpCheckoutService],
})
export class SumUpCheckoutModule {}
