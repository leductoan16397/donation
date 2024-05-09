import { Exclude, Transform } from 'class-transformer';
import { BaseResponse } from 'src/common/common.response';
import { KycStatus } from 'src/common/enum';
import { UserData } from 'src/module/admin/user/response/user.res';
import { Checkout } from 'src/module/entity/checkout.entity';
import { Donation, DonationRequestChange, DonationStatus, DonationType } from 'src/module/entity/donation.entity';
import { User } from 'src/module/entity/user.entity';
import * as lodash from 'lodash';

export class DonationData extends BaseResponse {
  owner: UserData;
  targetAmount: number;
  name: string;
  transactionHash: string;
  description: string;
  status: DonationStatus;
  type: DonationType;
  effectiveFrom: Date;
  effectiveTo: Date;
  thumbnail: string;
  images: string[];
  totalDonate: number;
  currentAmount: number;
  canWithdrawnAmount: number;
  maxWithdrawnAmount: number;

  @Transform((d) => {
    return lodash.orderBy(d.value as DonationRequestChange[], ['createdAt'], ['desc']);
  })
  requestChanges?: DonationRequestChange[];

  @Exclude()
  checkouts: Checkout[];

  @Exclude()
  deletedAt: Date;
  constructor(partial: Partial<DonationData>) {
    super();
    Object.assign(this, partial);
  }
}

export class RequestChangeData extends BaseResponse {
  effectiveTo?: Date;
  targetAmount?: number;
  approvedAt?: Date;
  approvedBy?: User;
  rejectedReason?: string;
  donation?: Donation;
  kycStatus: KycStatus;

  constructor(partial: Partial<DonationData>) {
    super();
    Object.assign(this, partial);
  }
}
