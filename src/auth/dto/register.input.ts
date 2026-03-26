import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

@InputType()
export class RegisterInput {
  @ApiProperty({ example: 'admin@example.com' })
  @Field()
  @IsEmail()
  email: string

  @ApiProperty({ example: 'secret123' })
  @Field()
  @IsString()
  @MinLength(6)
  password: string
}
