import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '../../data-access';
import { UserController } from './user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler, VerifyUserHandler } from './commands';
import { GetInfoHandler } from './queries';
import { UserConsumer } from './user.consumer';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), CqrsModule],
  controllers: [UserConsumer, UserController],
  providers: [CreateUserHandler, GetInfoHandler, VerifyUserHandler],
})
export class UserModule {}
