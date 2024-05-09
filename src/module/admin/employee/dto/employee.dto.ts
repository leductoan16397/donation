import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/common.dto';
import { UserRole } from 'src/common/enum';

export class FindEmployeeListDto extends BaseFilterDto {
  @IsOptional()
  @IsIn(['name', 'createdAt', 'email', 'kycStatus', 'country', 'role', 'phone'])
  @ApiProperty({ default: 'name', required: false })
  sort?: 'name' | 'createdAt' | 'email' | 'country' | 'role' | 'phone';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;
}

export class CreateEmployeeDto {
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
  @IsNotEmpty()
  @IsIn([UserRole.Admin, UserRole.Employee])
  @ApiProperty()
  role: UserRole;
}
