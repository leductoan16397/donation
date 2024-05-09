import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { UploadModule } from './upload/upload.module';
import { SumUpModule } from './payment/sumup/sumup.module';

@Module({
  imports: [MailModule, UploadModule, SumUpModule],
  providers: [MailService],
  controllers: [],
  exports: [MailService],
})
export class CommonModule {}
