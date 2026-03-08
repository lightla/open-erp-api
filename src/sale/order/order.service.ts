import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerName, customerId, status, products } = createOrderDto

    // 1. Nếu có products, tính toán giá trị và tạo nested
    let orderTotal = 0
    const orderItemsData: any[] = []

    if (products && products.length > 0) {
      for (const item of products) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        })
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

    // 2. Tạo Order (có hoặc không có products)
    return this.prisma.order.create({
      data: {
        customerName,
        customerId,
        status: status || 'pending',
        totalAmount: orderTotal,
        products: {
          create: orderItemsData,
        },
      },
      include: {
        products: true,
      },
    })
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { products: true },
    })
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { 
        customer: true, // Lấy thông tin Customer
        products: { 
          include: { product: true } // Lấy thông tin từng sản phẩm trong đơn
        } 
      },
    })
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return order
  }

  async update(id: string, updateData: any) {
    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: { products: true },
    })
  }

  async remove(id: string) {
    // Lưu ý: Trong Prisma, nếu có quan hệ Cascade Delete bạn có thể xóa thẳng
    // Nếu không, bạn cần xóa OrderProduct trước.
    await this.prisma.orderProduct.deleteMany({ where: { orderId: id } })
    return this.prisma.order.delete({ where: { id } })
  }
}

