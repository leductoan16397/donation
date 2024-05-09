import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class BaseResponse {
  id: string;
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

export class Pagination<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({})
  page: number;

  @ApiProperty({})
  totalPage: number;

  @ApiProperty({})
  pageSize: number;

  @ApiProperty({})
  total: number;
}
