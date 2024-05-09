import { DEFAULT_SCHEMA } from 'src/common/constant';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';
import { IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { User } from 'src/module/entity/user.entity';
import { Donation } from './donation.entity';
import { DecimalColumnTransformer } from 'src/common/entity/transformer';

export enum WithdrawalRequestStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  REJECTED = 'REJECTED',
}

/**
 * @description: Yêu cầu rút tiền
 */
@Entity({ name: 'withdrawal_request', schema: DEFAULT_SCHEMA })
export class WithdrawalRequest extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.donations)
  user: User;

  @ManyToOne(() => Donation, (donation) => donation.withdrawalRequests)
  donation: Donation;

  @Column({ nullable: false })
  creditAccount: string;

  @Column({ nullable: false })
  beneficiaryName: string;

  @Column({ nullable: false })
  beneficiaryBankName: string;

  @Column('double precision', { default: 0, nullable: true, transformer: new DecimalColumnTransformer() })
  @IsNumber()
  @Min(0)
  requestAmount: number;

  @Column({ nullable: true, type: 'text' })
  @IsString()
  description?: string;

  @Column({ enum: WithdrawalRequestStatus })
  @MaxLength(50)
  status: WithdrawalRequestStatus;

  @ManyToOne(() => User, (user) => user.approvedDonations, { nullable: true })
  approvedBy?: User;

  @Column({ nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  rejectedReason?: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
