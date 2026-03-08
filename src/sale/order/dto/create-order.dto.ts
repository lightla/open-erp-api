import { IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class CreateOrderItemDto {
  @IsString()
  productId: string

  @IsNumber()
  @Min(1)
  quantity: number
}

export class CreateOrderDto {
  @IsString()
  customerName: string

  @IsString()
  @IsOptional()
  customerId?: string

  @IsString()
  @IsOptional()
  status?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsOptional()
  products?: CreateOrderItemDto[]
}
