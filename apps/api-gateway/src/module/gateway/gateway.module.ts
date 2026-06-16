import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
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
          on: {
            proxyReq: (proxyReq, req: any) => {
              fixRequestBody(proxyReq, req);

              proxyReq.setHeader('x-gateway-secret', '123');
            },
          },
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
          on: {
            proxyReq: (proxyReq, req: any) => {
              fixRequestBody(proxyReq, req);

              proxyReq.setHeader('x-gateway-secret', '123');
            },
          },
        }),
      )
      .forRoutes('user-service');
  }
}
