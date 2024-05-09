import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DonationService } from './donation.service';
import { CreateDonationDTO, FindDonationListDto, UpdateDonationDTO } from './dto/donation.dto';
import { CurrentUser } from 'src/common/loggedUser.decorator';
import { LoggedUser } from 'src/common/type';
import { UserRole } from 'src/common/enum';
import { CheckoutService } from '../payment/checkout/checkout.service';
import { isUUID } from 'class-validator';
import { CreateCheckoutDTO } from '../payment/checkout/dto/checkout.dto';
import { Auth, VerifiedUser } from 'src/module/auth/decorator/auth.decorator';
import { FindPublicCheckoutListDto } from 'src/module/public/donation/dto/public.dto';
import { WithdrawalRequestService } from '../withdrawal_request/withdrawal_request.service';
import { CreateWithdrawalRequestDTO } from './dto/withdrawal_request.dto';

@ApiTags('Donation')
@Controller('donations')
export class DonationController {
  constructor(
    private readonly donationService: DonationService,
    private readonly checkoutService: CheckoutService,
    private readonly withdrawalRequestService: WithdrawalRequestService,
  ) {}

  @Get()
  @Auth(UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of donations by filter' })
  find(@Query() query: FindDonationListDto, @CurrentUser() user: LoggedUser) {
    try {
      return this.donationService.find(query, user);
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:23 ~ DonationController ~ find ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Post()
  @VerifiedUser()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new donation' })
  create(@Body() data: CreateDonationDTO, @CurrentUser() user: LoggedUser) {
    try {
      return this.donationService.createDonation(data, user);
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:23 ~ DonationController ~ create ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Delete('cancel-request-change/:id')
  @Auth(UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get donation detail by id' })
  cancelRequestChange(@Param('id') id: string, @CurrentUser() user: LoggedUser) {
    try {
      return this.donationService.cancelRequestChange({ id, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:45 ~ DonationController ~ cancelRequestChange ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Post(':id/create-checkout')
  createCheckout(@Param('id') id: string, @Body() data: CreateCheckoutDTO) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.checkoutService.createCheckout({ donationId: id, input: data });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:109 ~ DonationController ~ createCheckout ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id/withdrawal-requests')
  @VerifiedUser()
  @ApiBearerAuth()
  withdrawalRequests(@Param('id') id: string, @CurrentUser() user: LoggedUser) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.withdrawalRequestService.withdrawalRequestsByDonation({ donationId: id, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:109 ~ DonationController ~ createCheckout ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Post(':id/withdrawal-requests')
  @VerifiedUser()
  @ApiBearerAuth()
  createWithdrawalRequest(
    @Param('id') id: string,
    @Body() data: CreateWithdrawalRequestDTO,
    @CurrentUser() user: LoggedUser,
  ) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.withdrawalRequestService.create({ loggedUser: user, data, donationId: id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:109 ~ DonationController ~ createCheckout ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id/donates')
  @VerifiedUser()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of donates by filter' })
  findDonates(@Param('id') id: string, @Query() query: FindPublicCheckoutListDto, @CurrentUser() user: LoggedUser) {
    try {
      return this.donationService.donates({ id, query, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:140 ~ DonationController ~ findDonates ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id')
  @Auth(UserRole.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get donation detail by id' })
  findOne(@Param('id') id: string, @CurrentUser() user: LoggedUser) {
    try {
      return this.donationService.findOne(id, user);
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:23 ~ DonationController ~ findOne ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch(':id')
  @VerifiedUser()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update donation' })
  update(@Param('id') id: string, @Body() data: UpdateDonationDTO, @CurrentUser() user: LoggedUser) {
    try {
      return this.donationService.updateDonation(id, data, user);
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:68 ~ DonationController ~ update ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Delete(':id')
  @VerifiedUser()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete donation' })
  delete(@Param('id') id: string, @CurrentUser() user: LoggedUser) {
    try {
      return this.donationService.deleteDonation(id, user);
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:68 ~ DonationController ~ delete ~ error:`,
        error,
      );
      throw error;
    }
  }
}
