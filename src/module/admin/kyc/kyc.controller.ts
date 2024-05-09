import { BadRequestException, Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/loggedUser.decorator';
import { LoggedUser } from 'src/common/type';
import { UserRole } from 'src/common/enum';
import { isUUID } from 'class-validator';
import { Pagination } from 'src/common/common.response';
import { KycData } from 'src/module/user/kyc/response/kyc.res';
import { AdminFindKycListDto, RejectKycDto } from './dto/kyc.dto';
import { AdminKycService } from './kyc.service';
import { Auth } from 'src/module/auth/decorator/auth.decorator';

@ApiTags('Admin.kyc')
@Controller('kycs')
export class AdminKycController {
  constructor(private readonly kycService: AdminKycService) {}

  @Get()
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  find(@Query() query: AdminFindKycListDto, @CurrentUser() user: LoggedUser): Promise<Pagination<KycData>> {
    try {
      return this.kycService.find({ query, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: kyc.controller.ts:25 ~ AdminKycController ~ find ~ error:`,
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
      return this.kycService.findOne({ loggedUser: user, id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: kyc.controller.ts:39 ~ AdminKycController ~ findOne ~ error:`,
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
      return this.kycService.approveKyc({ loggedUser: user, id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: kyc.controller.ts:53 ~ AdminKycController ~ approve ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch(':id/reject')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  reject(@Body() body: RejectKycDto, @CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.kycService.rejectKyc({ loggedUser: user, id, input: body });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: kyc.controller.ts:67 ~ AdminKycController ~ reject ~ error:`,
        error,
      );
      throw error;
    }
  }
}
