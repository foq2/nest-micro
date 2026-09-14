import { UserService } from './user.service';
import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser() {
    return this.userService.createUser();
  }
}
