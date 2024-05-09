import { Module, forwardRef } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { SumUpCheckoutModule } from 'src/module/common/payment/sumup/checkout/checkout.module';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from 'src/module/entity/donation.entity';
import { User } from 'src/module/entity/user.entity';
import { Checkout } from 'src/module/entity/checkout.entity';
import { SumUpMerchantModule } from 'src/module/common/payment/sumup/merchant/merchant.module';
import { DonationModule } from '../../donation/donation.module';

@Module({
  imports: [
    SumUpCheckoutModule,
    forwardRef(() => DonationModule),
    SumUpMerchantModule,
    TypeOrmModule.forFeature([User, Donation, Checkout]),
  ],
  controllers: [CheckoutController],
  exports: [CheckoutService],
  providers: [CheckoutService],
})
export class CheckoutModule {}
