import { Module } from '@nestjs/common';
import { SumUpReceiptService } from './receipt.service';
import { SumUpBaseModule } from '../base/base.module';

@Module({
  controllers: [],
  exports: [SumUpReceiptService],
  imports: [SumUpBaseModule],
  providers: [SumUpReceiptService],
})
export class SumUpReceiptModule {}
