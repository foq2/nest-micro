import { Controller, HttpException } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { UserMessagePattern, VerifyUserPayloadDto } from '@repo/nest-common';
import { CommandBus } from '@nestjs/cqrs';
import { VerifyUserCommand } from './commands';

@Controller()
export class UserConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('123', Transport.TCP)
  async test() {
    throw new HttpException('Lỗi cố tình throw từ Service B để test!', 400);
    // return 'test oke';
  }

  @EventPattern()
  async event() {
    return 'event';
  }

  @MessagePattern(UserMessagePattern.GetUser, Transport.TCP)
  async getUser(data: any) {}

  @MessagePattern(UserMessagePattern.VerifyUser, Transport.TCP)
  async verifyUser(@Payload() payload: VerifyUserPayloadDto) {
    return this.commandBus.execute(new VerifyUserCommand(payload));
  }
}
