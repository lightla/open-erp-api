import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { OrderEntity } from './entities/order.entity'

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<OrderEntity> {
    return this.prisma.order.create({
      data,
      include: {
        products: true,
      },
    })
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.prisma.order.findMany({
      include: { products: true },
    })
  }

  async findById(id: string): Promise<OrderEntity | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        products: {
          include: { product: true },
        },
      },
    })
  }

  async update(id: string, data: any): Promise<OrderEntity> {
    return this.prisma.order.update({
      where: { id },
      data,
      include: { products: true },
    })
  }

  async deleteManyProducts(orderId: string): Promise<void> {
    await this.prisma.orderProduct.deleteMany({ where: { orderId } })
  }

  async delete(id: string): Promise<OrderEntity> {
    return this.prisma.order.delete({ where: { id } })
  }
}

