import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { jwtConfiguration, microserviceConfiguration } from '@repo/nest-common';
import { ConfigType } from '@nestjs/config';
import { JwtAuthMiddleware } from '../middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [jwtConfiguration.KEY],
      useFactory: (jwtConfig: ConfigType<typeof jwtConfiguration>) => ({
        secret: jwtConfig.secret,
        signOptions: {
          algorithm: jwtConfig.algorithm,
        },
      }),
    }),
  ],
  providers: [JwtAuthMiddleware],
})
export class GatewayModule implements NestModule {
  constructor(
    @Inject(microserviceConfiguration.KEY)
    private readonly microserviceConfig: ConfigType<
      typeof microserviceConfiguration
    >,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const publicRoutes = [':service/swagger', ':service/swagger/:path'];

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
            proxyReq.setHeader(
              'x-internal-token',
              this.microserviceConfig.gatewaySecret,
            );
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
