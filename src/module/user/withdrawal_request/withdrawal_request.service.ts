import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/entity/user.entity';
import { WithdrawalRequest, WithdrawalRequestStatus } from 'src/module/entity/withdrawal_request.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateWithdrawalRequestDTO, FindWithdrawalRequestListDto } from '../donation/dto/withdrawal_request.dto';
import { WithdrawalRequestData } from './response/withdrawal_request.res';
import { LoggedUser } from 'src/common/type';
import { DefaultSort, OrderDirection } from 'src/common/enum';
import { Donation, DonationStatus } from 'src/module/entity/donation.entity';
import { Pagination } from 'src/common/common.response';

@Injectable()
export class WithdrawalRequestService {
  constructor(
    @InjectRepository(WithdrawalRequest)
    private readonly withdrawalRequestRepository: Repository<WithdrawalRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
  ) {}

  async create({
    data,
    loggedUser,
    donationId,
  }: {
    data: CreateWithdrawalRequestDTO;
    loggedUser: LoggedUser;
    donationId: string;
  }) {
    try {
      const user = await this.userRepository.findOneBy({
        id: loggedUser.id,
      });

      const donation = await this.donationRepository.findOne({
        where: {
          id: donationId,
          owner: {
            id: loggedUser.id,
          },
        },
      });

      if (!donation) {
        throw new BadRequestException('Donation not found');
      }

      if (donation.status !== DonationStatus.COMPLETED) {
        throw new BadRequestException('Only completed donations can create requests');
      }

      const currentRequest = await this.withdrawalRequestRepository.findOne({
        where: {
          donation: {
            id: donationId,
          },
          status: WithdrawalRequestStatus.PENDING,
        },
      });

      if (currentRequest) {
        throw new BadRequestException('The previous withdrawal request has not been processed');
      }

      const { beneficiaryBankName, beneficiaryName, creditAccount, description, requestAmount } = data;

      if (requestAmount > donation.canWithdrawnAmount) {
        throw new BadRequestException('requestAmount must be less than or equal to canWithdrawnAmount');
      }

      const withdrawalRequest = await this.withdrawalRequestRepository.save({
        beneficiaryBankName,
        beneficiaryName,
        creditAccount,
        description,
        status: WithdrawalRequestStatus.PENDING,
        requestAmount,
        user,
        donation,
      });

      return new WithdrawalRequestData(withdrawalRequest);
    } catch (e) {
      throw e;
    }
  }

  async find({
    query,
    loggedUser,
  }: {
    query: FindWithdrawalRequestListDto;
    loggedUser: LoggedUser;
  }): Promise<Pagination<WithdrawalRequestData>> {
    try {
      const { page, donationId, order, pageSize, sort, status } = query;
      const where: FindOptionsWhere<WithdrawalRequest> = {
        user: {
          id: loggedUser.id,
        },
        ...(donationId && {
          donation: {
            id: donationId,
          },
        }),
        ...(status && {
          status,
        }),
      };

      if (status) {
        where.status = status;
      }

      const [data, total] = await this.withdrawalRequestRepository.findAndCount({
        where,
        relations: {
          donation: true,
        },
        order: {
          [sort || DefaultSort.CREATED_AT]: order || OrderDirection.DESC,
        },
        take: pageSize,
        skip: page * pageSize,
      });

      return {
        data: data.map((item) => new WithdrawalRequestData(item)),
        page: page,
        pageSize: pageSize,
        total,
        totalPage: Math.ceil(total / pageSize),
      };
    } catch (e) {
      throw e;
    }
  }

  async findOne({ id, loggedUser }: { id: string; loggedUser: LoggedUser }) {
    const data = await this.withdrawalRequestRepository.findOne({
      where: {
        id,
        user: {
          id: loggedUser.id,
        },
      },
    });

    return data ? new WithdrawalRequestData(data) : null;
  }

  async withdrawalRequestsByDonation({ donationId, loggedUser }: { donationId: string; loggedUser: LoggedUser }) {
    try {
      const data = await this.withdrawalRequestRepository.find({
        where: {
          user: {
            id: loggedUser.id,
          },
          donation: {
            id: donationId,
          },
        },
        relations: {
          user: true,
          donation: true,
        },
        order: {
          createdAt: -1,
        },
      });

      return data.map((item) => new WithdrawalRequestData(item));
    } catch (e) {
      throw e;
    }
  }
}
