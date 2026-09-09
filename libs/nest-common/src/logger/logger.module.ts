import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { NodeEnv } from '../enums';
import { appCommonConfiguration } from '../config';
import { ConfigModule, ConfigType } from '@nestjs/config';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule.forFeature(appCommonConfiguration)],
      inject: [appCommonConfiguration.KEY],
      useFactory: (config: ConfigType<typeof appCommonConfiguration>) => ({
        pinoHttp: {
          transport:
            config.nodeEnv !== NodeEnv.Production
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                  },
                }
              : undefined,
          level: config.logLevel,
          autoLogging: false,
        },
      }),
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
