import { Inject, Injectable } from '@nestjs/common';
import { appConfiguration } from 'src/config';
import { ConfigType } from '@nestjs/config';
import { callMs, MS_INJECTION_TOKEN, RedisService } from '@repo/nest-core';
import {
  jwtConfiguration,
  JwtTokenType,
  MicroserviceName,
  parseToSeconds,
  TokenPayload,
  UserMessagePattern,
} from '@repo/nest-common';
import { ClientProxy, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { LoginBodyDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    @Inject(MS_INJECTION_TOKEN(MicroserviceName.UserService, Transport.TCP))
    private readonly userClientTcp: ClientProxy,
  ) {}

  async login(body: LoginBodyDto) {
    const user = await callMs(
      this.userClientTcp.send(UserMessagePattern.GetUser, { ...body }),
    );

    return 'login';
  }

  get123() {
    return callMs(this.userClientTcp.send('123', {}));
  }

  private async generateUserToken(user: any) {
    const jti = uuid();
    const tokenPayload = { ...user, jti };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateJwtToken(
        tokenPayload,
        JwtTokenType.AccessToken,
        this.jwtConfig.accessTokenExpiresIn,
      ),
      this.generateJwtToken(
        tokenPayload,
        JwtTokenType.RefreshToken,
        this.jwtConfig.refreshTokenExpiresIn,
      ),
    ]);

    await this.redisService.set(
      this.redisService.getUserTokenKey(user.id, jti),
      1,
      parseToSeconds(this.jwtConfig.refreshTokenExpiresIn),
    );

    return { accessToken, refreshToken };
  }

  private async generateJwtToken(
    payload: TokenPayload,
    type: JwtTokenType,
    expiresIn: number,
  ) {
    const tokenPayload: TokenPayload = { ...payload, type };

    return this.jwtService.signAsync(tokenPayload, { expiresIn });
  }
}
