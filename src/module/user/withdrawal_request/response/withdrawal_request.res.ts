import { Exclude } from 'class-transformer';
import { BaseResponse } from 'src/common/common.response';
import { Donation } from 'src/module/entity/donation.entity';
import { User } from 'src/module/entity/user.entity';
import { WithdrawalRequestStatus } from 'src/module/entity/withdrawal_request.entity';

export class WithdrawalRequestData extends BaseResponse {
  user: User;
  donation: Donation;
  requestAmount: number;
  description: string;
  status: WithdrawalRequestStatus;
  approvedBy?: User;
  approvedAt?: Date;
  rejectedReason?: string;

  @Exclude()
  deletedAt: Date;

  constructor(partial: Partial<WithdrawalRequestData>) {
    super();
    Object.assign(this, partial);
  }
}
