import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { DefaultSort, OrderDirection } from './enum';

export class BaseFilterDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'asc', required: false })
  order?: 'asc' | 'desc';

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;
}

export class DefaultFilterDto {
  @IsEnum(DefaultSort)
  @IsOptional()
  @ApiProperty({ enum: DefaultSort, default: DefaultSort.CREATED_AT, required: false })
  sort?: DefaultSort | string = DefaultSort.CREATED_AT;

  @IsEnum(OrderDirection)
  @IsOptional()
  @ApiProperty({ enum: OrderDirection, default: OrderDirection.DESC, required: false })
  order?: OrderDirection = OrderDirection.DESC;

  @ApiProperty({ default: 0 })
  @IsInt()
  @Min(0)
  page: number = 0;

  @ApiProperty({ default: 10 })
  @IsInt()
  @Min(1)
  pageSize?: number = 10;
}
