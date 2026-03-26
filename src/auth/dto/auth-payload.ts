import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType()
export class UserPayload {
  @ApiProperty()
  @Field()
  id: string

  @ApiProperty()
  @Field()
  email: string
}

@ObjectType()
export class AuthPayload {
  @ApiProperty()
  @Field()
  accessToken: string

  @ApiProperty()
  @Field()
  refreshToken: string

  @ApiProperty({ type: () => UserPayload })
  @Field(() => UserPayload)
  user: UserPayload
}

@ObjectType()
export class RefreshTokenPayload {
  @ApiProperty()
  @Field()
  accessToken: string

  @ApiProperty({ type: () => UserPayload })
  @Field(() => UserPayload)
  user: UserPayload
}

@ObjectType()
export class ValidateAccessTokenPayload {
  @ApiProperty()
  @Field()
  sub: string

  @ApiProperty()
  @Field()
  email: string
}
