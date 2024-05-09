import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCheckoutDTO {
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}
