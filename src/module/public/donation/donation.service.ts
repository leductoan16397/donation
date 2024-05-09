import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/common/common.response';
import { KycStatus } from 'src/common/enum';
import { SumUpCheckoutStatus } from 'src/module/common/payment/sumup/base/sumup.type';
import { Checkout } from 'src/module/entity/checkout.entity';
import { Donation, DonationStatus } from 'src/module/entity/donation.entity';
import { DonationData } from 'src/module/user/donation/response/donation.res';
import { CheckoutData } from 'src/module/user/transaction/response/checkout.res';
import { Brackets, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { FindPublicCheckoutListDto, FindPublicDonationListDto } from './dto/public.dto';

const DonationFieldsObj = {
  name: 'donation_name',
  createdAt: 'donation_created_at',
  totalDonate: `donation_total_donate`,
  currentAmount: `donation_current_amount`,
  targetAmount: `donation_target_amount`,
};

const OrderObj: {
  [key: string]: 'ASC' | 'DESC';
} = {
  asc: 'ASC',
  desc: 'DESC',
};

@Injectable()
export class PublicDonationService {
  constructor(
    @InjectRepository(Donation) private readonly donationRepository: Repository<Donation>,
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,
  ) {}

  async publicDonations({
    query: {
      order = 'desc',
      effectiveFrom,
      effectiveTo,
      sort = 'createdAt',
      page = 0,
      pageSize = 10,
      search,
      status,
      type,
    },
  }: {
    query: FindPublicDonationListDto;
  }): Promise<Pagination<DonationData>> {
    try {
      const baseQuery: FindOptionsWhere<Donation> = {
        ...(effectiveFrom && {
          effectiveFrom: MoreThanOrEqual(effectiveFrom),
        }),
        ...(effectiveTo && {
          effectiveTo: LessThanOrEqual(effectiveTo),
        }),
        ...(type && { type }),
        status: status || DonationStatus.INPROGRESS,
        kycStatus: KycStatus.VERIFIED,
      };

      const searchStr = search ? `%${search.trim().toLowerCase()}%` : '';

      let donationQueryBuilder = this.donationRepository
        .createQueryBuilder('donation')
        .where(baseQuery)
        .leftJoinAndSelect('donation.owner', 'owner')

        .limit(pageSize)
        .offset(page * pageSize)
        .addOrderBy(DonationFieldsObj[sort], OrderObj[order]);

      if (search) {
        donationQueryBuilder = donationQueryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('"donation"."name" ilike :search', { search: searchStr })
              .orWhere("organization->>'name' ilike :search", { search: searchStr })
              .orWhere('"owner"."name" ilike :search', { search: searchStr });
          }),
        );
      }

      const [donations, count] = await donationQueryBuilder.getManyAndCount();

      return {
        data: donations.map((donation) => new DonationData(donation)),
        page: page,
        pageSize: pageSize,
        total: count,
        totalPage: Math.ceil(count / pageSize),
      };
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:54 ~ DonationService ~ findVerifiedAndInprocessDonations ~ error:`,
        error,
      );
      throw error;
    }
  }

  async findOnePublic(id: string): Promise<DonationData> {
    try {
      const donation = await this.donationRepository.findOne({
        where: {
          status: Not(DonationStatus.DELETED),
          id,
        },
        relations: {
          owner: true,
        },
        select: {
          owner: {
            name: true,
            id: true,
            email: true,
          },
        },
      });
      return (donation && new DonationData(donation)) || null;
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:54 ~ DonationService ~ findOnePublic ~ error:`,
        error,
      );
      throw error;
    }
  }

  async donates({
    id,
    query: { page = 0, pageSize = 10, search, order, sort },
  }: {
    id: string;
    query: FindPublicCheckoutListDto;
  }): Promise<Pagination<CheckoutData>> {
    try {
      const where: FindOptionsWhere<Checkout> | FindOptionsWhere<Checkout>[] = (search && [
        {
          donation: {
            status: Not(DonationStatus.DELETED),
            id,
          },
          name: ILike(`%${search.trim().toLowerCase()}%`),
          status: SumUpCheckoutStatus.PAID,
        },
        {
          donation: {
            status: Not(DonationStatus.DELETED),
            id,
          },
          email: ILike(`%${search.trim().toLowerCase()}%`),
          status: SumUpCheckoutStatus.PAID,
        },
      ]) || {
        donation: {
          status: Not(DonationStatus.DELETED),
          id,
        },
        status: SumUpCheckoutStatus.PAID,
      };

      const [checkouts, count] = await this.checkoutRepository.findAndCount({
        where,
        relations: {
          donation: true,
        },
        skip: page * pageSize,
        take: pageSize,
        order: {
          [sort]: order,
        },
      });

      return {
        data: checkouts.map((donation) => new CheckoutData(donation)),
        page: page,
        pageSize: pageSize,
        total: count,
        totalPage: Math.ceil(count / pageSize),
      };
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:126 ~ PublicDonationService ~ error:`,
        error,
      );
      throw error;
    }
  }
}
