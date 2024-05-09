import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';

@ApiTags('Checkout')
@Controller('checkouts')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Post('complete-checkout')
  completeCheckout(@Body() input: any) {
    try {
      return this.checkoutService.completeCheckout({ input });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: checkout.controller.ts:25 ~ KycController ~ completeCheckout ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Post('webhook')
  webhook(@Body() input: any) {
    console.log(
      `${new Date().toString()} 🚀 ~ file: checkout.controller.ts:25 ~ CheckoutController ~ webhook ~ input:`,
      input,
    );
    try {
      return this.checkoutService.webhook({ input });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: checkout.controller.ts:35 ~ KycController ~ webhook ~ error:`,
        error,
      );
      throw error;
    }
  }
}
