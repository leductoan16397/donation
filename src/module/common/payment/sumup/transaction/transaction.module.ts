import { Module } from '@nestjs/common';
import { SumUpTransactionService } from './transaction.service';
import { SumUpBaseModule } from '../base/base.module';

@Module({
  controllers: [],
  exports: [SumUpTransactionService],
  imports: [SumUpBaseModule],
  providers: [SumUpTransactionService],
})
export class SumUpTransactionModule {}
