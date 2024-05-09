import { DEFAULT_SCHEMA, Gender } from 'src/common/constant';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { KycStatus } from 'src/common/enum';
import { CountryCode } from 'countries-and-timezones';

@Entity({ name: 'kycs', schema: DEFAULT_SCHEMA })
export class Kyc extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.kycs)
  user: User;

  @Column({ enum: KycStatus })
  status: KycStatus;

  @Column({})
  fullName: string;

  @Column({})
  avatar: string;

  @Column({ enum: Gender })
  gender: Gender;

  @Column({})
  birthday: Date;

  @Column({})
  email: string;

  @Column({})
  phone: string;

  @Column({})
  country: CountryCode;

  @Column({})
  address: string;

  @Column({})
  state: string;

  @Column({})
  city: string;

  @Column({})
  zipCode: string;

  @Column({})
  about: string;

  @Column('text', { array: true, default: [] })
  files: string[];

  @ManyToOne(() => User, (user) => user.approvedKycs, { nullable: true })
  approvedBy?: User;

  @Column({ nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  rejectedReason?: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
