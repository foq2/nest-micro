import { Inject, Injectable } from '@nestjs/common';
import { appConfiguration } from 'src/config';
import { ConfigType } from '@nestjs/config';
import { callMs, MS_INJECTION_TOKEN } from '@repo/nest-core';
import {
  jwtConfiguration,
  JwtTokenType,
  MicroserviceName,
  TokenPayload,
} from '@repo/nest-common';
import { ClientProxy, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    @Inject(MS_INJECTION_TOKEN(MicroserviceName.UserService, Transport.TCP))
    private readonly userClientTcp: ClientProxy,
  ) {}

  login(body: any): any {
    const user = {};

    return 'login';
  }

  get123() {
    return callMs(this.userClientTcp.send('123', {}));
  }

  private async generateUserToken(user: any) {
    const tokenPayload = { ...user, jti: uuid() };

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
