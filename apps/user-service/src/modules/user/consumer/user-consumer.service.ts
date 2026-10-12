import { Injectable } from '@nestjs/common';
import { VerifyUserPayloadDto } from '@repo/nest-common';

@Injectable()
export class UserConsumerService {
  constructor() {}

  async verifyUser(payload: VerifyUserPayloadDto) {

  }
}
