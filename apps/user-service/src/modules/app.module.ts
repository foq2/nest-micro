import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { appConfiguration } from '../config';
import {
  appCommonConfiguration,
  LoggerModule,
  MicroserviceName,
  tcpConfiguration,
  validate,
} from '@repo/nest-common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceModule } from '@repo/nest-core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      // validationOptions: { abortEarly: false },
      load: [appConfiguration, appCommonConfiguration, tcpConfiguration],
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
  providers: [AppService],
})
export class AppModule {}
