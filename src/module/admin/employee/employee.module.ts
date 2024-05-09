import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/module/common/mail/mail.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { User } from 'src/module/entity/user.entity';
import { AuthModule } from 'src/module/auth/auth.module';

@Module({
  imports: [MailModule, AuthModule, TypeOrmModule.forFeature([User])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService],
})
export class EmployeeModule {}
