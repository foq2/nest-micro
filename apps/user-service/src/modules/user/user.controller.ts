import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiDocument, SuccessResponseDto, User } from '@repo/nest-common';
import {
  CreateUserBodyDto,
  CreateUserResponseDto,
  GetInfoResponseDto,
} from './dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands';
import { GetInfoQuery } from './queries';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
  async getInfo(@User('id') id: string): Promise<GetInfoResponseDto> {
    return this.queryBus.execute(new GetInfoQuery(id));
  }

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
    return this.commandBus.execute(new CreateUserCommand(body));
  }

  // TODO add more api? list/get-one/update/delete
}
