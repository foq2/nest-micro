import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any): Promise<any> {
    return this.authService.login(body);
  }

  @Get('123')
  get123() {
    return this.authService.get123();
  }
}
