import { DEFAULT_SCHEMA } from 'src/common/constant';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, VirtualColumn } from 'typeorm';
import { IsDate, IsNumber, IsObject, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import { KycStatus } from 'src/common/enum';
import { User } from 'src/module/entity/user.entity';
import { OrganizationDTO } from '../user/donation/dto/organization.dto';
import { Checkout } from './checkout.entity';
import { WithdrawalRequest } from './withdrawal_request.entity';
import { SumUpCheckoutStatus } from '../common/payment/sumup/base/sumup.type';
import { DecimalColumnTransformer } from 'src/common/entity/transformer';

export enum DonationStatus {
  INPROGRESS = 'INPROGRESS',
  NOT_START = 'NOT_START',
  COMPLETED = 'COMPLETED',
  DELETED = 'DELETED',
}

export enum AvailableDonationStatus {
  INPROGRESS = 'INPROGRESS',
  NOT_START = 'NOT_START',
  COMPLETED = 'COMPLETED',
}

export enum DonationType {
  INDIVIDUAL = 'INDIVIDUAL',
  ORGANIZATION = 'ORGANIZATION',
}

@Entity({ name: 'donations', schema: DEFAULT_SCHEMA })
export class Donation extends AbstractEntity {
  /**
   * @description: User who donate
   */
  @ManyToOne(() => User, (user) => user.donations)
  owner: User;

  @Column('double precision', { default: 0, nullable: true, transformer: new DecimalColumnTransformer() })
  @IsNumber()
  @Min(0)
  targetAmount: number;

  @Column({ nullable: false })
  @MaxLength(500)
  @IsString()
  name: string;

  @Column({ nullable: true, type: 'text' })
  @IsString()
  description?: string;

  @Column({ enum: DonationStatus })
  @MaxLength(50)
  status: DonationStatus;

  @Column({ enum: KycStatus, default: KycStatus.NO_VERIFY })
  @MaxLength(50)
  kycStatus: KycStatus;

  @Column({ enum: DonationType })
  @MaxLength(50)
  type: DonationType;

  /**
   * @description: Effective from date of donation
   */
  @Column({ nullable: false })
  @IsDate()
  effectiveFrom: Date;

  /**
   * @description: Effective to date of donation
   */
  @Column({ nullable: false })
  @IsDate()
  effectiveTo: Date;

  @Column({ nullable: true })
  @IsUrl()
  thumbnail?: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column('text', { array: true, nullable: true })
  documents: string[];

  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  transactionCode: string;

  @Column({ nullable: true, type: 'json' })
  @IsObject()
  organization?: OrganizationDTO;

  @ManyToOne(() => User, (user) => user.approvedDonations, { nullable: true })
  approvedBy?: User;

  @OneToMany(() => Checkout, (checkout) => checkout.donation, { nullable: true })
  checkouts?: Checkout[];

  @OneToMany(() => WithdrawalRequest, (withdrawalRequest) => withdrawalRequest.donation, { nullable: true })
  withdrawalRequests?: WithdrawalRequest[];

  @Column({ nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  rejectedReason?: string;

  @Column('double precision', { default: 0, transformer: new DecimalColumnTransformer() })
  canWithdrawnAmount: number;

  @Column('double precision', { default: 0, transformer: new DecimalColumnTransformer() })
  maxWithdrawnAmount: number;

  @OneToMany(() => DonationRequestChange, (requestChange) => requestChange.donation, { nullable: true })
  requestChanges?: DonationRequestChange[];

  @DeleteDateColumn()
  deletedAt: Date;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "${DEFAULT_SCHEMA}"."checkouts" WHERE "donation_id" = ${alias}.id AND "status" = '${SumUpCheckoutStatus.PAID}'`,
  })
  totalDonate?: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COALESCE(SUM(amount), 0) FROM "${DEFAULT_SCHEMA}"."checkouts" WHERE "donation_id" = ${alias}.id AND "status" = '${SumUpCheckoutStatus.PAID}'`,
    transformer: {
      to: (v) => v || 0,
      from: (v) => v || 0,
    },
  })
  currentAmount?: number;
}

@Entity({ name: 'donation_request_changes', schema: DEFAULT_SCHEMA })
export class DonationRequestChange extends AbstractEntity {
  @Column({ nullable: true })
  @IsDate()
  effectiveTo?: Date;

  @Column({ nullable: true })
  @IsNumber()
  @Min(0)
  targetAmount?: number;

  @Column({ nullable: true })
  approvedAt?: Date;

  @ManyToOne(() => User, (user) => user.approvedDonations, { nullable: true })
  approvedBy?: User;

  @Column({ nullable: true })
  rejectedReason?: string;

  @ManyToOne(() => Donation, (donation) => donation.requestChanges, { nullable: true })
  donation?: Donation;

  @Column({ enum: KycStatus, default: KycStatus.NO_VERIFY })
  @MaxLength(50)
  kycStatus: KycStatus;
}
