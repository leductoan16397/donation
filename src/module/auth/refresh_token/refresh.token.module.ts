import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenService } from './refresh.token.service';
import { RefreshToken } from 'src/module/entity/refresh.token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokenService],
  controllers: [],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
