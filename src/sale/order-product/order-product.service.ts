import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderProductRepository } from './order-product.repository'
import { CreateOrderProductDto } from './dto/create-order-product.dto'
import { UpdateOrderProductDto } from './dto/update-order-product.dto'
import { OrderRepository } from '../order/order.repository'
import { ProductRepository } from '../product/product.repository'

@Injectable()
export class OrderProductService {
  constructor(
    private readonly orderProductRepository: OrderProductRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createOrderProductDto: CreateOrderProductDto) {
    const { orderId, productId, quantity } = createOrderProductDto

    const order = await this.orderRepository.findById(orderId)
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }
    
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`)
    }

    const unitPrice = product.price

    const totalAmount = unitPrice * quantity

    const orderProduct = await this.orderProductRepository.create({
      orderId,
      productId,
      quantity,
      unitPrice,
      totalAmount,
    })

    await this.recalculateOrderTotal(orderId)
    
    return orderProduct
  }

  async findAll() {
    return this.orderProductRepository.findAll()
  }

  async findOne(id: string) {
    const item = await this.orderProductRepository.findById(id)
    if (!item) {
      throw new NotFoundException(`OrderProduct with ID ${id} not found`)
    }
    return item
  }

  async update(id: string, updateOrderProductDto: UpdateOrderProductDto) {
    const existing = await this.findOne(id);
    await this.orderProductRepository.update(id, updateOrderProductDto);
    await this.recalculateOrderTotal(existing.orderId);
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    await this.orderProductRepository.delete(id);
    await this.recalculateOrderTotal(existing.orderId);
  }

  private async recalculateOrderTotal(orderId: string) {
    const allItems = await this.orderProductRepository.findByOrderId(orderId)

    const total = allItems.reduce((acc, curr) => acc + curr.totalAmount, 0)
    await this.orderProductRepository.updateOrderTotal(orderId, total)
  }
}

