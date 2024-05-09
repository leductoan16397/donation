import { BadRequestException, Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/loggedUser.decorator';
import { LoggedUser } from 'src/common/type';
import { UserRole } from 'src/common/enum';
import { isUUID } from 'class-validator';
import { Pagination } from 'src/common/common.response';
import { AdminDonationService } from './donation.service';
import { AdminFindDonationListDto, AdminFindRequestChangesDto, RejectDonationDto } from './dto/donation.dto';
import { DonationData } from 'src/module/user/donation/response/donation.res';
import { Auth } from 'src/module/auth/decorator/auth.decorator';
import { FindPublicCheckoutListDto } from 'src/module/public/donation/dto/public.dto';

@ApiTags('Admin.donation')
@Controller('donations')
export class AdminDonationController {
  constructor(private readonly adminDonationService: AdminDonationService) {}

  @Get()
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  find(@Query() query: AdminFindDonationListDto, @CurrentUser() user: LoggedUser): Promise<Pagination<DonationData>> {
    try {
      return this.adminDonationService.find({ query, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:25 ~ AdminDonationController ~ find ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get('request-changes')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  requestChanges(@CurrentUser() user: LoggedUser, @Query() query: AdminFindRequestChangesDto) {
    try {
      return this.adminDonationService.requestChanges({ loggedUser: user, query });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:43 ~ AdminDonationController ~ approveRequestChange ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get('request-changes/:id')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  requestChangeDetail(@CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.adminDonationService.requestChangeDetail({ loggedUser: user, id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:43 ~ AdminDonationController ~ approveRequestChange ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch('request-change/:id/approve')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  approveRequestChange(@CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.adminDonationService.approveRequestChange({ loggedUser: user, id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:43 ~ AdminDonationController ~ approveRequestChange ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch('request-change/:id/reject')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  rejectRequestChange(@Body() body: RejectDonationDto, @CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.adminDonationService.rejectRequestChange({ loggedUser: user, id, input: body });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:61 ~ AdminDonationController ~ rejectRequestChange ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  findOne(@CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.adminDonationService.findOne({ loggedUser: user, id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:40 ~ AdminDonationController ~ findOne ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch(':id/approve')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  approve(@CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.adminDonationService.approveDonation({ loggedUser: user, id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:55 ~ AdminDonationController ~ approve ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch(':id/reject')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  reject(@Body() body: RejectDonationDto, @CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.adminDonationService.rejectDonation({ loggedUser: user, id, input: body });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:70 ~ AdminDonationController ~ reject ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id/donates')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of donates by filter' })
  findDonates(@Param('id') id: string, @Query() query: FindPublicCheckoutListDto) {
    try {
      return this.adminDonationService.donates({ id, query });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:160 ~ AdminDonationController ~ findDonates ~ error:`,
        error,
      );
      throw error;
    }
  }
}
