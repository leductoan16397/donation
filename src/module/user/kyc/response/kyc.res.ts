import { Exclude } from 'class-transformer';
import { BaseResponse } from 'src/common/common.response';
import { User } from '../../../entity/user.entity';
import { KycStatus } from 'src/common/enum';
import { CountryCode } from 'countries-and-timezones';
import { Gender } from 'src/common/constant';

export class KycData extends BaseResponse {
  status: KycStatus;
  files: string[];
  rejectedReason?: string;
  approvedBy?: User;
  approvedAt?: Date;
  user: User;

  fullName: string;

  avatar: string;

  gender: Gender;

  birthday: Date;

  email: string;

  phone: string;

  country: CountryCode;

  address: string;

  state: string;

  city: string;

  zipCode: string;

  about: string;

  @Exclude()
  deletedAt: Date;
  constructor(partial: Partial<KycData>) {
    super();
    Object.assign(this, partial);
  }
}
