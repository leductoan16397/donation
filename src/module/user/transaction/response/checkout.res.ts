import { Exclude, Expose } from 'class-transformer';
import { BaseResponse } from 'src/common/common.response';
import { Donation } from 'src/module/entity/donation.entity';
import { CountryCode } from 'countries-and-timezones';
import { CurrencyCode, UserRole } from 'src/common/enum';
import {
  SumUpCheckoutPurpose,
  SumUpCheckoutStatus,
  SumUpTransaction,
} from 'src/module/common/payment/sumup/base/sumup.type';

export class CheckoutData extends BaseResponse {
  donation: Donation;
  name: string;
  email: string;
  amount: number;
  currency: CurrencyCode;
  date?: Date;

  @Expose({ groups: [UserRole.Admin, UserRole.Employee] })
  transaction_code?: string;

  @Expose({ groups: [UserRole.Admin, UserRole.Employee] })
  transaction_id?: string;

  @Expose({ groups: [UserRole.Admin, UserRole.Employee] })
  description?: string;

  @Expose({ groups: [UserRole.Admin, UserRole.Employee] })
  transactions: SumUpTransaction[];

  @Exclude()
  checkoutId?: string;

  @Exclude()
  pay_to_email: string;

  @Exclude()
  merchant_code: string;

  @Exclude()
  merchant_name: string;

  @Exclude()
  merchant_country: CountryCode;

  @Exclude()
  purpose: SumUpCheckoutPurpose;

  @Exclude()
  return_url: string;

  @Exclude()
  redirect_url?: string;

  @Exclude()
  status?: SumUpCheckoutStatus;

  @Exclude()
  deletedAt: Date;
  constructor(partial: Partial<CheckoutData>) {
    super();
    Object.assign(this, partial);
  }
}
