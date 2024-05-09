import { Module } from '@nestjs/common';
import { SumUpCustomerService } from './customer.service';
import { SumUpBaseModule } from '../base/base.module';

@Module({
  controllers: [],
  exports: [SumUpCustomerService],
  imports: [SumUpBaseModule],
  providers: [SumUpCustomerService],
})
export class SumUpCustomerModule {}
