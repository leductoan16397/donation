import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from 'src/common/common.dto';
import { KycStatus } from 'src/common/enum';

export class RejectKycDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  rejectedReason: string;
}

export class AdminFindKycListDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  @IsIn([
    'createdAt',
    'status',
    'fullName',
    'gender',
    'birthday',
    'email',
    'phone',
    'country',
    'address',
    'state',
    'city',
    'zipCode',
    'about',
  ])
  @ApiProperty({ default: 'createdAt', required: false })
  sort?:
    | 'createdAt'
    | 'status'
    | 'fullName'
    | 'gender'
    | 'birthday'
    | 'email'
    | 'phone'
    | 'country'
    | 'address'
    | 'state'
    | 'city'
    | 'zipCode'
    | 'about';

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @IsEnum(KycStatus)
  @IsOptional()
  @ApiProperty({ enum: KycStatus, required: false })
  status?: KycStatus;
}
