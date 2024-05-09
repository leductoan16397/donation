import { Exclude } from 'class-transformer';
import { CountryCode } from 'countries-and-timezones';
import { BaseResponse } from 'src/common/common.response';
import { KycStatus, UserRole } from 'src/common/enum';

export class EmployeeData extends BaseResponse {
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  country?: CountryCode;

  @Exclude()
  kycStatus: KycStatus;

  @Exclude()
  deletedAt: Date;

  @Exclude()
  hashedPassword: string;

  constructor(partial: Partial<EmployeeData>) {
    super();
    Object.assign(this, partial);
  }
}
