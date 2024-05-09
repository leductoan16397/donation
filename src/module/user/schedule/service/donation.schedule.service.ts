import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation, DonationStatus } from 'src/module/entity/donation.entity';
import { LessThan, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { DonationService } from '../../donation/donation.service';
import { KycStatus } from 'src/common/enum';

@Injectable({})
export class DonationScheduleService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Donation) private readonly donationRepository: Repository<Donation>,
    private readonly donationService: DonationService,
  ) {}

  @Cron(CronExpression.EVERY_4_HOURS, {})
  async syncDonation() {
    try {
      const inprogressDonations = await this.donationRepository.find({
        where: {
          status: DonationStatus.INPROGRESS,
          effectiveTo: LessThan(moment().add(5, 'hour').toDate()),
        },
      });

      inprogressDonations.forEach(async (donation) => {
        if (donation.effectiveTo < moment().add(5, 'second').toDate()) {
          await this.donationService.completeDonation(donation.id);
        } else {
          await this.donationService.addDonationCompletedConJob({ id: donation.id });
        }
      });

      const notStartDonations = await this.donationRepository.find({
        where: {
          status: DonationStatus.NOT_START,
          kycStatus: KycStatus.VERIFIED,
          effectiveFrom: LessThan(moment().add(5, 'hour').toDate()),
        },
      });

      notStartDonations.forEach(async (donation) => {
        if (donation.effectiveFrom < moment().add(5, 'second').toDate()) {
          await this.donationService.startDonation(donation.id);
        } else {
          await this.donationService.addDonationStartConJob({ id: donation.id });
          await this.donationService.addDonationCompletedConJob({ id: donation.id });
        }
      });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ DonationScheduleService ~ syncDonation ~ error:`, error);
    }
  }
}
