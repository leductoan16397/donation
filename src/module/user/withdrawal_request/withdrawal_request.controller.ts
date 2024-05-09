import { Body, Controller, Get, Param } from '@nestjs/common';
import { WithdrawalRequestService } from './withdrawal_request.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VerifiedUser } from 'src/module/auth/decorator/auth.decorator';
import { CurrentUser } from 'src/common/loggedUser.decorator';
import { LoggedUser } from 'src/common/type';
import { FindWithdrawalRequestListDto } from '../donation/dto/withdrawal_request.dto';

@Controller('withdrawal-request')
@ApiTags('withdrawal-requests')
export class WithdrawalRequestController {
  constructor(private readonly withdrawalRequestService: WithdrawalRequestService) {}

  @Get()
  @VerifiedUser()
  @ApiBearerAuth()
  find(@CurrentUser() user: LoggedUser, @Body() body: FindWithdrawalRequestListDto) {
    try {
      return this.withdrawalRequestService.find({ loggedUser: user, query: body });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: withdrawal_request.controller.ts:21 ~ WithdrawalRequestController ~ find ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id')
  @VerifiedUser()
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @CurrentUser() user: LoggedUser) {
    try {
      return this.withdrawalRequestService.findOne({ id, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: withdrawal_request.controller.ts:37 ~ WithdrawalRequestController ~ findOne ~ error:`,
        error,
      );
      throw error;
    }
  }
}
