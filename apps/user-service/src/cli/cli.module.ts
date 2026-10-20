import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@repo/nest-common';
import { UserModule } from '../modules/user';
import { appConfiguration } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      cache: true,
      load: [appConfiguration],
    }),
    UserModule,
  ],
})
export class CliModule {}
