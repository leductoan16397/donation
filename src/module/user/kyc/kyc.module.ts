import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kyc } from '../../entity/kyc.entity';
import { KycService } from './kyc.service';
import { User } from '../../entity/user.entity';
import { KycController } from './kyc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Kyc])],
  providers: [KycService],
  controllers: [KycController],
  exports: [KycService],
})
export class KycModule {}
