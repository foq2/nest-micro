import { UserService } from './user.service';
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiDocument, SuccessResponseDto, User } from '@repo/nest-common';
import {
  CreateUserBodyDto,
  CreateUserResponseDto,
  GetInfoResponseDto,
} from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiDocument({
    operation: {
      operationId: 'createUser',
      summary: 'Api createUser',
    },
    response: {
      status: HttpStatus.CREATED,
      type: SuccessResponseDto,
    },
  })
  async createUser(
    @Body() body: CreateUserBodyDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(body);
  }

  @Get()
  @ApiDocument({
    operation: {
      operationId: 'getInfo',
      summary: 'Api getInfo',
    },
    response: {
      status: HttpStatus.OK,
      type: GetInfoResponseDto,
    },
  })
  async getInfo(@User('id') id: string) {
    return this.userService.getInfo(id);
  }
}
