import { BadRequestException, Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminWithdrawalRequestService } from './withdrawal_request.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/module/auth/decorator/auth.decorator';
import { CurrentUser } from 'src/common/loggedUser.decorator';
import { RejectWithdrawalRequestDTO, AdminFindWithdrawalRequestListDto } from './dto/withdrawal_request.dto';
import { LoggedUser } from 'src/common/type';
import { UserRole } from 'src/common/enum';
import { isUUID } from 'class-validator';

@Controller('withdrawal-requests')
@ApiTags('Admin.withdrawal-request')
export class AdminWithdrawalRequestController {
  constructor(private readonly withdrawalRequestService: AdminWithdrawalRequestService) {}

  @Get()
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  find(@Query() query: AdminFindWithdrawalRequestListDto, @CurrentUser() user: LoggedUser) {
    try {
      return this.withdrawalRequestService.find({ query, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: withdrawal_request.controller.ts:21 ~ AdminWithdrawalRequestController ~ find ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @CurrentUser() user: LoggedUser) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.withdrawalRequestService.findOne({ id, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: withdrawal_request.controller.ts:33 ~ AdminWithdrawalRequestController ~ findOne ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch(':id/reject')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  reject(@Param('id') id: string, @Body() body: RejectWithdrawalRequestDTO, @CurrentUser() user: LoggedUser) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.withdrawalRequestService.reject({ id, input: body, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: withdrawal_request.controller.ts:45 ~ AdminWithdrawalRequestController ~ reject ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Patch(':id/approve')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  approve(@Param('id') id: string, @CurrentUser() user: LoggedUser, @Body() body: any) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.withdrawalRequestService.approve({ id, input: body, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: withdrawal_request.controller.ts:57 ~ AdminWithdrawalRequestController ~ approve ~ error:`,
        error,
      );
      throw error;
    }
  }
}
