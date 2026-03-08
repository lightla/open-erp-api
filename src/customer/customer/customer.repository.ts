import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerEntity } from './entities/customer.entity'

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerDto): Promise<string> {
    const result = await this.prisma.customer.create({ data })
    return result.id
  }

  async findAll(): Promise<CustomerEntity[]> {
    return this.prisma.customer.findMany() as unknown as CustomerEntity[]
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    return this.prisma.customer.findUnique({ where: { id } }) as unknown as CustomerEntity | null
  }

  async update(id: string, data: UpdateCustomerDto): Promise<void> {
    await this.prisma.customer.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({ where: { id } })
  }
}
