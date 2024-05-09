import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { RouterModule } from '@nestjs/core';
import { PublicDonationModule } from './donation/donation.module';

const publicPath = 'public';

@Module({
  imports: [
    CommonModule,
    PublicDonationModule,
    RouterModule.register([{ path: publicPath, module: PublicDonationModule }]),
  ],
  providers: [],
})
export class PublicModule {}
