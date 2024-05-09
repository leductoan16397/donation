import { CountryCode } from 'countries-and-timezones';
import { DEFAULT_SCHEMA } from 'src/common/constant';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { KycStatus, UserRole } from 'src/common/enum';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh.token.entity';
import { Kyc } from './kyc.entity';
import { Donation } from './donation.entity';

@Entity({ name: 'users', schema: DEFAULT_SCHEMA })
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ select: false })
  salt: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: KycStatus.NO_VERIFY, enum: KycStatus })
  kycStatus: KycStatus;

  @Column({ select: false })
  hashedPassword: string;

  @Column({ nullable: true })
  country?: CountryCode;

  @Column({ enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => RefreshToken, (token) => token.user, { nullable: true })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Kyc, (kyc) => kyc.user, { nullable: true })
  kycs?: Kyc[];

  @OneToMany(() => Kyc, (kyc) => kyc.approvedBy, { nullable: true })
  approvedKycs?: Kyc[];

  @OneToMany(() => Donation, (donation) => donation.approvedBy, { nullable: true })
  approvedDonations?: Donation[];

  @OneToMany(() => Donation, (donation) => donation.owner, { nullable: true })
  donations?: Donation[];

  @DeleteDateColumn()
  deletedAt: Date;
}
