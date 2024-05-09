import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { RouterModule } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AdminKycModule } from './kyc/kyc.module';
import { AdminDonationModule } from './donation/donation.module';
import { EmployeeModule } from './employee/employee.module';
import { AdminWithdrawalRequestModule } from './withdrawal_request/withdrawal_request.module';

const adminPath = 'admin';
@Module({
  imports: [
    CommonModule,
    UserModule,
    AdminKycModule,
    AdminDonationModule,
    EmployeeModule,
    AdminWithdrawalRequestModule,
    RouterModule.register([
      { path: adminPath, module: UserModule },
      { path: adminPath, module: AdminKycModule },
      { path: adminPath, module: AdminDonationModule },
      { path: adminPath, module: EmployeeModule },
      { path: adminPath, module: AdminWithdrawalRequestModule },
    ]),
  ],
  providers: [],
})
export class AdminModule {}
