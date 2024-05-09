import { Module } from '@nestjs/common';
import { AdminWithdrawalRequestController } from './withdrawal_request.controller';
import { AdminWithdrawalRequestService } from './withdrawal_request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalRequest } from 'src/module/entity/withdrawal_request.entity';
import { User } from 'src/module/entity/user.entity';
import { Donation } from 'src/module/entity/donation.entity';
import { MailModule } from 'src/module/common/mail/mail.module';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([WithdrawalRequest, User, Donation])],
  controllers: [AdminWithdrawalRequestController],
  providers: [AdminWithdrawalRequestService],
  exports: [AdminWithdrawalRequestService],
})
export class AdminWithdrawalRequestModule {}
