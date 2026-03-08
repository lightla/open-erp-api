import { IsNotEmpty, IsString } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  productName: string

  @IsString()
  @IsNotEmpty()
  productType: string
}
