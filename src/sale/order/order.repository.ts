import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderDto) {
    return this.prisma.order.create({ data })
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { customer: true },
    })
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { customer: true },
    })
  }

  async update(id: string, data: any) {
    return this.prisma.order.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return this.prisma.order.delete({ where: { id } })
  }
}
