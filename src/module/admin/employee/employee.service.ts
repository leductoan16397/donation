import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeData } from './response/employee.res';
import { CreateEmployeeDto, FindEmployeeListDto } from './dto/employee.dto';
import { LoggedUser } from 'src/common/type';
import { Pagination } from 'src/common/common.response';
import { UserRole } from 'src/common/enum';
import { MailService } from 'src/module/common/mail/mail.service';
import { generateSalt, randomString } from 'src/common/utils';
import { AuthService } from 'src/module/auth/auth.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  async find({
    query: { page = 0, pageSize = 10, order = 'asc', sort = 'name', search }, // loggedUser,
  }: {
    query: FindEmployeeListDto;
    loggedUser: LoggedUser;
  }): Promise<Pagination<EmployeeData>> {
    const where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = (search && [
      {
        name: ILike(`%${search.trim().toLowerCase()}%`),
        role: In([UserRole.Employee, UserRole.Admin]),
      },
      {
        email: ILike(`%${search.trim().toLowerCase()}%`),
        role: In([UserRole.Employee, UserRole.Admin]),
      },
    ]) || {
      role: In([UserRole.Employee, UserRole.Admin]),
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
        return new EmployeeData(user);
      }),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async update({ id, updateInput }: { id: string; updateInput: any }) {
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
      where: { id, role: In([UserRole.Employee, UserRole.Admin]) },
    });
    return (user && new EmployeeData(user)) || null;
  }

  async create({ input, loggedUser }: { input: CreateEmployeeDto; loggedUser: LoggedUser }) {
    const { email, name, role } = input;
    // check username
    const existUser = await this.userRepository.countBy({ email: email.trim().toLowerCase() });

    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    // create user in
    const currentUser = await this.userRepository.findOneBy({ id: loggedUser.id });

    const newUser = this.userRepository.create({
      email: email.trim().toLowerCase(),
      role,
      name,
      salt: generateSalt(),
      country: currentUser.country,
    });

    const password = randomString(9);

    newUser.hashedPassword = this.authService.encodePassword({
      password: password,
      salt: newUser.salt,
    });

    await this.userRepository.save(newUser);

    // send mail
    this.mailService.employeeCreated({ email, password: password }).catch((err) => {
      console.log(`${new Date().toString()} 🚀 ~ file: employee.service.ts:120 ~ EmployeeService ~ create ~ err:`, err);
    });

    return new EmployeeData(newUser);
  }
}
