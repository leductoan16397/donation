import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from './response/user.res';
import { FindUserListDto, UpdateUserDto } from './dto/user.dto';
import { LoggedUser } from 'src/common/type';
import { Pagination } from 'src/common/common.response';
import { UserRole } from 'src/common/enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async find({
    query: { page = 0, pageSize = 10, order = 'asc', sort = 'name', search, status }, // loggedUser,
  }: {
    query: FindUserListDto;
    loggedUser: LoggedUser;
  }): Promise<Pagination<UserData>> {
    const where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = (search && [
      {
        name: ILike(`%${search.trim().toLowerCase()}%`),
        ...(status && { kycStatus: status }),
        role: UserRole.User,
      },
      {
        email: ILike(`%${search.trim().toLowerCase()}%`),
        ...(status && { kycStatus: status }),
        role: UserRole.User,
      },
    ]) || {
      ...(status && { kycStatus: status }),
      role: UserRole.User,
    };

    const [data, total] = await this.userRepository.findAndCount({
      where,
      order: {
        [sort]: order,
      },
      take: pageSize,
      skip: page * pageSize,
    });

    return {
      data: data.map((user) => {
        return new UserData(user);
      }),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async update({ id, updateInput }: { id: string; updateInput: UpdateUserDto }) {
    throw new BadRequestException('Not Implement');
    const tenantUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!tenantUser) {
      throw new BadRequestException('User Not Found');
    }

    const { name, phone } = updateInput;

    await this.userRepository.save({
      id,
      name,
      phone,
    });

    return this.findOne({ id: tenantUser.id });
  }

  async findOne({ id }: { id: string }) {
    const user = await this.userRepository.findOne({
      where: { id, role: UserRole.User },
    });
    return (user && new UserData(user)) || null;
  }

  async remove({ id }: { id: string }) {
    throw new BadRequestException('Not Implement');
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    const rs = await this.userRepository.delete({ id });
    return rs;
  }
}
