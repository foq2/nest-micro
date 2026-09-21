import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { AppException, ERROR_RESPONSE } from '@repo/nest-common';
import { CreateUserBodyDto, CreateUserResponseDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
  ) {}

  async getInfo(userId: string) {
    return this.userRepo.findOneOrFail(userId);
  }

  async createUser(body: CreateUserBodyDto): Promise<CreateUserResponseDto> {
    const existingUser = await this.userRepo.findOne({ email: body.email });
    if (existingUser) {
      throw new AppException(ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
    }

    const user = this.userRepo.create(body);

    await this.em.persist(user).flush();

    return { id: user.id };
  }
}
