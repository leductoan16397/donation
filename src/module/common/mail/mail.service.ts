import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { APP_NAME } from 'src/common/constant';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(mailOptions: ISendMailOptions) {
    return this.mailerService.sendMail(mailOptions);
  }

  // send mail otp
  async sendOtp({ email, otp }: { email: string; otp: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] OTP Code`,
      template: './otp.ejs',
      context: {
        otp,
      },
      attachments: [
        {
          filename: 'logo.png',
          content: createReadStream(`${__dirname}/templates/images/logo.png`, {}),
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // user created
  async userCreated({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Account created`,
      template: './user.created.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // kyc approved
  async kycApproved({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Kyc Approved`,
      template: './kyc/kyc.approved.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // kyc rejected
  async kycRejected({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Kyc Rejected`,
      template: './kyc/kyc.rejected.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // request Change approved
  async requestChangeApproved({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Request Change Approved`,
      template: './donation/request.change.approved.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // request Change rejected
  async requestChangeRejected({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Request Change Rejected`,
      template: './donation/request.change.rejected.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // donation approved
  async donationApproved({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Donation Approved`,
      template: './donation/donation.approved.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // donation rejected
  async donationRejected({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Donation Rejected`,
      template: './donation/donation.rejected.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // Withdrawal Request approved
  async withdrawalRequestApproved({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Donation Approved`,
      template: './donation/withdrawal.request.approved.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // Withdrawal Request rejected
  async withdrawalRequestRejected({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Donation Rejected`,
      template: './donation/withdrawal.request.rejected.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // donation completed
  async donationCompleted({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Donation Completed`,
      template: './donation/donation.completed.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // donation started
  async donationStarted({ email }: { email: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Donation Started`,
      template: './donation/donation.started.ejs',
      context: {},
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }

  // add employee
  async employeeCreated({ email, password }: { email: string; password: string }) {
    const rs = await this.sendMail({
      to: email,
      subject: `[${APP_NAME}] Account created`,
      template: './employee.created.ejs',
      context: {
        password,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
    return rs;
  }
}
