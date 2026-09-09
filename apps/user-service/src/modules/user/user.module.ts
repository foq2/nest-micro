import { Module } from '@nestjs/common';
import { UserConsumer } from './consumer';

@Module({
  controllers: [UserConsumer],
})
export class UserModule {}
