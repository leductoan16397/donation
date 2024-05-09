import { Module, OnModuleInit } from '@nestjs/common';
import { DonationScheduleService } from './service/donation.schedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DonationModule } from '../donation/donation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from 'src/module/entity/donation.entity';

@Module({
  imports: [ScheduleModule.forRoot(), DonationModule, TypeOrmModule.forFeature([Donation])],
  providers: [DonationScheduleService],
})
export class TaskScheduleModule implements OnModuleInit {
  constructor(private readonly donationScheduleService: DonationScheduleService) {}

  async onModuleInit() {
    await this.donationScheduleService.syncDonation();
  }
}
