import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user/user.module'
import { UserDeviceModule } from './user/user-device/user-device.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProductModule } from './sale/product/product.module'
import { OrderModule } from './sale/order/order.module'
import { CustomerModule } from './customer/customer/customer.module'
import { OrderProductModule } from './sale/order-product/order-product.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    UserDeviceModule,
    PrismaModule,
    ProductModule,
    OrderModule,
    CustomerModule,
    OrderProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
