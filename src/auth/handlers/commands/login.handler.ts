import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AuthService, type AuthTokens } from '../../auth.service'
import { LoginCommand } from '../../commands/impl/login.command'

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, AuthTokens> {
  constructor(private readonly authService: AuthService) {}

  execute(command: LoginCommand): Promise<AuthTokens> {
    return this.authService.loginLocal(command.email, command.password)
  }
}
