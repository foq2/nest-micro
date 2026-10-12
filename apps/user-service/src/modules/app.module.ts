import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfiguration } from '../config';
import {
  AllExceptionFilter,
  appCommonConfiguration,
  AppGuard,
  LoggerModule,
  tcpConfiguration,
  validate,
} from '@repo/nest-common';
import { UserModule } from './user';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      // validationOptions: { abortEarly: false },
      load: [appConfiguration, appCommonConfiguration, tcpConfiguration],
    }),
    MikroOrmModule.forRoot(config),
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
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_GUARD, useClass: AppGuard },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
