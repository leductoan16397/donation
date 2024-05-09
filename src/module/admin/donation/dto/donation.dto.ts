import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from 'src/common/common.dto';
import { KycStatus } from 'src/common/enum';
import { DonationStatus, DonationType } from 'src/module/entity/donation.entity';

export class RejectDonationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  rejectedReason: string;
}

export class AdminFindDonationListDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  @IsIn([
    'createdAt',
    'targetAmount',
    'name',
    'description',
    'status',
    'kycStatus',
    'type',
    'effectiveFrom',
    'effectiveTo',
  ])
  @ApiProperty({ default: 'createdAt', required: false })
  sort?:
    | 'createdAt'
    | 'targetAmount'
    | 'name'
    | 'description'
    | 'status'
    | 'kycStatus'
    | 'type'
    | 'effectiveFrom'
    | 'effectiveTo';

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @IsEnum(DonationStatus)
  @IsOptional()
  @ApiProperty({ enum: DonationStatus, required: false })
  status?: DonationStatus;

  @IsEnum(KycStatus)
  @IsOptional()
  @ApiProperty({ enum: KycStatus, required: false })
  kycStatus?: KycStatus;

  @IsEnum(DonationType)
  @IsOptional()
  @ApiProperty({ enum: DonationType, required: false })
  type?: DonationType;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  from?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  to?: Date;
}

export class AdminFindRequestChangesDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  @IsIn(['createdAt', 'kycStatus'])
  @ApiProperty({ default: 'createdAt', required: false })
  sort?: 'createdAt' | 'kycStatus';

  @IsEnum(KycStatus)
  @IsOptional()
  @ApiProperty({ enum: KycStatus, required: false })
  kycStatus?: KycStatus;

  @IsEnum(DonationType)
  @IsOptional()
  @ApiProperty({ enum: DonationType, required: false })
  type?: DonationType;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;
}
