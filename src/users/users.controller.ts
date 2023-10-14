import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user-dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    const userId = session.userId;
    session.userId = null;
    return `User with ID ${userId} signed out`;
  }

  @Post('signup')
  async creteUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findById(parseInt(id));
  }

  @Get()
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
