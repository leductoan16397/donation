import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/loggedUser.decorator';
import { LoggedUser } from 'src/common/type';
import { UserRole } from 'src/common/enum';
import { KycService } from './kyc.service';
import { CreateKycDTO, FindKycListDto, UpdateKycDTO } from './dto/kyc.dto';
import { isUUID } from 'class-validator';
import { Pagination } from 'src/common/common.response';
import { KycData } from './response/kyc.res';
import { Auth } from 'src/module/auth/decorator/auth.decorator';

@ApiTags('Kyc')
@Controller('kycs')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get()
  @Auth(UserRole.User)
  @ApiBearerAuth()
  find(@Query() query: FindKycListDto, @CurrentUser() user: LoggedUser): Promise<Pagination<KycData>> {
    try {
      return this.kycService.find({ query, loggedUser: user });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ file: kyc.controller.ts:25 ~ KycController ~ find ~ error:`, error);
      throw error;
    }
  }

  @Post()
  @Auth(UserRole.User)
  @ApiBearerAuth()
  create(@Body() body: CreateKycDTO, @CurrentUser() user: LoggedUser) {
    try {
      return this.kycService.requestKyc({ input: body, loggedUser: user });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ file: kyc.controller.ts:23 ~ KycController ~ create ~ error:`, error);
      throw error;
    }
  }

  @Get('latest')
  @Auth(UserRole.User)
  @ApiBearerAuth()
  latest(@CurrentUser() user: LoggedUser) {
    try {
      return this.kycService.latest({ loggedUser: user });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ file: kyc.controller.ts:52 ~ KycController ~ findOne ~ error:`, error);
      throw error;
    }
  }

  @Get(':id')
  @Auth(UserRole.User)
  @ApiBearerAuth()
  findOne(@CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.kycService.findOne({ loggedUser: user, id });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ file: kyc.controller.ts:52 ~ KycController ~ findOne ~ error:`, error);
      throw error;
    }
  }

  @Patch(':id')
  @Auth(UserRole.User)
  @ApiBearerAuth()
  update(@Body() body: UpdateKycDTO, @CurrentUser() user: LoggedUser, @Param('id') id: string) {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.kycService.updateKyc({ input: body, loggedUser: user, id });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ file: kyc.controller.ts:38 ~ KycController ~ update ~ error:`, error);
      throw error;
    }
  }
}
