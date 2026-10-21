import { Inject, Injectable } from '@nestjs/common';
import { appConfiguration } from 'src/config';
import { ConfigType } from '@nestjs/config';
import { callMs, MS_INJECTION_TOKEN, RedisService } from '@repo/nest-core';
import {
  AppException,
  ERROR_RESPONSE,
  jwtConfiguration,
  JwtTokenType,
  MicroserviceName,
  parseToSeconds,
  TokenPayload,
  UserMessagePattern,
  UserRequestPayload,
} from '@repo/nest-common';
import { ClientProxy, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import {
  LoginBodyDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenBodyDto,
  RefreshTokenResponseDto,
} from './dto';

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

  async login(body: LoginBodyDto): Promise<LoginResponseDto> {
    const user = await callMs(
      this.userClientTcp.send(UserMessagePattern.VerifyUser, body),
    );

    return this.generateUserToken(user);
  }

  async logout(user: UserRequestPayload) {
    const { id, jti } = user;

    await this.redisService.delete(this.redisService.getUserTokenKey(id, jti));

    return new LogoutResponseDto();
  }

  async refreshToken(
    body: RefreshTokenBodyDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = body;

    let tokenPayload: TokenPayload;
    try {
      tokenPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.secret,
      });
    } catch {
      throw new AppException(ERROR_RESPONSE.UNAUTHORIZED);
    }

    const { userId, jti } = tokenPayload;
    const isTokenValid = this.redisService.get(
      this.redisService.getUserTokenKey(userId, jti),
    );
    if (!isTokenValid) throw new AppException(ERROR_RESPONSE.UNAUTHORIZED);

    const accessToken = await this.generateJwtToken(
      tokenPayload,
      JwtTokenType.AccessToken,
      parseToSeconds(this.jwtConfig.accessTokenExpiresIn),
    );

    return { accessToken };
  }

  private async generateUserToken(user: any) {
    const jti = uuid();
    const tokenPayload = { ...user, jti };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateJwtToken(
        tokenPayload,
        JwtTokenType.AccessToken,
        parseToSeconds(this.jwtConfig.accessTokenExpiresIn),
      ),
      this.generateJwtToken(
        tokenPayload,
        JwtTokenType.RefreshToken,
        parseToSeconds(this.jwtConfig.refreshTokenExpiresIn),
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
