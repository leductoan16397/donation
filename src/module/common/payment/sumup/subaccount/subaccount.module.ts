import { Module } from '@nestjs/common';
import { SumUpSubAccountService } from './subaccount.service';
import { SumUpBaseModule } from '../base/base.module';

@Module({
  controllers: [],
  exports: [SumUpSubAccountService],
  imports: [SumUpBaseModule],
  providers: [SumUpSubAccountService],
})
export class SumUpSubAccountModule {}
