import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { appConfiguration } from './config';
import { ConfigType } from '@nestjs/config';
import {
  appCommonConfiguration,
  CommonLogger,
  logBootstrapInfo,
  setupApiDocs,
} from '@repo/nest-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const { appPort, appName } = app.get<ConfigType<typeof appConfiguration>>(
    appConfiguration.KEY,
  );

  const { nodeEnv } = app.get<ConfigType<typeof appCommonConfiguration>>(
    appCommonConfiguration.KEY,
  );
  const logger = app.get(CommonLogger);

  app.useLogger(logger);

  // API docs
  await setupApiDocs(app, appName, ['/auth']);

  await app.listen(appPort);

  logBootstrapInfo(app, {
    nodeEnv,
    logger,
    appPort,
    msListener: { transport: 'http', address: 'null' },
  });
}
bootstrap();
