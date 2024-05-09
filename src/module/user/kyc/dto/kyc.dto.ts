import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ArrayMinSize, IsDate, IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { CountryCode, getAllCountries } from 'countries-and-timezones';
import { BaseFilterDto } from 'src/common/common.dto';
import { Gender } from 'src/common/constant';
import { KycStatus } from 'src/common/enum';

export class CreateKycDTO {
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty()
  files: string[];

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @ApiProperty()
  @IsDate()
  birthday: Date;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsIn(Object.keys(getAllCountries()))
  country: CountryCode;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  about: string;
}

export class UpdateKycDTO extends PartialType(CreateKycDTO) {}

export class FindKycListDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  @IsIn(['createdAt'])
  @ApiProperty({ default: 'createdAt', required: false })
  sort?: 'createdAt';

  @IsEnum(KycStatus)
  @IsOptional()
  @ApiProperty({ enum: KycStatus, required: false })
  status?: KycStatus;
}
