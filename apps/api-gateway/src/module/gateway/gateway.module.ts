import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { microserviceConfiguration } from '@repo/nest-common';
import { ConfigType } from '@nestjs/config';

@Module({})
export class GatewayModule implements NestModule {
  constructor(
    @Inject(microserviceConfiguration.KEY)
    private readonly microserviceConfig: ConfigType<
      typeof microserviceConfiguration
    >,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        createProxyMiddleware({
          target: '',
          changeOrigin: true,
          pathRewrite: { '^/auth-service': '' },
        }),
      )
      .forRoutes('auth-service');
  }
}
