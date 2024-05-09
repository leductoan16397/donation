import { Module } from '@nestjs/common';
import { PublicDonationService } from './donation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from 'src/module/entity/donation.entity';
import { PublicDonationController } from './donation.controller';
import { Checkout } from 'src/module/entity/checkout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, Checkout])],
  providers: [PublicDonationService],
  controllers: [PublicDonationController],
  exports: [PublicDonationService],
})
export class PublicDonationModule {}
