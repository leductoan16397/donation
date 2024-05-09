import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { And, DataSource, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { LoggedUser } from 'src/common/type';
import { MailService } from 'src/module/common/mail/mail.service';
import { KycStatus, UserRole } from 'src/common/enum';
import { Donation, DonationRequestChange, DonationStatus } from 'src/module/entity/donation.entity';
import { DonationData, RequestChangeData } from 'src/module/user/donation/response/donation.res';
import { AdminFindDonationListDto, AdminFindRequestChangesDto, RejectDonationDto } from './dto/donation.dto';
import { DonationService } from 'src/module/user/donation/donation.service';
import { Pagination } from 'src/common/common.response';
import { SumUpCheckoutStatus } from 'src/module/common/payment/sumup/base/sumup.type';
import { Checkout } from 'src/module/entity/checkout.entity';
import { FindPublicCheckoutListDto } from 'src/module/public/donation/dto/public.dto';
import { CheckoutData } from 'src/module/user/transaction/response/checkout.res';

@Injectable()
export class AdminDonationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Donation) private readonly donationRepository: Repository<Donation>,
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,

    @InjectRepository(DonationRequestChange)
    private readonly donationRequestChangeRepository: Repository<DonationRequestChange>,

    @InjectDataSource() private readonly connection: DataSource,
    private readonly mailService: MailService,
    private readonly donationService: DonationService,
  ) {}

  async requestChangeDetail({ id }: { loggedUser: LoggedUser; id: string }) {
    const data = await this.donationRequestChangeRepository.findOne({
      where: {
        id,
      },
      relations: {
        donation: true,
      },
    });

    return new RequestChangeData(data);
  }

  async requestChanges({
    loggedUser,
    query: { kycStatus, order, page, pageSize, sort, type, search },
  }: {
    query: AdminFindRequestChangesDto;
    loggedUser: LoggedUser;
  }) {
    console.log(
      `${new Date().toString()} 🚀 ~ file: donation.service.ts:34 ~ AdminDonationService ~ loggedUser:`,
      loggedUser,
    );
    const where: FindOptionsWhere<DonationRequestChange> | FindOptionsWhere<DonationRequestChange>[] = {
      ...(kycStatus && { kycStatus }),
      ...(type && {
        donation: {
          type,
        },
      }),
      ...(search && {
        donation: {
          name: ILike(`%${search.trim().toLowerCase()}%`),
        },
      }),
    };

    const [data, total] = await this.donationRequestChangeRepository.findAndCount({
      where,
      select: {
        id: true,
        approvedAt: true,
        createdAt: true,
        rejectedReason: true,
        effectiveTo: true,
        kycStatus: true,
        targetAmount: true,
      },
      relations: {
        approvedBy: true,
        donation: true,
      },
      order: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    });
    return {
      data: data.map((kyc) => {
        return new RequestChangeData(kyc);
      }),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async approveRequestChange({ id, loggedUser }: { loggedUser: LoggedUser; id: string }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.Admin, UserRole.Employee].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const requestChange = await this.donationRequestChangeRepository.findOne({
      where: { id },
      relations: {
        donation: {
          owner: true,
        },
      },
    });

    if (!requestChange || requestChange.kycStatus !== KycStatus.WAIT_APPROVE) {
      throw new BadRequestException('Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const donationRequestChangeRepository = queryRunner.manager.getRepository(DonationRequestChange);
    const donationRepository = queryRunner.manager.getRepository(Donation);
    try {
      await donationRequestChangeRepository.update(
        { id },
        {
          approvedAt: new Date(),
          approvedBy: user,
          kycStatus: KycStatus.VERIFIED,
        },
      );
      await donationRepository.update(
        {
          id: requestChange.donation.id,
        },
        {
          ...(requestChange.effectiveTo && {
            effectiveTo: requestChange.effectiveTo,
          }),
          ...(requestChange.targetAmount && {
            targetAmount: requestChange.targetAmount,
          }),
        },
      );

      if (requestChange.targetAmount <= requestChange.donation.targetAmount) {
        this.donationService.completeDonation(requestChange.donation.id);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    //  send email to user
    this.mailService.requestChangeApproved({ email: requestChange.donation?.owner?.email }).catch((err) => {
      console.log(`${new Date().toString()} 🚀 ~ file: kyc.service.ts:69 ~ AdminKycService ~ approveKyc ~ err:`, err);
    });

    await this.donationService.addDonationCompletedConJob({ id: requestChange.id });

    return this.findOne({ id, loggedUser });
  }

  async rejectRequestChange({
    id,
    loggedUser,
    input,
  }: {
    loggedUser: LoggedUser;
    id: string;
    input: RejectDonationDto;
  }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.Admin, UserRole.Employee].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const requestChange = await this.donationRequestChangeRepository.findOne({
      where: { id },
      relations: {
        donation: {
          owner: true,
        },
      },
    });

    if (!requestChange || requestChange.kycStatus !== KycStatus.WAIT_APPROVE) {
      throw new BadRequestException('Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const donationRequestChangeRepository = queryRunner.manager.getRepository(DonationRequestChange);
    try {
      const { rejectedReason } = input;
      await donationRequestChangeRepository.update(
        { id },
        {
          approvedAt: new Date(),
          approvedBy: user,
          rejectedReason,
          kycStatus: KycStatus.VERIFY_DENY,
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    //  send email to user
    this.mailService.requestChangeRejected({ email: requestChange.donation?.owner?.email }).catch((err) => {
      console.log(`${new Date().toString()} 🚀 ~ file: kyc.service.ts:133 ~ AdminKycService ~ rejectKyc ~ err:`, err);
    });

    return this.findOne({ id, loggedUser });
  }

  async approveDonation({ id, loggedUser }: { loggedUser: LoggedUser; id: string }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.Admin, UserRole.Employee].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });

    if (!donation || donation.kycStatus !== KycStatus.WAIT_APPROVE) {
      throw new BadRequestException('Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const donationRepository = queryRunner.manager.getRepository(Donation);
    try {
      await donationRepository.update(
        { id },
        {
          approvedAt: new Date(),
          approvedBy: user,
          kycStatus: KycStatus.VERIFIED,
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    //  send email to user
    this.mailService.donationApproved({ email: donation.owner.email }).catch((err) => {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:190 ~ AdminDonationService ~ approveDonation ~ err:`,
        err,
      );
    });

    await this.donationService.addDonationStartConJob({ id: donation.id });
    await this.donationService.addDonationCompletedConJob({ id: donation.id });

    return this.findOne({ id, loggedUser });
  }

  async rejectDonation({ id, loggedUser, input }: { loggedUser: LoggedUser; id: string; input: RejectDonationDto }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.Admin, UserRole.Employee].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const donation = await this.donationRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });

    if (!donation || donation.kycStatus !== KycStatus.WAIT_APPROVE) {
      throw new BadRequestException('Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const donationRepository = queryRunner.manager.getRepository(Donation);
    try {
      const { rejectedReason } = input;
      await donationRepository.update(
        { id },
        {
          approvedAt: new Date(),
          approvedBy: user,
          rejectedReason,
          kycStatus: KycStatus.VERIFY_DENY,
        },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    //  send email to user
    this.mailService.donationRejected({ email: donation.owner.email }).catch((err) => {
      console.log(
        `${new Date().toString()} 🚀 ~ file: donation.service.ts:248 ~ AdminDonationService ~ rejectDonation ~ err:`,
        err,
      );
    });

    return this.findOne({ id, loggedUser });
  }

  async find({
    query: { page = 0, pageSize = 10, order = 'asc', sort = 'createdAt', status, search, kycStatus, type, from, to },
  }: {
    query: AdminFindDonationListDto;
    loggedUser: LoggedUser;
  }) {
    const baseQuery: FindOptionsWhere<Donation> = {
      ...(kycStatus && { kycStatus }),
      ...(status && { status }),
      ...(type && { type }),
    };
    if (from && to) {
      if (from > to) {
        throw new BadRequestException('"to" must be after "from"');
      }
      baseQuery.createdAt = And(MoreThanOrEqual(from), LessThanOrEqual(to));
    } else if (from && !to) {
      baseQuery.createdAt = MoreThanOrEqual(from);
    } else if (!from && to) {
      baseQuery.createdAt = LessThanOrEqual(to);
    }

    const where: FindOptionsWhere<Donation> | FindOptionsWhere<Donation>[] = search
      ? [
          {
            name: ILike(`%${search.trim().toLowerCase()}%`),
            ...baseQuery,
          },
          {
            owner: {
              email: ILike(`%${search.trim().toLowerCase()}%`),
            },
            ...baseQuery,
          },
        ]
      : baseQuery;

    const [data, total] = await this.donationRepository.findAndCount({
      where,
      ...(status === DonationStatus.DELETED && {
        withDeleted: true,
      }),
      select: {
        id: true,
        status: true,
        approvedAt: true,
        createdAt: true,
        rejectedReason: true,
        description: true,
        documents: true,
        effectiveFrom: true,
        effectiveTo: true,
        images: true,
        kycStatus: true,
        name: true,
        targetAmount: true,
        thumbnail: true,
        type: true,
        transactionCode: true,
      },
      relations: {
        approvedBy: true,
        owner: true,
      },
      order: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    });
    return {
      data: data.map((kyc) => {
        return new DonationData(kyc);
      }),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOne({ id }: { id: string; loggedUser: LoggedUser }): Promise<DonationData> {
    const donation = await this.donationRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: {
        approvedBy: true,
        owner: true,
        requestChanges: true,
      },
    });

    return (donation && new DonationData(donation)) || null;
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
      console.log(`${new Date().toString()} 🚀 ~ file: donation.service.ts:474 ~ AdminDonationService ~ error:`, error);
      throw error;
    }
  }
}
