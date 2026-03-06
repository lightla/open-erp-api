## 0. Entry point `main.ts`
```jsonc
// NestJS đọc nest-cli.json tìm root folder (source code), entry file (default: main.ts)
// ┌─────────────────────────────────────────────────────────────┐
// │ nest-cli.json                                               │
// └─────────────────────────────────────────────────────────────┘
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  // "entryFile": "main.ts", // default
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

## 1. ENV
+ `process.env` là một object **global** trong Node.js.

1. ENV assign
+ CLI inline:
    PORT=4000 npm run start
+ EXPORT (Shell session on single CLI)
    export PORT=4000
    npm run start:dev
+ .env file
    PORT=3000
    // NODEJS không đọc .env 
    // Sử dụng dotenv hoặc @nestjs/config (nhân là dotenv) đọc & gán vào process.env khi app runtime

2. ENV load & override priority
+ OS / CLI set PORT=5000
+ Node.js start → process.env.PORT = 5000
+ dotenv đọc .env → thấy PORT=3000
    + dotenv KHÔNG ghi đè biến đã tồn tại

### Cấu hình @nestjs/config trong `AppModule`
```typescript
┌─────────────────────────────────────────────────────────────┐
│ src/app.module.ts                                           │
└─────────────────────────────────────────────────────────────┘
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,      // Cho phép dùng ConfigService ở mọi module mà không cần import lại
      envFilePath: '.env', // Đường dẫn tới file cấu hình (mặc định là .env)
    }),
  ],
})

┌─────────────────────────────────────────────────────────────┐
│ src/main.ts                                                 │
└─────────────────────────────────────────────────────────────┘
require('dotenv').config() // For Step 0

async function bootstrap() {
  const param0 = process.env.PARAM0
    // Step 0. Muốn sử dụng process.env trước khi NestJS khởi tạo AppModule
    // => cần nạp ENV thủ công từ dotenv trước 
    // require('dotenv').config()

  const app = await NestFactory.create(AppModule)
    // Step 1. NestJS khởi tạo AppModule, ConfigModule nạp toàn bộ biến từ .env vào process.env
  
  const port1 = process.env.APP_PORT ?? 3000
    // Step 2. process.env đã sẵn sàng để sử dụng

  const port2 = this.configService.get<number>('APP_PORT', 3000) 
    // Step 3. Có thể sử dụng configService thay vì process.env

  await app.listen(port)
}

bootstrap()
```
