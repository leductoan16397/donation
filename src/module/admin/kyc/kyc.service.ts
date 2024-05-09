import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { Kyc } from '../../entity/kyc.entity';
import { LoggedUser } from 'src/common/type';
import { KycStatus, UserRole } from 'src/common/enum';
import { Pagination } from 'src/common/common.response';
import { MailService } from 'src/module/common/mail/mail.service';
import { AdminFindKycListDto, RejectKycDto } from 'src/module/admin/kyc/dto/kyc.dto';
import { KycData } from 'src/module/user/kyc/response/kyc.res';

@Injectable()
export class AdminKycService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Kyc) private readonly kycRepository: Repository<Kyc>,
    @InjectDataSource() private readonly connection: DataSource,

    private readonly mailService: MailService,
  ) {}

  async approveKyc({ id, loggedUser }: { loggedUser: LoggedUser; id: string }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.Admin, UserRole.Employee].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const kyc = await this.kycRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!kyc || kyc.status !== KycStatus.WAIT_APPROVE) {
      throw new BadRequestException('Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepository = queryRunner.manager.getRepository(User);
    const kycRepository = queryRunner.manager.getRepository(Kyc);
    try {
      const newKyc = await kycRepository.update(
        { id },
        {
          approvedAt: new Date(),
          approvedBy: user,
          status: KycStatus.VERIFIED,
        },
      );
      await userRepository.update(
        { id: kyc.user.id },
        {
          kycStatus: KycStatus.VERIFIED,
        },
      );
      await queryRunner.commitTransaction();

      //  send email to user
      this.mailService.kycApproved({ email: kyc.email }).catch((err) => {
        console.log(`${new Date().toString()} 🚀 ~ file: kyc.service.ts:69 ~ AdminKycService ~ approveKyc ~ err:`, err);
      });

      return newKyc;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectKyc({ id, loggedUser, input }: { loggedUser: LoggedUser; id: string; input: RejectKycDto }) {
    const user = await this.userRepository.findOneBy({
      id: loggedUser.id,
    });

    if (!user || ![UserRole.Admin, UserRole.Employee].includes(user.role)) {
      throw new BadRequestException('User Not Found');
    }

    const kyc = await this.kycRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!kyc || kyc.status !== KycStatus.WAIT_APPROVE) {
      throw new BadRequestException('Not Found');
    }

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepository = queryRunner.manager.getRepository(User);
    const kycRepository = queryRunner.manager.getRepository(Kyc);
    try {
      const { rejectedReason } = input;
      const newKyc = await kycRepository.update(
        { id },
        {
          approvedAt: new Date(),
          approvedBy: user,
          rejectedReason,
          status: KycStatus.VERIFY_DENY,
        },
      );
      await userRepository.update(
        { id: kyc.user.id },
        {
          kycStatus: KycStatus.VERIFY_DENY,
        },
      );
      await queryRunner.commitTransaction();

      //  send email to user
      this.mailService.kycRejected({ email: kyc.email }).catch((err) => {
        console.log(`${new Date().toString()} 🚀 ~ file: kyc.service.ts:133 ~ AdminKycService ~ rejectKyc ~ err:`, err);
      });

      return newKyc;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async find({
    query: { page = 0, pageSize = 10, order = 'asc', sort = 'createdAt', status, search },
  }: {
    query: AdminFindKycListDto;
    loggedUser: LoggedUser;
  }): Promise<Pagination<KycData>> {
    const where: FindOptionsWhere<Kyc> | FindOptionsWhere<Kyc>[] = (status && { status }) || {};

    if (search) {
      where.email = ILike(`%${search.trim().toLowerCase()}%`);
    }

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
      relations: {
        approvedBy: true,
        user: true,
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
}
