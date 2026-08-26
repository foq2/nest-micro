import { Inject, Injectable } from '@nestjs/common';
import { appConfiguration } from 'src/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
  ) {}

  login(body: any): any {
    return 'login';
  }
}
