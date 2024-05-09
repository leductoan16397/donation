import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  // IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/common.dto';
import { KycStatus } from 'src/common/enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  // @IsPhoneNumber()
  @IsOptional()
  @ApiPropertyOptional()
  phone?: string;
}

export class UpdateUserDto extends PickType(PartialType(CreateUserDto), ['name', 'phone']) {}

export class FindUserListDto extends BaseFilterDto {
  @IsOptional()
  @IsIn(['name', 'createdAt', 'email', 'kycStatus', 'country', 'role', 'phone'])
  @ApiProperty({ default: 'name', required: false })
  sort?: 'name' | 'createdAt' | 'email' | 'kycStatus' | 'country' | 'role' | 'phone';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @IsEnum(KycStatus)
  @ApiProperty({ required: false, enum: KycStatus })
  status?: KycStatus;
}
