import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { appConfiguration } from '../config';
import {
  appCommonConfiguration,
  HttpExceptionFilter,
  LoggerModule,
  MicroserviceName,
  tcpConfiguration,
  validate,
} from '@repo/nest-common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceModule } from '@repo/nest-core';
import { UserModule } from './user';
import { APP_FILTER } from '@nestjs/core';

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
    // MicroserviceModule.registerAsync([
    //   {
    //     name: MicroserviceName.UserService,
    //     transport: Transport.TCP,
    //     useFactory: (config: ConfigType<typeof tcpConfiguration>) => {
    //       return config[MicroserviceName.UserService];
    //     },
    //     inject: [tcpConfiguration.KEY],
    //   },
    // ]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
