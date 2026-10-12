import { Injectable } from '@nestjs/common';
import {
  AppException,
  ERROR_RESPONSE,
  VerifyUserPayloadDto,
} from '@repo/nest-common';
import { UserRepository } from '../../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { verifyHashed } from '../user.util';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class UserConsumerService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
  ) {}

  async verifyUser(@Payload() payload: VerifyUserPayloadDto) {
    const { username, password } = payload;
    const user = await this.userRepo.findOneOrFail({ username });

    if (!user?.password)
      throw new AppException(ERROR_RESPONSE.INVALID_CREDENTIALS);

    const isPasswordValid = verifyHashed(password, user.password);

    if (!isPasswordValid)
      throw new AppException(ERROR_RESPONSE.INVALID_CREDENTIALS);
  }
}
