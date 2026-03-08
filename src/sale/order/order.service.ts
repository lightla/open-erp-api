import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderRepository } from './order.repository'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(orderData: CreateOrderDto) {
    return this.orderRepository.create(orderData)
  }

  async findAll() {
    return this.orderRepository.findAll()
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findById(id)
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return order
  }

  async update(id: string, updateData: any) {
    await this.findOne(id)
    return this.orderRepository.update(id, updateData)
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.orderRepository.delete(id)
  }
}
