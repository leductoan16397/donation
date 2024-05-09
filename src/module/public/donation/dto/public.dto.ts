import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsIn, IsString, IsDate, IsEnum } from 'class-validator';
import { BaseFilterDto } from 'src/common/common.dto';
import { DonationStatus, DonationType } from 'src/module/entity/donation.entity';

export class FindPublicCheckoutListDto extends BaseFilterDto {
  @IsOptional()
  @IsIn(['name', 'createdAt', 'email', 'amount'])
  @ApiProperty({ default: 'name', required: false })
  sort?: 'name' | 'createdAt' | 'email' | 'amount';

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;
}

export class FindPublicDonationListDto extends BaseFilterDto {
  @IsOptional()
  @IsIn(['name', 'createdAt', 'totalDonate', 'currentAmount', 'targetAmount'])
  @ApiProperty({ default: 'name', required: false })
  sort?: 'name' | 'createdAt' | 'totalDonate' | 'currentAmount' | 'targetAmount';

  @IsEnum(DonationType)
  @IsOptional()
  @ApiProperty({ enum: DonationType, required: false })
  type?: DonationType;

  @IsOptional()
  @IsIn([DonationStatus.INPROGRESS, DonationStatus.COMPLETED])
  @ApiProperty({ default: 'name', required: false })
  status?: DonationStatus.INPROGRESS | DonationStatus.COMPLETED;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  effectiveFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false })
  effectiveTo?: Date;
}
