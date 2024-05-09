import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from 'src/module/common/config/config.module';
import { ConfigService } from 'src/module/common/config/config.service';
import { JwtStrategy } from './guard/jwt.strategy';
import { OnModuleInit } from '@nestjs/common';
import { MailModule } from 'src/module/common/mail/mail.module';
import { RefreshTokenModule } from './refresh_token/refresh.token.module';
import { OtpCode, BlockOTP } from '../entity/otp.entity';
import { User } from '../entity/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, OtpCode, BlockOTP]),
    RefreshTokenModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get().auth.access_token_secret,
          signOptions: { expiresIn: configService.get().auth.token_expire_time },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    await this.authService.createSuperAdmin();
  }
}
