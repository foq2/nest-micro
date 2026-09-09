import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { ConfigModule, ConfigType } from '@nestjs/config';
import {
  AllExceptionFilter,
  appCommonConfiguration,
  LoggerModule,
  MicroserviceName,
  tcpConfiguration,
  validate,
} from '@repo/nest-common';
import { appConfiguration } from '../config';
import { MicroserviceModule } from '@repo/nest-core';
import { Transport } from '@nestjs/microservices';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      // validationOptions: { abortEarly: false },
      load: [appCommonConfiguration, appConfiguration, tcpConfiguration],
    }),
    LoggerModule,
    MicroserviceModule.registerAsync([
      {
        name: MicroserviceName.UserService,
        transport: Transport.TCP,
        useFactory: (config: ConfigType<typeof tcpConfiguration>) => {
          return config[MicroserviceName.UserService];
        },
        inject: [tcpConfiguration.KEY],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
  ],
})
export class AppModule {}
