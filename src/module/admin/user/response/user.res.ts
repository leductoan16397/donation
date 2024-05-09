import { Exclude } from 'class-transformer';
import { CountryCode } from 'countries-and-timezones';
import { BaseResponse } from 'src/common/common.response';
import { KycStatus, UserRole } from 'src/common/enum';

export class UserData extends BaseResponse {
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  kycStatus: KycStatus;
  country?: CountryCode;

  @Exclude()
  deletedAt: Date;

  @Exclude()
  hashedPassword: string;

  @Exclude()
  salt: string;

  constructor(partial: Partial<UserData>) {
    super();
    Object.assign(this, partial);
  }
}
