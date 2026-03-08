import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'node:fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Open ERP API')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // Lệnh này cực kỳ quan trọng: Nó sẽ ghi toàn bộ API ra file swagger.json
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2))

  SwaggerModule.setup('api', app, document)
  
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

  // 3. Kích hoạt CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  const configService = app.get(ConfigService)

  const appPort = configService.get<number>('APP_PORT', 3000)
  
  await app.listen(appPort)
  console.log(`🚀 API is running on: http://localhost:${appPort}/api`)
}

bootstrap()
