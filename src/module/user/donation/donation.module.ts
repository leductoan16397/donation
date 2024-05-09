import { Module, OnModuleInit } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation, DonationRequestChange } from 'src/module/entity/donation.entity';
import { Kyc } from 'src/module/entity/kyc.entity';
import { User } from 'src/module/entity/user.entity';
import { MailModule } from 'src/module/common/mail/mail.module';
import { CheckoutModule } from '../payment/checkout/checkout.module';
import { Checkout } from 'src/module/entity/checkout.entity';
import { WithdrawalRequestModule } from '../withdrawal_request/withdrawal_request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Donation, Kyc, Checkout, DonationRequestChange]),
    MailModule,
    CheckoutModule,
    WithdrawalRequestModule,
  ],
  controllers: [DonationController],
  providers: [DonationService],
  exports: [DonationService],
})
export class DonationModule implements OnModuleInit {
  constructor(private readonly donationService: DonationService) {}
  async onModuleInit() {
    // await this.donationService.syncMissingCanWithDrawnAmount();
  }
}
