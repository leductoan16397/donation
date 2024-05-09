import { Module } from '@nestjs/common';
import { WithdrawalRequestController } from './withdrawal_request.controller';
import { WithdrawalRequestService } from './withdrawal_request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalRequest } from 'src/module/entity/withdrawal_request.entity';
import { User } from 'src/module/entity/user.entity';
import { Donation } from 'src/module/entity/donation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalRequest, User, Donation])],
  controllers: [WithdrawalRequestController],
  providers: [WithdrawalRequestService],
  exports: [WithdrawalRequestService],
})
export class WithdrawalRequestModule {}
