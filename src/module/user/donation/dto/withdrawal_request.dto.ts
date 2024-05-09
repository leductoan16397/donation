import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { DefaultFilterDto } from 'src/common/common.dto';
import { WithdrawalRequestStatus } from 'src/module/entity/withdrawal_request.entity';

export class CreateWithdrawalRequestDTO {
  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty({})
  creditAccount: string;

  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty({})
  beneficiaryBankName: string;

  @IsString()
  @ApiProperty({ required: true })
  @IsNotEmpty({})
  beneficiaryName: string;

  @IsNumber()
  @ApiProperty({ required: true, minimum: 0 })
  @IsNotEmpty({})
  @IsPositive()
  @Min(0, {})
  requestAmount: number;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;
}

export class UpdateWithdrawalRequestDTO extends PartialType(CreateWithdrawalRequestDTO) {}

export class FindWithdrawalRequestListDto extends DefaultFilterDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  donationId?: string;

  @IsEnum(WithdrawalRequestStatus)
  @IsOptional()
  @ApiProperty({ enum: WithdrawalRequestStatus, required: false })
  status?: WithdrawalRequestStatus;
}
