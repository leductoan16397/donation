import { Module } from '@nestjs/common';
import { MailModule } from 'src/module/common/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/module/entity/user.entity';
import { AdminDonationService } from './donation.service';
import { AdminDonationController } from './donation.controller';
import { Donation, DonationRequestChange } from 'src/module/entity/donation.entity';
import { DonationModule } from 'src/module/user/donation/donation.module';
import { Checkout } from 'src/module/entity/checkout.entity';

@Module({
  imports: [MailModule, DonationModule, TypeOrmModule.forFeature([User, Donation, Checkout, DonationRequestChange])],
  providers: [AdminDonationService],
  controllers: [AdminDonationController],
  exports: [],
})
export class AdminDonationModule {}
