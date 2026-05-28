import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ConfigService } from '@nestjs/config';

// === ĐOẠN CODE KIỂM TRA CHẮC CHẮN ===
console.log('=============================================');
console.log('🔍 THƯ MỤC LÀM VIỆC HIỆN TẠI (CWD):', process.cwd());
console.log('🌍 BIẾN TỪ ROOT (SHARED_GLOBAL_VAR):', process.env.FRONTEND_URL);
console.log(
  '📦 BIẾN RIÊNG TRONG SERVICE (MY_SERVICE_VAR):',
  process.env.API_GATEWAY_PORT,
);
console.log('=============================================');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = await app.get(ConfigService);

  const port = configService.get<string>('app.port');
  await app.listen(port ?? 3000);
  console.log('App listening on port ' + port);
}
bootstrap();
