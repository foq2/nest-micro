import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, RpcException, Transport } from '@nestjs/microservices';

@Controller()
export class UserConsumer {
  constructor() {}

  @MessagePattern('123', Transport.TCP)
  async test() {
    console.log('test');
    throw new BadRequestException('Lỗi cố tình throw từ Service B để test!');
    // return 'test oke';
  }
}
