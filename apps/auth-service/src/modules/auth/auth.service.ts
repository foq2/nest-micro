import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  login(body: any): any {
    return 'login';
  }
}
