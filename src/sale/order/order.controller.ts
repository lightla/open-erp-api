import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }

  @Patch('/:id')
  async update(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(orderId, updateOrderDto)
  }

  @Get('/:id')
  async findOne(@Param('id') orderId: string) {
    return this.orderService.findOne(orderId)
  }

  @Get('/')
  async findAll() {
    return this.orderService.findAll()
  }

  @Delete('/:id')
  async delete(@Param('id') orderId: string) {
    return this.orderService.remove(orderId)
  }
}
