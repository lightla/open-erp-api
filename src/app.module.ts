import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để dùng ở mọi nơi mà không cần import lại vào từng module khác
      envFilePath: '.env', // Đường dẫn file (mặc định là .env ở gốc dự án)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
