import { UserService } from './user.service';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiDocument, SuccessResponseDto } from '@repo/nest-common';
import { CreateUserBodyDto, CreateUserResponseDto } from './dto';

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
}
