import { Inject, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import {
  AppException,
  ERROR_RESPONSE,
  jwtConfiguration,
} from '@repo/nest-common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new AppException(ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfig.secret,
      });

      delete req.headers['x-auth-token'];
      req.headers['x-auth-token'] = Buffer.from(
        JSON.stringify(decoded),
      ).toString('base64');
    } catch {
      throw new AppException(ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
    }
  }
}
