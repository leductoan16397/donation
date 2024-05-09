import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  // IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DefaultFilterDto } from 'src/common/common.dto';
import { KycStatus } from 'src/common/enum';
import { AvailableDonationStatus, DonationType } from 'src/module/entity/donation.entity';
import { OrganizationDTO } from './organization.dto';

export class CreateDonationDTO {
  @Min(0, { message: 'targetAmount must be greater than 0' })
  @IsNumber()
  @ApiProperty()
  targetAmount: number;

  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description: string;

  // @IsEnum(DonationStatus)
  // @ApiProperty({ enum: DonationStatus, default: DonationStatus.NOT_START })
  // status: DonationStatus;

  // @IsEnum(KycStatus)
  // @ApiProperty({ enum: KycStatus, default: KycStatus.NO_VERIFY })
  // kycStatus: KycStatus;

  @IsEnum(DonationType)
  @ApiProperty({ enum: DonationType, default: DonationType.INDIVIDUAL })
  type: DonationType;

  @IsNotEmpty({ message: 'Effective from date is required' })
  @IsDate()
  @ApiProperty({ required: true, type: Date, default: new Date() })
  effectiveFrom: Date;

  @IsNotEmpty({ message: 'Effective to date is required' })
  @IsDate()
  @ApiProperty({ required: true, type: Date, default: new Date() })
  effectiveTo: Date;

  @IsString()
  @ApiProperty()
  @IsOptional()
  thumbnail: string;

  @IsArray()
  @ApiProperty({ type: [String], default: [] })
  images: string[];

  @IsArray()
  @ApiProperty({ type: [String], default: [] })
  documents: string[];

  @IsObject()
  @ApiProperty({ required: false, type: OrganizationDTO })
  @IsOptional()
  organization?: OrganizationDTO;

  // @IsString()
  // @ApiProperty({ required: false })
  // transactionCode: string;
}

export class UpdateDonationDTO extends PartialType(CreateDonationDTO) {}

export class FindDonationListDto extends DefaultFilterDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  effectiveFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  effectiveTo?: Date;

  @IsEnum(AvailableDonationStatus)
  @IsOptional()
  @ApiProperty({ enum: AvailableDonationStatus, required: false })
  status?: AvailableDonationStatus;

  @IsEnum(KycStatus)
  @IsOptional()
  @ApiProperty({ enum: KycStatus, required: false })
  kycStatus?: KycStatus;

  @IsEnum(DonationType)
  @IsOptional()
  @ApiProperty({ enum: DonationType, required: false })
  type?: DonationType;
}
