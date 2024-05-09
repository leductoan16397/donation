import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { Kyc } from '../../entity/kyc.entity';
import { LoggedUser } from 'src/common/type';
import { KycStatus, UserRole } from 'src/common/enum';
import { CreateKycDTO, FindKycListDto, UpdateKycDTO } from './dto/kyc.dto';
import { Pagination } from 'src/common/common.response';
import { KycData } from './response/kyc.res';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Kyc) private readonly kycRepository: Repository<Kyc>,
    @InjectDataSource() private readonly connection: DataSource,
  ) {}

  async updateKyc({ id, loggedUser, input }: { loggedUser: LoggedUser; id: string; input: UpdateKycDTO }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.User].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const kyc = await this.kycRepository.findOne({
      where: {
        id,
        user: {
          id: loggedUser.id,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!kyc) {
      throw new BadRequestException('Not Found');
    }

    const { files } = input;
    await this.kycRepository.update({ id }, { files });
    return;
  }

  async requestKyc({ input, loggedUser }: { loggedUser: LoggedUser; input: CreateKycDTO }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.User].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepository = queryRunner.manager.getRepository(User);
    const kycRepository = queryRunner.manager.getRepository(Kyc);
    try {
      const { files, about, address, avatar, birthday, city, country, email, fullName, gender, phone, state, zipCode } =
        input;

      const kyc = kycRepository.create({
        files,
        user,
        status: KycStatus.WAIT_APPROVE,
        about,
        address,
        avatar,
        birthday,
        city,
        country,
        email,
        fullName,
        gender,
        phone,
        state,
        zipCode,
      });
      await userRepository.update(
        { id: kyc.user.id },
        {
          kycStatus: KycStatus.WAIT_APPROVE,
        },
      );
      await kycRepository.save(kyc);

      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async find({
    query: { page = 0, pageSize = 10, order = 'asc', sort = 'createdAt', status },
    loggedUser,
  }: {
    query: FindKycListDto;
    loggedUser: LoggedUser;
  }): Promise<Pagination<KycData>> {
    const where: FindOptionsWhere<Kyc> | FindOptionsWhere<Kyc>[] = (status && { status }) || {};

    where.user = {
      id: loggedUser.id,
    };

    const [data, total] = await this.kycRepository.findAndCount({
      where,
      select: {
        id: true,
        files: true,
        status: true,
        approvedAt: true,
        createdAt: true,
        about: true,
        address: true,
        avatar: true,
        birthday: true,
        city: true,
        country: true,
        email: true,
        fullName: true,
        gender: true,
        phone: true,
        state: true,
        zipCode: true,
        rejectedReason: true,
      },
      order: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    });

    return {
      data: data.map((kyc) => {
        return new KycData(kyc);
      }),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOne({ id }: { id: string; loggedUser: LoggedUser }): Promise<KycData> {
    const kyc = await this.kycRepository.findOne({ where: { id } });

    return new KycData(kyc);
  }

  async latest({ loggedUser }: { loggedUser: LoggedUser }): Promise<KycData> {
    const kyc = await this.kycRepository.findOne({
      where: {
        user: {
          id: loggedUser.id,
        },
      },
      order: {
        createdAt: -1,
      },
    });

    return (kyc && new KycData(kyc)) || null;
  }
}
