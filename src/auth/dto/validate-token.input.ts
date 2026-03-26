import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ValidateTokenInput {
  @ApiProperty()
  @IsString()
  token: string
}
