import { Controller, HttpException } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';

@Controller()
export class UserConsumer {
  constructor() {}

  @MessagePattern('123', Transport.TCP)
  async test() {
    console.log('test');
    throw new HttpException('Lỗi cố tình throw từ Service B để test!', 400);
    // return 'test oke';
  }
}
