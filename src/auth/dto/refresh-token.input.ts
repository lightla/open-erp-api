import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

@InputType()
export class RefreshTokenInput {
  @ApiProperty()
  @Field()
  @IsString()
  refreshToken: string
}
