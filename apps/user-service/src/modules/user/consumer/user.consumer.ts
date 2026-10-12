import { Controller, HttpException } from '@nestjs/common';
import { EventPattern, MessagePattern, Transport } from '@nestjs/microservices';
import { UserMessagePattern, VerifyUserPayloadDto } from '@repo/nest-common';
import { UserConsumerService } from './user-consumer.service';

@Controller()
export class UserConsumer {
  constructor(private readonly userConsumerService: UserConsumerService) {}

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
  async verifyUser(payload: VerifyUserPayloadDto) {
    return this.userConsumerService.verifyUser(payload);
  }
}
