import { Module } from '@nestjs/common';
import { UserConsumer } from './consumer';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '../../data-access';
import { UserController } from './user.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserConsumer, UserController],
  providers: [UserService],
})
export class UserModule {}
