import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { KycModule } from './kyc/kyc.module';
import { DonationModule } from './donation/donation.module';
import { UserModule } from '../admin/user/user.module';
import { TaskScheduleModule } from './schedule/task.schedule.module';
import { PaymentModule } from './payment/payment.module';
import { WithdrawalRequestModule } from './withdrawal_request/withdrawal_request.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    KycModule,
    DonationModule,
    TaskScheduleModule,
    PaymentModule,
    WithdrawalRequestModule,
  ],
  providers: [],
})
export class CustomerModule {}
