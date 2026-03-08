import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({
        data: createCustomerDto,
      });
    } catch (error) {
      // P2002 là mã lỗi của Prisma khi vi phạm ràng buộc Unique (Unique constraint failed)
      if (error.code === 'P2002') {
        throw new ConflictException('Email này đã tồn tại trong hệ thống');
      }
      throw error;
    }
  }


  async findAll() {
    return this.prisma.customer.findMany()
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    })
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`)
    }
    return customer
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      return await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      })
    } catch (error) {
      throw new NotFoundException(`Customer with ID ${id} not found`)
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.customer.delete({
        where: { id },
      })
    } catch (error) {
      throw new NotFoundException(`Customer with ID ${id} not found`)
    }
  }
}

