import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductEntity } from './entities/product.entity'

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<string> {
    const result = await this.prisma.product.create({ data })
    return result.id
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.prisma.product.findMany() as unknown as ProductEntity[]
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.prisma.product.findUnique({ where: { id } }) as unknown as ProductEntity | null
  }

  async update(id: string, data: UpdateProductDto): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } })
  }
}
