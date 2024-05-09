import { Module } from '@nestjs/common';
import { SumUpMerchantService } from './merchant.service';
import { SumUpBaseModule } from '../base/base.module';

@Module({
  controllers: [],
  exports: [SumUpMerchantService],
  imports: [SumUpBaseModule],
  providers: [SumUpMerchantService],
})
export class SumUpMerchantModule {}
