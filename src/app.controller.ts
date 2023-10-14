import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './users/decorators/current-user.decorator';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('whoami')
  getHello(@CurrentUser() user: User) {
    return user;
  }
}
