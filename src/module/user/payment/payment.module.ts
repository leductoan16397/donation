import { Module } from '@nestjs/common';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [CheckoutModule],
  controllers: [],
  exports: [],
  providers: [],
})
export class PaymentModule {}
