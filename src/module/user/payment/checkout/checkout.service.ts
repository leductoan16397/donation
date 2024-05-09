import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WEBHOOK_URL } from 'src/common/constant';
import { SumUpCheckoutPurpose, SumUpCheckoutStatus } from 'src/module/common/payment/sumup/base/sumup.type';
import { SumUpCheckoutService } from 'src/module/common/payment/sumup/checkout/checkout.service';
import { Checkout } from 'src/module/entity/checkout.entity';
import { Donation, DonationStatus } from 'src/module/entity/donation.entity';
import { Repository } from 'typeorm';
import { CreateCheckoutDTO } from './dto/checkout.dto';
import { CurrencyCode } from 'src/common/enum';
import { SumUpMerchantService } from 'src/module/common/payment/sumup/merchant/merchant.service';
import { DonationService } from '../../donation/donation.service';

@Injectable()
export class CheckoutService {
  private merchant_code: string;
  private default_currency: CurrencyCode;
  constructor(
    private readonly donationService: DonationService,
    private readonly sumUpCheckoutService: SumUpCheckoutService,
    private readonly sumUpMerchantService: SumUpMerchantService,
    @InjectRepository(Donation) private readonly donationRepository: Repository<Donation>,
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,
  ) {
    this.sumUpMerchantService.retrieveMerchantProfile().then((profile) => {
      this.merchant_code = profile.merchant_code;
      this.default_currency = profile.default_currency;
    });
  }

  async createCheckout({ input, donationId }: { donationId: string; input: CreateCheckoutDTO }) {
    try {
      const { amount, email, name, description } = input;
      const donation = await this.donationRepository.findOne({
        where: { id: donationId },
      });

      if (!donation) {
        throw new BadRequestException('Donation Not Found');
      }
      switch (donation.status) {
        case DonationStatus.COMPLETED:
          throw new BadRequestException('Donation Completed');

        case DonationStatus.DELETED:
          throw new BadRequestException('Donation Deleted');

        case DonationStatus.NOT_START:
          throw new BadRequestException('Donation Not Started Yet');

        case DonationStatus.INPROGRESS:
        default:
          const currency = this.default_currency;

          const checkout = this.checkoutRepository.create({
            amount,
            email,
            name,
            description,
            donation,
            currency,
            return_url: WEBHOOK_URL,
          });

          const newCheckout = await this.checkoutRepository.save(checkout);

          if (!this.merchant_code) {
            const profile = await this.sumUpMerchantService.retrieveMerchantProfile();
            this.merchant_code = profile.merchant_code;
          }

          const sumUpCheckout = await this.sumUpCheckoutService.create({
            body: {
              amount,
              currency,
              purpose: SumUpCheckoutPurpose.CHECKOUT,
              checkout_reference: newCheckout.id,
              merchant_code: this.merchant_code,
              return_url: WEBHOOK_URL,
              description,
            },
          });

          this.syncCheckout({ checkoutId: sumUpCheckout.id }).catch((err) => {
            console.log(
              `${new Date().toString()} 🚀 ~ file: checkout.service.ts:64 ~ CheckoutService ~ this.syncCheckout ~ err:`,
              err,
            );
          });

          return { checkoutId: sumUpCheckout.id };
      }
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: employee.service.ts:146 ~ EmployeeService ~ createCheckout ~ error:`,
        error,
      );
      throw error;
    }
  }

  async syncCheckout({ checkoutId }: { checkoutId: string }) {
    const sumUpCheckout = await this.sumUpCheckoutService.retrieve({ id: checkoutId });

    const checkout = await this.checkoutRepository.findOne({
      where: {
        id: sumUpCheckout.checkout_reference,
      },
    });

    if (
      !checkout ||
      (checkout.status === SumUpCheckoutStatus.PAID && sumUpCheckout.status !== SumUpCheckoutStatus.PAID)
    ) {
      return;
    }

    await this.checkoutRepository.update(
      { id: sumUpCheckout.checkout_reference },
      {
        checkoutId: sumUpCheckout.id,
        currency: sumUpCheckout.currency,
        date: sumUpCheckout.date,
        merchant_code: sumUpCheckout.merchant_code,
        merchant_country: sumUpCheckout.merchant_country,
        merchant_name: sumUpCheckout.merchant_name,
        purpose: sumUpCheckout.purpose,
        pay_to_email: sumUpCheckout.pay_to_email,
        redirect_url: sumUpCheckout.redirect_url,
        return_url: sumUpCheckout.return_url,
        status: sumUpCheckout.status,
        transaction_code: sumUpCheckout.transaction_code,
        transactions: sumUpCheckout.transactions,
      },
    );
  }

  async completeCheckout({ input }: { input: any }) {
    try {
      console.log(
        `${new Date().toString()} 🚀 ~ file: employee.service.ts:127 ~ EmployeeService ~ createCheckout ~ input:`,
        input,
      );
      const rs = await this.sumUpCheckoutService.process({
        id: input.id,
        body: {
          card: input.card,
          payment_type: 'card',
        },
      });
      return rs;
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: employee.service.ts:167 ~ EmployeeService ~ completeCheckout ~ error:`,
        error,
      );
    }
  }

  async completeDonationIfCompletedAmount({ checkoutId }: { checkoutId: string }) {
    try {
      const sumUpCheckout = await this.sumUpCheckoutService.retrieve({ id: checkoutId });

      const checkout = await this.checkoutRepository.findOne({
        where: {
          id: sumUpCheckout.checkout_reference,
        },
        relations: {
          donation: true,
        },
      });

      if (!checkout?.donation || checkout?.donation.status !== DonationStatus.INPROGRESS) {
        return;
      }

      if (await this.donationService.isCompletedTargetAmount({ id: checkout.donation.id })) {
        await this.donationService.completeDonation(checkout.donation.id);
      }
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: checkout.service.ts:149 ~ CheckoutService ~ completeDonationIfCompletedAmount ~ error:`,
        error,
      );
    }
  }

  async webhook({ input }: { input: any }) {
    try {
      const { id: checkoutId } = input;

      await this.syncCheckout({ checkoutId });

      this.completeDonationIfCompletedAmount({ checkoutId });

      return { isSuccess: true };
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: checkout.service.ts:84 ~ CheckoutService ~ webhook ~ error:`,
        error,
      );
    }
  }
}
