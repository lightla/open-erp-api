import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductEntity } from './entities/product.entity'

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<ProductEntity> {
    return this.prisma.product.create({ data })
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.prisma.product.findMany()
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.prisma.product.findUnique({ where: { id } })
  }

  async update(id: string, data: UpdateProductDto): Promise<ProductEntity> {
    return this.prisma.product.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<ProductEntity> {
    return this.prisma.product.delete({ where: { id } })
  }
}

