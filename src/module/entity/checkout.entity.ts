import { DEFAULT_SCHEMA } from 'src/common/constant';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength } from 'class-validator';
import { Donation } from './donation.entity';
import { CurrencyCode } from 'src/common/enum';
import { CountryCode } from 'countries-and-timezones';
import { SumUpCheckoutPurpose, SumUpCheckoutStatus, SumUpTransaction } from '../common/payment/sumup/base/sumup.type';
import { DecimalColumnTransformer } from 'src/common/entity/transformer';

@Entity({ name: 'checkouts', schema: DEFAULT_SCHEMA })
export class Checkout extends AbstractEntity {
  @ManyToOne(() => Donation, (donation) => donation.checkouts, { nullable: false })
  donation: Donation;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  name?: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  email?: string;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  checkoutId?: string;

  @Column('double precision', { nullable: true, default: 0, transformer: new DecimalColumnTransformer() })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Column({ nullable: false, enum: CurrencyCode })
  @IsEnum(CurrencyCode)
  currency: CurrencyCode;

  @Column({ nullable: true })
  pay_to_email: string;

  @Column({ nullable: true })
  merchant_code: string;

  @Column({ nullable: true })
  merchant_name: string;

  @Column({ nullable: true })
  merchant_country: CountryCode;

  @Column({ nullable: true })
  purpose: SumUpCheckoutPurpose;

  @Column({ nullable: false })
  @IsUrl()
  return_url: string;

  @Column({ nullable: true })
  @IsUrl()
  redirect_url?: string;

  @Column({ nullable: true })
  status?: SumUpCheckoutStatus;

  @Column({ nullable: true })
  date?: Date;

  @Column({ nullable: true })
  transaction_code?: string;

  @Column({ nullable: true })
  transaction_id?: string;

  @Column('json', { nullable: true })
  transactions: SumUpTransaction[];

  @Column({ nullable: true, type: 'text' })
  @IsString()
  description?: string;
}
