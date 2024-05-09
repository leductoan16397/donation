import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseFilterDto } from 'src/common/common.dto';
import { WithdrawalRequestStatus } from 'src/module/entity/withdrawal_request.entity';

export class RejectWithdrawalRequestDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({})
  rejectedReason: string;
}

export class AdminFindWithdrawalRequestListDto extends BaseFilterDto {
  @IsOptional()
  @IsIn(['createdAt'])
  @ApiProperty({ default: 'createdAt', required: false })
  sort?: 'createdAt';

  @IsUUID()
  @IsOptional()
  @ApiProperty({ required: false })
  donationId?: string;

  @IsEnum(WithdrawalRequestStatus)
  @IsOptional()
  @ApiProperty({ enum: WithdrawalRequestStatus, required: false })
  status?: WithdrawalRequestStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  from?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  to?: Date;
}
