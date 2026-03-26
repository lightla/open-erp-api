import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  AuthService,
  type AccessTokenPayload,
} from '../../auth.service'
import { ValidateAccessTokenQuery } from '../../queries/impl/validate-access-token.query'

@QueryHandler(ValidateAccessTokenQuery)
export class ValidateAccessTokenHandler
  implements IQueryHandler<ValidateAccessTokenQuery, AccessTokenPayload | null>
{
  constructor(private readonly authService: AuthService) {}

  async execute(
    query: ValidateAccessTokenQuery,
  ): Promise<AccessTokenPayload | null> {
    return this.authService.validateAccessToken(query.token)
  }
}
