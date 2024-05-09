import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { LoggedUser } from 'src/common/type';
import { CreateDonationDTO, FindDonationListDto, UpdateDonationDTO } from './dto/donation.dto';
import { KycStatus, OrderDirection } from 'src/common/enum';
import { Donation, DonationRequestChange, DonationStatus, DonationType } from 'src/module/entity/donation.entity';
import { User } from 'src/module/entity/user.entity';
import { DataSource, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { DonationData } from './response/donation.res';
import { Pagination } from 'src/common/common.response';
import { MailService } from 'src/module/common/mail/mail.service';
import { randomUUID } from 'crypto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as moment from 'moment-timezone';
import { SumUpCheckoutStatus } from 'src/module/common/payment/sumup/base/sumup.type';
import { Checkout } from 'src/module/entity/checkout.entity';
import { FindPublicCheckoutListDto } from 'src/module/public/donation/dto/public.dto';
import { CheckoutData } from '../transaction/response/checkout.res';
import { deductCount } from 'src/common/utils';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,

    @InjectRepository(DonationRequestChange)
    private readonly donationRequestChangeRepository: Repository<DonationRequestChange>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,

    private readonly mailService: MailService,

    private schedulerRegistry: SchedulerRegistry,

    @InjectDataSource() private readonly connection: DataSource,
  ) {}

  async find(query: FindDonationListDto, loggedUser: LoggedUser): Promise<Pagination<DonationData>> {
    try {
      const user = await this.userRepository.findOneBy({
        id: loggedUser.id,
      });
      if (!user) {
        throw new BadRequestException('User Not Found');
      }

      //#region Init query
      const where: FindOptionsWhere<Donation> = {
        owner: {
          id: loggedUser.id,
        },
        status: Not(DonationStatus.DELETED),
      };
      if (query.status) {
        where.status = query.status as any;
      }
      if (query.kycStatus) {
        where.kycStatus = query.kycStatus;
      }
      if (query.type) {
        where.type = query.type;
      }
      if (query.name) {
        where.name = ILike(`%${query.name}%`);
      }
      if (query.effectiveFrom) {
        where.effectiveFrom = MoreThanOrEqual(query.effectiveFrom);
      }
      if (query.effectiveTo) {
        where.effectiveFrom = LessThanOrEqual(query.effectiveTo);
      }
      //#endregion Init query

      const [donations, count] = await this.donationRepository.findAndCount({
        where,
        relations: {
          owner: true,
        },
        skip: query.page * query.pageSize,
        take: query.pageSize,
        order: {
          [query.sort || 'createdAt']: query.order || OrderDirection.DESC,
        },
      });

      return {
        data: donations.map((donation) => new DonationData(donation)),
        page: query.page,
        pageSize: query.pageSize,
        total: count,
        totalPage: Math.ceil(count / query.pageSize),
      };
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:54 ~ DonationService ~ find ~ error:`,
        error,
      );
      throw error;
    }
  }

  async findOne(id: string, loggedUser: LoggedUser): Promise<DonationData> {
    try {
      const donation = await this.donationRepository.findOne({
        where: {
          owner: {
            id: loggedUser.id,
          },
          status: Not(DonationStatus.DELETED),
          id,
        },
        relations: {
          owner: true,
          requestChanges: true,
        },
      });
      return (donation && new DonationData(donation)) || null;
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:54 ~ DonationService ~ findOne ~ error:`,
        error,
      );
      throw error;
    }
  }

  async createDonation(data: CreateDonationDTO, loggedUser: LoggedUser): Promise<DonationData> {
    try {
      const owner = await this.userRepository.findOneBy({
        id: loggedUser.id,
      });
      if (!owner) {
        throw new BadRequestException('Owner Not Found');
      }
      if (!owner.kycStatus || owner.kycStatus !== KycStatus.VERIFIED) {
        throw new BadRequestException('Owner Not Verify KYC');
      }
      if (data.documents.length < 1 && data.images.length < 1) {
        throw new BadRequestException('Documents or Images is required');
      }
      if (data.effectiveFrom > data.effectiveTo) {
        throw new BadRequestException('Effective From must be less than Effective To');
      }
      if (data.type === DonationType.ORGANIZATION && !data.organization) {
        throw new BadRequestException('Organization is required');
      }
      if (data.type === DonationType.INDIVIDUAL) {
        data.organization = null;
      }

      const donation = await this.donationRepository.save({
        ...data,
        owner,
        transactionCode: randomUUID().toUpperCase(),
        status: DonationStatus.NOT_START,
        kycStatus: KycStatus.WAIT_APPROVE,
        createdAt: new Date(),
      });
      return new DonationData(donation);
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:54 ~ DonationService ~ create ~ error:`,
        error,
      );
      throw error;
    }
  }

  async updateDonation(id: string, data: UpdateDonationDTO, loggedUser: LoggedUser) {
    try {
      const owner = await this.userRepository.findOneBy({
        id: loggedUser.id,
      });
      if (!owner) {
        throw new BadRequestException('Owner Not Found');
      }

      const donation = await this.donationRepository.findOneBy({
        id,
        owner: {
          id: loggedUser.id,
        },
      });
      if (!donation) {
        throw new BadRequestException('Donation Not Found');
      }

      if (
        donation.status === DonationStatus.DELETED ||
        donation.status === DonationStatus.COMPLETED ||
        donation.kycStatus === KycStatus.VERIFY_DENY
      ) {
        throw new BadRequestException('Updates are disabled');
      }

      if ([KycStatus.WAIT_APPROVE, KycStatus.NO_VERIFY].includes(donation.kycStatus)) {
        const updateDonation = await this.donationRepository.save({
          ...donation,
          ...data,
        });
        return new DonationData(updateDonation);
      }

      const { targetAmount, effectiveTo } = data;

      const queryRunner = this.connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const donationRequestChangeRepository = queryRunner.manager.getRepository(DonationRequestChange);
      try {
        const requestChange = donationRequestChangeRepository.create({
          donation,
          effectiveTo,
          targetAmount,
          kycStatus: KycStatus.WAIT_APPROVE,
        });

        await donationRequestChangeRepository.update(
          {
            kycStatus: KycStatus.WAIT_APPROVE,
            donation: {
              id: donation.id,
            },
          },
          {
            kycStatus: KycStatus.NO_VERIFY,
          },
        );

        await donationRequestChangeRepository.save(requestChange);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        await queryRunner.release();
      }

      return;
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:54 ~ DonationService ~ update ~ error:`,
        error,
      );
      throw error;
    }
  }

  async cancelRequestChange({ id, loggedUser }: { id: string; loggedUser: LoggedUser }) {
    const owner = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });
    if (!owner) {
      throw new BadRequestException('Owner Not Found');
    }

    const requestChange = await this.donationRequestChangeRepository.findOne({
      where: {
        donation: {
          owner: {
            id: loggedUser.id,
          },
        },
      },
    });

    if (!requestChange) {
      throw new BadRequestException('Request Change Not Found');
    }
    await this.donationRequestChangeRepository.update(
      { id },
      {
        kycStatus: KycStatus.NO_VERIFY,
      },
    );
    return;
  }

  async deleteDonation(id: string, loggedUser: LoggedUser) {
    try {
      const donation = await this.donationRepository.findOneBy({
        id,
        owner: {
          id: loggedUser.id,
        },
      });
      if (!donation) {
        throw new BadRequestException('Donation Not Found');
      }
      // Check if donation is in progress or completed
      if (donation.status !== DonationStatus.NOT_START) {
        throw new BadRequestException('Cannot delete donation');
      }

      //#region Update status to DELETED
      await this.donationRepository.update(
        {
          id,
        },
        {
          status: DonationStatus.DELETED,
        },
      );
      //#endregion Update status to DELETED

      //#region delete all cron job related to this donation
      const conJobNameStart = donation.id + '-start';
      if (this.schedulerRegistry.doesExist('cron', conJobNameStart)) {
        this.schedulerRegistry.deleteCronJob(conJobNameStart);
        console.log(
          `${new Date().toString()} 🚀 ~ DonationService ~ deleteDonation ~ conJobNameStart:`,
          conJobNameStart,
        );
      }
      const conJobNameComplete = donation.id + '-complete';
      if (this.schedulerRegistry.doesExist('cron', conJobNameComplete)) {
        this.schedulerRegistry.deleteCronJob(conJobNameComplete);
        console.log(
          `${new Date().toString()} 🚀 ~ DonationService ~ deleteDonation ~ conJobNameComplete:`,
          conJobNameComplete,
        );
      }
      //#endregion delete all cron job related to this donation

      // soft delete
      await this.donationRepository.softDelete({
        id,
      });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:54 ~ DonationService ~ delete ~ error:`,
        error,
      );
      throw error;
    }
  }

  async completeDonation(id: string) {
    try {
      const donation = await this.donationRepository.findOne({
        where: {
          id,
        },
        relations: {
          owner: true,
          checkouts: true,
        },
      });

      if (!donation) {
        throw new BadRequestException('Donation Not Found');
      }

      if (donation.status !== DonationStatus.INPROGRESS || donation.kycStatus !== KycStatus.VERIFIED) {
        throw new Error('Cannot update');
      }

      const paidCheckouts = donation.checkouts.filter((c) => c.status === SumUpCheckoutStatus.PAID);

      const sum = paidCheckouts.reduce((p, c) => p + c.amount, 0);

      await this.donationRepository.update(
        {
          id,
        },
        {
          status: DonationStatus.COMPLETED,
          canWithdrawnAmount: deductCount({ input: sum }),
          maxWithdrawnAmount: deductCount({ input: sum }),
        },
      );

      // send Email
      this.mailService.donationCompleted({ email: donation.owner.email }).catch((err) => {
        console.log(`${new Date().toString()} 🚀 ~ DonationService ~ completeDonation ~ err:`, err);
      });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ DonationService ~ completeDonation ~ error:`, error);
    }
  }

  async startDonation(id: string) {
    try {
      const donation = await this.donationRepository.findOne({
        where: {
          id,
        },
        relations: {
          owner: true,
        },
      });

      if (!donation) {
        throw new BadRequestException('Donation Not Found');
      }

      if (donation.status !== DonationStatus.NOT_START || donation.kycStatus !== KycStatus.VERIFIED) {
        throw new Error('Cannot update');
      }

      await this.donationRepository.update(
        {
          id,
        },
        {
          status: DonationStatus.INPROGRESS,
        },
      );

      // send Email
      this.mailService.donationStarted({ email: donation.owner.email }).catch((err) => {
        console.log(`${new Date().toString()} 🚀 ~ DonationService ~ startDonation ~ err:`, err);
      });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ DonationService ~ startDonation ~ error:`, error);
    }
  }

  async addDonationStartConJob({ id }: { id: string }) {
    const donation = await this.donationRepository.findOne({
      where: {
        id,
      },
    });
    if (!!donation) {
      if (donation.effectiveFrom < moment().add(5, 'second').toDate()) {
        await this.startDonation(donation.id);
      } else {
        const startJob = new CronJob(new Date(donation.effectiveFrom), async () => {
          await this.startDonation(donation.id);
        });
        const conJobName = donation.id + '-start';

        if (!this.schedulerRegistry.doesExist('cron', conJobName)) {
          this.schedulerRegistry.addCronJob(conJobName, startJob);
          startJob.start();
        }
      }
    }
  }

  async addDonationCompletedConJob({ id }: { id: string }) {
    const donation = await this.donationRepository.findOne({
      where: {
        id,
      },
    });
    if (!!donation) {
      if (donation.effectiveTo < moment().add(5, 'second').toDate()) {
        await this.completeDonation(donation.id);
      } else {
        const completeJob = new CronJob(new Date(donation.effectiveTo), async () => {
          await this.completeDonation(donation.id);
        });
        const conJobName = donation.id + '-complete';

        if (!this.schedulerRegistry.doesExist('cron', conJobName)) {
          this.schedulerRegistry.addCronJob(conJobName, completeJob);
          completeJob.start();
        }
      }
    }
  }

  async isCompletedTargetAmount({ id }: { id: string }) {
    const donation = await this.donationRepository.findOne({
      where: {
        id,
      },
      relations: {
        checkouts: true,
      },
    });
    const paidCheckouts = (donation.checkouts || [])?.filter((ck) => ck.status === SumUpCheckoutStatus.PAID);
    const totalAmount = paidCheckouts.reduce((pre, cur) => pre + cur.amount, 0);
    return totalAmount >= donation.targetAmount;
  }

  async donates({
    id,
    query: { page = 0, pageSize = 10, search, order, sort },
    loggedUser,
  }: {
    id: string;
    query: FindPublicCheckoutListDto;
    loggedUser: LoggedUser;
  }): Promise<Pagination<CheckoutData>> {
    try {
      const donation = await this.donationRepository.findOne({
        where: {
          id,
          owner: {
            id: loggedUser.id,
          },
        },
      });

      if (!donation) {
        throw new ForbiddenException();
      }

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
      console.log(`${new Date().toString()} 🚀 ~ file: donation.service.ts:474 ~ AdminDonationService ~ error:`, error);
      throw error;
    }
  }

  async syncMissingCanWithDrawnAmount() {
    try {
      const completedDonations = await this.donationRepository.find({
        where: {
          status: DonationStatus.COMPLETED,
        },
        relations: {
          checkouts: true,
        },
      });

      for (let index = 0; index < completedDonations.length; index++) {
        const completedDonation = completedDonations[index];

        const paidCheckouts = completedDonation.checkouts.filter((c) => c.status === SumUpCheckoutStatus.PAID);

        const sum = paidCheckouts.reduce((p, c) => p + c.amount, 0);
        this.donationRepository.update(
          {
            id: completedDonation.id,
          },
          {
            canWithdrawnAmount: deductCount({ input: sum }),
            maxWithdrawnAmount: deductCount({ input: sum }),
          },
        );
        console.log(
          `${new Date().toString()} 🚀 ~ file: donation.service.ts:568 ~ DonationService ~ syncMissingCanWithDrawnAmount ~ sum:`,
          sum,
        );
      }
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:576 ~ DonationService ~ syncMissingCanWithDrawnAmount ~ error:`,
        error,
      );
    }
  }
}
