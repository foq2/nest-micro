import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import { ConfigModule } from '@nestjs/config';
import { appCommonConfiguration, LoggerModule } from '@repo/nest-common';
import { appConfiguration } from '../config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationOptions: { abortEarly: false },
      load: [appCommonConfiguration, appConfiguration],
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
