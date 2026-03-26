import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  AuthService,
  type RefreshAccessTokenResult,
} from '../../auth.service'
import { RefreshTokenCommand } from '../../commands/impl/refresh-token.command'

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, RefreshAccessTokenResult>
{
  constructor(private readonly authService: AuthService) {}

  execute(command: RefreshTokenCommand): Promise<RefreshAccessTokenResult> {
    return this.authService.refreshAccessToken(command.refreshToken)
  }
}
