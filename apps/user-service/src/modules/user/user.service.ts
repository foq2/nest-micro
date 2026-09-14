import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../data-access';
import { EntityManager } from '@mikro-orm/postgresql';
import { SuccessResponseDto } from '@repo/nest-common';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    private readonly userRepo: UserRepository,
  ) {}

  async getInfo(userId: string) {
    return this.userRepo.findOneOrFail(userId);
  }

  async createUser() {
    const user = this.userRepo.create({
      email: '123',
      name: 'phong',
      password: '123',
      username: '123',
    });

    await this.em.persist(user).flush();

    return new SuccessResponseDto();
  }
}
