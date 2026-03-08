import { IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  customerName: string

  @IsNumber()
  @Min(0, { message: 'Tổng tiền không được nhỏ hơn 0' })
  totalAmount: number

  @IsString()
  @IsOptional()
  customerId?: string

  @IsString()
  @IsOptional()
  status?: string
}
