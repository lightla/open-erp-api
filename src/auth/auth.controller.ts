import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LoginCommand } from './commands/impl/login.command'
import { RefreshTokenCommand } from './commands/impl/refresh-token.command'
import {
  AuthPayload,
  RefreshTokenPayload,
  ValidateAccessTokenPayload,
} from './dto/auth-payload'
import { LoginInput } from './dto/login.input'
import { RefreshTokenInput } from './dto/refresh-token.input'
import { ValidateTokenInput } from './dto/validate-token.input'
import { ValidateAccessTokenQuery } from './queries/impl/validate-access-token.query'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: AuthPayload })
  async login(@Body() loginInput: LoginInput) {
    return this.commandBus.execute(
      new LoginCommand(loginInput.email, loginInput.password),
    )
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOkResponse({ type: RefreshTokenPayload })
  async refresh(@Body() refreshTokenInput: RefreshTokenInput) {
    return this.commandBus.execute(
      new RefreshTokenCommand(refreshTokenInput.refreshToken),
    )
  }

  @Post('validate')
  @HttpCode(200)
  @ApiOkResponse({ type: ValidateAccessTokenPayload })
  async validate(@Body() validateTokenInput: ValidateTokenInput) {
    return this.queryBus.execute(
      new ValidateAccessTokenQuery(validateTokenInput.token),
    )
  }
}
