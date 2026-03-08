import { IsEmail, IsOptional, IsString } from 'class-validator'

export class CreateCustomerDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  address?: string
}

