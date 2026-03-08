import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      return await this.customerRepository.create(createCustomerDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email này đã tồn tại trong hệ thống');
      }
      throw error;
    }
  }

  async findAll() {
    return this.customerRepository.findAll()
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      return await this.customerRepository.update(id, updateCustomerDto);
    } catch (error) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.customerRepository.delete(id);
    } catch (error) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }
}

}

