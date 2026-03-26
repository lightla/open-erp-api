import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AUTH_CONSTANTS } from './constants'
import { LoginHandler } from './handlers/commands/login.handler'
import { RefreshTokenHandler } from './handlers/commands/refresh-token.handler'
import { ValidateAccessTokenHandler } from './handlers/queries/validate-access-token.handler'

const commandHandlers = [LoginHandler, RefreshTokenHandler]
const queryHandlers = [ValidateAccessTokenHandler]

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: AUTH_CONSTANTS.jwtSecret,
      signOptions: { expiresIn: AUTH_CONSTANTS.accessTokenExpiry },
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...commandHandlers, ...queryHandlers],
  exports: [AuthService],
})
export class AuthModule {}
