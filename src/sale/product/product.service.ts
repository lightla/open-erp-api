import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductRepository } from './product.repository'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto)
  }

  async findAll() {
    return this.productRepository.findAll()
  }

  async findOne(id: string) {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id)
    return this.productRepository.update(id, updateProductDto)
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.productRepository.delete(id)
  }
}
