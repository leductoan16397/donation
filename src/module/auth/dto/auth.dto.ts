import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator';
import { CountryCode, getAllCountries } from 'countries-and-timezones';
import { OTP_ACTION } from 'src/module/entity/otp.entity';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class VerifyUsernameDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  @IsIn(Object.keys(getAllCountries()))
  country?: CountryCode;
}

export class RefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}

export class RegisterOtpDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: OTP_ACTION })
  @IsEnum(OTP_ACTION)
  action: OTP_ACTION;
}

export class QuickVerifyDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: OTP_ACTION })
  @IsEnum(OTP_ACTION)
  action: OTP_ACTION;
}

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}

export class SelfUpdateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsNumberString()
  @IsOptional()
  @Length(4)
  @ApiProperty({ required: false })
  pin?: string;

  @IsString()
  // @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string;
}
