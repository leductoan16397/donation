import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicDonationService } from './donation.service';
import { FindPublicCheckoutListDto, FindPublicDonationListDto } from './dto/public.dto';

@ApiTags('Public.donations')
@Controller('donations')
export class PublicDonationController {
  constructor(private readonly publicDonationService: PublicDonationService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of donations (is verified and inprogress)' })
  findVerifiedAndInprogressDonations(@Query() query: FindPublicDonationListDto) {
    try {
      return this.publicDonationService.publicDonations({ query });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:23 ~ PublicDonationController ~ findVerifiedAndInprocessDonations ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get donation detail by id (public)' })
  findOnePublic(@Param('id') id: string) {
    try {
      return this.publicDonationService.findOnePublic(id);
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:23 ~ PublicDonationController ~ findOnePublic ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id/donates')
  @ApiOperation({ summary: 'Get list of donates by filter' })
  findDonates(@Param('id') id: string, @Query() query: FindPublicCheckoutListDto) {
    try {
      return this.publicDonationService.donates({ id, query });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.controller.ts:45 ~ PublicDonationController ~ find ~ error:`,
        error,
      );
      throw error;
    }
  }
}
