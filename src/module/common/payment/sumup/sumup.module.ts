import { Module } from '@nestjs/common';
import { SumUpTransactionModule } from './transaction/transaction.module';
import { SumUpSubAccountModule } from './subaccount/subaccount.module';
import { SumUpReceiptModule } from './receipt/receipt.module';
import { SumUpPayoutModule } from './payout/payout.module';
import { SumUpMerchantModule } from './merchant/merchant.module';
import { SumUpCustomerModule } from './customer/customer.module';
import { SumUpCheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    SumUpTransactionModule,
    SumUpSubAccountModule,
    SumUpReceiptModule,
    SumUpPayoutModule,
    SumUpMerchantModule,
    SumUpCustomerModule,
    SumUpCheckoutModule,
  ],
})
export class SumUpModule {}
