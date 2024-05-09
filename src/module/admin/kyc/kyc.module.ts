import { Module } from '@nestjs/common';
import { AdminKycController } from './kyc.controller';
import { AdminKycService } from './kyc.service';
import { MailModule } from 'src/module/common/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/module/entity/user.entity';
import { Kyc } from 'src/module/entity/kyc.entity';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([User, Kyc])],
  providers: [AdminKycService],
  controllers: [AdminKycController],
  exports: [],
})
export class AdminKycModule {}
