import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerEntity } from './entities/customer.entity'

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerDto): Promise<CustomerEntity> {
    return this.prisma.customer.create({ data })
  }

  async findAll(): Promise<CustomerEntity[]> {
    return this.prisma.customer.findMany()
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    return this.prisma.customer.findUnique({ where: { id } })
  }

  async update(id: string, data: UpdateCustomerDto): Promise<CustomerEntity> {
    return this.prisma.customer.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<CustomerEntity> {
    return this.prisma.customer.delete({ where: { id } })
  }
}

