import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { OrderProductController } from './order-product.controller';
import { OrderProductRepository } from './order-product.repository';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [OrderModule, ProductModule],
  controllers: [OrderProductController],
  providers: [OrderProductService, OrderProductRepository],
})
export class OrderProductModule {}
