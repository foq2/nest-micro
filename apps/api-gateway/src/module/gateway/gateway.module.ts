import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { microserviceConfiguration } from '@repo/nest-common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtAuthMiddleware } from '../middleware';

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
    const publicRoutes = [];

    consumer
      .apply(JwtAuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes('auth-service', 'user-service');

    const createProxy = (targetUrl: string, pathPrefix: string) =>
      createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: { [`^/${pathPrefix}`]: '' },
        on: {
          proxyReq: (proxyReq, req) => {
            fixRequestBody(proxyReq, req);
            proxyReq.setHeader('x-gateway-secret', '123');
          },
        },
      });

    consumer
      .apply(
        createProxy(this.microserviceConfig.authService.url, 'auth-service'),
      )
      .forRoutes('auth-service');

    consumer
      .apply(
        createProxy(this.microserviceConfig.userService.url, 'user-service'),
      )
      .forRoutes('user-service');
  }
}
