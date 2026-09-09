import { Inject, Injectable } from '@nestjs/common';
import { appConfiguration } from 'src/config';
import { ConfigType } from '@nestjs/config';
import { callMs, MS_INJECTION_TOKEN } from '@repo/nest-core';
import { MicroserviceName } from '@repo/nest-common';
import { ClientProxy, Transport } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    @Inject(MS_INJECTION_TOKEN(MicroserviceName.UserService, Transport.TCP))
    private readonly userClientTcp: ClientProxy,
  ) {}

  login(body: any): any {
    return 'login';
  }

  get123() {
    return callMs(this.userClientTcp.send('123', {}));
  }
}
