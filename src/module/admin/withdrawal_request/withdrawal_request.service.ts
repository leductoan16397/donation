import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/entity/user.entity';
import { WithdrawalRequest, WithdrawalRequestStatus } from 'src/module/entity/withdrawal_request.entity';
import { And, DataSource, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AdminFindWithdrawalRequestListDto } from './dto/withdrawal_request.dto';
import { LoggedUser } from 'src/common/type';
import { DefaultSort, OrderDirection } from 'src/common/enum';
import { Donation } from 'src/module/entity/donation.entity';
import { WithdrawalRequestData } from 'src/module/user/withdrawal_request/response/withdrawal_request.res';
import { MailService } from 'src/module/common/mail/mail.service';

@Injectable()
export class AdminWithdrawalRequestService {
  constructor(
    @InjectRepository(WithdrawalRequest) private readonly withdrawalRequestRepository: Repository<WithdrawalRequest>,

    @InjectRepository(User) private readonly userRepository: Repository<User>,

    @InjectRepository(Donation) private readonly donationRepository: Repository<Donation>,

    @InjectDataSource() private readonly connection: DataSource,

    private readonly mailService: MailService,
  ) {}

  async findOne({ id }: { id: string; loggedUser: LoggedUser }) {
    const data = await this.withdrawalRequestRepository.findOne({
      where: {
        id,
      },
      relations: {
        donation: true,
      },
    });

    return data ? new WithdrawalRequestData(data) : null;
  }

  async find({
    query: { donationId, order = 'desc', page = 0, pageSize = 10, sort = 'createdAt', status, search, from, to },
    loggedUser,
  }: {
    query: AdminFindWithdrawalRequestListDto;
    loggedUser: LoggedUser;
  }) {
    console.log(
      `${new Date().toString()} 🚀 ~ file: withdrawal_request.service.ts:34 ~ AdminWithdrawalRequestService ~ find ~ loggedUser:`,
      loggedUser,
    );
    try {
      const baseQuery: FindOptionsWhere<WithdrawalRequest> = {
        ...(donationId && {
          donation: {
            id: donationId,
          },
        }),
        ...(status && {
          status,
        }),
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

      const where: FindOptionsWhere<WithdrawalRequest> | FindOptionsWhere<WithdrawalRequest>[] = search
        ? [
            {
              donation: {
                name: ILike(`%${search.trim().toLowerCase()}%`),
              },
              ...baseQuery,
            },
            {
              user: {
                email: ILike(`%${search.trim().toLowerCase()}%`),
              },
              ...baseQuery,
            },
          ]
        : baseQuery;

      const [data, total] = await this.withdrawalRequestRepository.findAndCount({
        where,
        withDeleted: true,
        relations: {
          user: true,
          donation: true,
          approvedBy: true,
        },
        order: {
          [sort || DefaultSort.CREATED_AT]: order || OrderDirection.DESC,
        },
        take: pageSize,
        skip: page * pageSize,
      });

      return {
        data: data.map((item) => new WithdrawalRequestData(item)),
        total,
        page,
        pageSize,
        totalPage: Math.ceil(total / pageSize),
      };
    } catch (e) {
      throw e;
    }
  }

  async approve({ id, input, loggedUser }: { id: string; input: any; loggedUser: LoggedUser }) {
    console.log(
      `${new Date().toString()} 🚀 ~ file: withdrawal_request.service.ts:99 ~ AdminWithdrawalRequestService ~ approve ~ input:`,
      input,
    );
    const user = await this.userRepository.findOne({
      where: {
        id: loggedUser.id,
      },
    });

    const request = await this.withdrawalRequestRepository.findOne({
      where: {
        id,
      },
      relations: {
        donation: true,
        user: true,
      },
    });
    if (!request) {
      throw new BadRequestException('Not Found');
    }

    if (request.status !== WithdrawalRequestStatus.PENDING) {
      throw new BadRequestException('Update Disabled');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const donationRepository = queryRunner.manager.getRepository(Donation);
    const withdrawalRequestRepository = queryRunner.manager.getRepository(WithdrawalRequest);
    try {
      await withdrawalRequestRepository.update(
        { id },
        {
          approvedAt: new Date(),
          approvedBy: user,
          status: WithdrawalRequestStatus.SUCCESSFUL,
        },
      );

      await donationRepository.update(
        {
          id: request.donation.id,
        },
        {
          canWithdrawnAmount: request.donation.canWithdrawnAmount - request.requestAmount,
        },
      );

      await queryRunner.commitTransaction();
      //  send email to user
      this.mailService.withdrawalRequestApproved({ email: request.user?.email }).catch((err) => {
        console.log(
          `${new Date().toString()} 🚀 ~ file: withdrawal_request.service.ts:136 ~ AdminWithdrawalRequestService ~ approve ~ err:`,
          err,
        );
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return this.findOne({ id, loggedUser });
  }

  async reject({ id, input, loggedUser }: { id: string; input: any; loggedUser: LoggedUser }) {
    const user = await this.userRepository.findOne({
      where: {
        id: loggedUser.id,
      },
    });

    const request = await this.withdrawalRequestRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    if (!request) {
      throw new BadRequestException('Not Found');
    }

    if (request.status !== WithdrawalRequestStatus.PENDING) {
      throw new BadRequestException('Update Disabled');
    }

    const { rejectedReason } = input;
    await this.withdrawalRequestRepository.update(
      { id },
      {
        approvedAt: new Date(),
        approvedBy: user,
        rejectedReason,
        status: WithdrawalRequestStatus.REJECTED,
      },
    );
    //  send email to user
    this.mailService.withdrawalRequestRejected({ email: request.user?.email }).catch((err) => {
      console.log(
        `${new Date().toString()} 🚀 ~ file: withdrawal_request.service.ts:186 ~ AdminWithdrawalRequestService ~ reject ~ err:`,
        err,
      );
    });
    return this.findOne({ id, loggedUser });
  }
}
