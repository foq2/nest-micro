import { Controller, HttpException, UseFilters } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from '@repo/nest-common';

@UseFilters(RpcExceptionFilter)
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
