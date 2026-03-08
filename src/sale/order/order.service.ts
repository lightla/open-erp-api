import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderRepository } from './order.repository'
import { CreateOrderDto } from './dto/create-order.dto'
import { ProductRepository } from '../product/product.repository'

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerName, customerId, status, products } = createOrderDto

    let orderTotal = 0

    const orderItemsData: any[] = []

    if (products && products.length > 0) {
      for (const item of products) {
        const product = await this.productRepository.findById(item.productId)
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`)
        }

        const unitPrice = product.price

        const totalAmount = unitPrice * item.quantity
        orderTotal += totalAmount

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          totalAmount,
        })
      }
    }

    return this.orderRepository.create({
      customerName,
      customerId,
      status: status || 'pending',
      totalAmount: orderTotal,
      products: {
        create: orderItemsData,
      },
    })
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
    await this.orderRepository.update(id, updateData)

    return id
  }

  async remove(id: string) {
    await this.orderRepository.deleteManyProducts(id)
    return this.orderRepository.delete(id)
  }
}
