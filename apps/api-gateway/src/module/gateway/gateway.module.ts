import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { microserviceConfiguration } from '@repo/nest-common';
import { ConfigModule, ConfigType } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(microserviceConfiguration)],
})
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
          target: this.microserviceConfig.authService.url,
          changeOrigin: true,
          pathRewrite: { '^/auth-service': '' },
        }),
      )
      .forRoutes('auth-service');

    consumer
      .apply(
        createProxyMiddleware({
          target: this.microserviceConfig.userService.url,
          changeOrigin: true,
          pathRewrite: { '^/user-service': '' },
        }),
      )
      .forRoutes('user-service');
  }
}
