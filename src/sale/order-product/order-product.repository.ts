import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateOrderProductDto } from './dto/update-order-product.dto'
import { OrderProductEntity } from './entities/order-product.entity'

@Injectable()
export class OrderProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<OrderProductEntity> {
    return this.prisma.orderProduct.create({ data })
  }

  async findAll(): Promise<OrderProductEntity[]> {
    return this.prisma.orderProduct.findMany({
      include: { product: true },
    })
  }

  async findById(id: string): Promise<OrderProductEntity | null> {
    return this.prisma.orderProduct.findUnique({
      where: { id },
      include: { product: true },
    })
  }

  async update(id: string, data: UpdateOrderProductDto): Promise<OrderProductEntity> {
    return this.prisma.orderProduct.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<OrderProductEntity> {
    return this.prisma.orderProduct.delete({ where: { id } })
  }

  async findByOrderId(orderId: string): Promise<OrderProductEntity[]> {
    return this.prisma.orderProduct.findMany({ where: { orderId } })
  }

  async updateOrderTotal(orderId: string, totalAmount: number): Promise<void> {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount },
    })
  }
}

