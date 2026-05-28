import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway';
import { ConfigModule } from '@nestjs/config';
import { appCommonConfiguration, validate } from '@repo/nest-common';
import { appConfiguration } from '../config';

@Module({
  imports: [
    GatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      // for joi
      // validationOptions: {
      //   abortEarly: false,
      // }
      load: [appCommonConfiguration, appConfiguration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
