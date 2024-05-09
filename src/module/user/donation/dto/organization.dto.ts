import { IsString, MaxLength } from 'class-validator';

export class OrganizationDTO {
  @MaxLength(500)
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsString()
  @MaxLength(500)
  website: string;

  @IsString()
  @MaxLength(500)
  address: string;

  @IsString()
  @MaxLength(500)
  email: string;

  @IsString()
  @MaxLength(500)
  phone: string;
}
