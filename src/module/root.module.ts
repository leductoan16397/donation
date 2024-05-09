import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionFilterHandler } from 'src/common/exception';
import { CustomerModule } from './user/customer.module';
import { AdminModule } from './admin/admin.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [CustomerModule, AdminModule, PublicModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterHandler,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class RootModule {}
