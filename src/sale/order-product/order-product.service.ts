import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateOrderProductDto } from './dto/create-order-product.dto'
import { UpdateOrderProductDto } from './dto/update-order-product.dto'

@Injectable()
export class OrderProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderProductDto: CreateOrderProductDto) {
    const { orderId, productId, quantity } = createOrderProductDto

    // 1. Kiểm tra Order & Product tồn tại
    const order = await this.prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundException(`Order with ID ${orderId} not found`)

    const product = await this.prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundException(`Product with ID ${productId} not found`)

    // 2. Tính toán tiền
    const unitPrice = product.price
    const totalAmount = unitPrice * quantity

    // 3. Tạo OrderProduct
    const orderProduct = await this.prisma.orderProduct.create({
      data: {
        orderId,
        productId,
        quantity,
        unitPrice,
        totalAmount,
      },
    })

    // 4. Cập nhật lại tổng tiền của Order
    await this.updateOrderTotal(orderId)

    return orderProduct
  }

  async findAll() {
    return this.prisma.orderProduct.findMany({
      include: { product: true },
    })
  }

  async findOne(id: string) {
    const item = await this.prisma.orderProduct.findUnique({
      where: { id },
      include: { product: true },
    })
    if (!item) throw new NotFoundException(`OrderProduct with ID ${id} not found`)
    return item
  }

  async update(id: string, updateOrderProductDto: UpdateOrderProductDto) {
    const item = await this.prisma.orderProduct.update({
      where: { id },
      data: updateOrderProductDto,
    })
    await this.updateOrderTotal(item.orderId)
    return item
  }

  async remove(id: string) {
    const item = await this.prisma.orderProduct.delete({ where: { id } })
    await this.updateOrderTotal(item.orderId)
    return item
  }

  private async updateOrderTotal(orderId: string) {
    const allItems = await this.prisma.orderProduct.findMany({
      where: { orderId },
    })
    const total = allItems.reduce((acc, curr) => acc + curr.totalAmount, 0)

    await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount: total },
    })
  }
}

