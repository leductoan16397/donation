import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { Pagination } from 'src/common/common.response';
import { UserRole } from 'src/common/enum';
import { CurrentUser } from 'src/common/loggedUser.decorator';
import { LoggedUser } from 'src/common/type';
import { CreateEmployeeDto, FindEmployeeListDto } from './dto/employee.dto';
import { EmployeeData } from './response/employee.res';
import { Auth } from 'src/module/auth/decorator/auth.decorator';

@ApiTags('Admin.employee')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  find(@Query() query: FindEmployeeListDto, @CurrentUser() user: LoggedUser): Promise<Pagination<EmployeeData>> {
    try {
      return this.employeeService.find({ query, loggedUser: user });
    } catch (error) {
      console.log(`${new Date().toString()} 🚀 ~ EmployeeController ~ find ~ error:`, error);
      throw error;
    }
  }

  @Post()
  @Auth(UserRole.Admin)
  @ApiBearerAuth()
  create(@Body() input: CreateEmployeeDto, @CurrentUser() user: LoggedUser): Promise<EmployeeData> {
    try {
      return this.employeeService.create({ input, loggedUser: user });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: employee.controller.ts:37 ~ EmployeeController ~ create ~ error:`,
        error,
      );
      throw error;
    }
  }

  @Get(':id')
  @Auth(UserRole.Admin, UserRole.Employee)
  @ApiBearerAuth()
  findOne(@Param('id') id: string): Promise<EmployeeData> {
    try {
      if (!isUUID(id, 'all')) {
        throw new BadRequestException('Invalid id');
      }
      return this.employeeService.findOne({ id });
    } catch (error) {
      console.log(
        `${new Date().toString()} 🚀 ~ file: employee.controller.ts:55 ~ EmployeeController ~ findOne ~ error:`,
        error,
      );
      throw error;
    }
  }
}
