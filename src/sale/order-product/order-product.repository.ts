import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateOrderProductDto } from './dto/update-order-product.dto'
import { OrderProductEntity } from './entities/order-product.entity'

@Injectable()
export class OrderProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<string> {
    const result = await this.prisma.orderProduct.create({ data })
    return result.id
  }

  async findAll(): Promise<OrderProductEntity[]> {
    return this.prisma.orderProduct.findMany({
      include: { product: true },
    }) as unknown as OrderProductEntity[]
  }

  async findById(id: string): Promise<OrderProductEntity | null> {
    return this.prisma.orderProduct.findUnique({
      where: { id },
      include: { product: true },
    }) as unknown as OrderProductEntity | null
  }

  async update(id: string, data: UpdateOrderProductDto): Promise<void> {
    await this.prisma.orderProduct.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.orderProduct.delete({ where: { id } })
  }

  async findByOrderId(orderId: string): Promise<OrderProductEntity[]> {
    return this.prisma.orderProduct.findMany({ where: { orderId } }) as unknown as OrderProductEntity[]
  }

  async updateOrderTotal(orderId: string, totalAmount: number): Promise<void> {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount },
    })
  }
}
