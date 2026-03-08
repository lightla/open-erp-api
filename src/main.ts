import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // 1. Kích hoạt Validation Toàn Cục
  // Dữ liệu không hợp lệ sẽ bị tự động từ chối với mã lỗi 400
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không có trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu gửi lên các trường thừa
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (ví dụ chuỗi sang số)
    }),
  )

  // 2. Thêm tiền tố API (VD: http://localhost:3000/api/customers)
  app.setGlobalPrefix('api')

  const configService = app.get(ConfigService)
  const appPort = configService.get<number>('APP_PORT', 3000)
  
  await app.listen(appPort)
  console.log(`🚀 API is running on: http://localhost:${appPort}/api`)
}
bootstrap()
