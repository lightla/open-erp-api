import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import type { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { AUTH_CONSTANTS } from './constants'

export type AuthUserPayload = {
  id: string
  email: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  user: AuthUserPayload
}

export type RefreshAccessTokenResult = {
  accessToken: string
  user: AuthUserPayload
}

export type AccessTokenPayload = {
  sub: string
  email: string
}

export type RefreshTokenPayload = {
  sub: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  generateAccessToken(userId: string, email: string): string {
    const payload: AccessTokenPayload = { sub: userId, email }
    return this.jwtService.sign(payload, {
      secret: AUTH_CONSTANTS.jwtSecret,
      expiresIn: AUTH_CONSTANTS.accessTokenExpiry,
    })
  }

  generateRefreshToken(userId: string): string {
    const payload: RefreshTokenPayload = { sub: userId }
    return this.jwtService.sign(payload, {
      secret: AUTH_CONSTANTS.jwtRefreshSecret,
      expiresIn: AUTH_CONSTANTS.refreshTokenExpiry,
    })
  }

  async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(userId, email)
    const refreshToken = this.generateRefreshToken(userId)

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
      },
    }
  }

  validateAccessToken(token: string): AccessTokenPayload | null {
    try {
      return this.jwtService.verify(token, {
        secret: AUTH_CONSTANTS.jwtSecret,
      }) as AccessTokenPayload
    } catch {
      return null
    }
  }

  validateRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return this.jwtService.verify(token, {
        secret: AUTH_CONSTANTS.jwtRefreshSecret,
      }) as RefreshTokenPayload
    } catch {
      return null
    }
  }

  async validateLocalUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user?.password) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordValid = await this.comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return user
  }

  async registerLocal(email: string, password: string): Promise<AuthTokens> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = await this.hashPassword(password)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return this.generateTokens(user.id, user.email)
  }

  async loginLocal(email: string, password: string): Promise<AuthTokens> {
    const user = await this.validateLocalUser(email, password)
    return this.generateTokens(user.id, user.email)
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshAccessTokenResult> {
    const payload = this.validateRefreshToken(refreshToken)

    if (!payload) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token mismatch')
    }

    const accessToken = this.generateAccessToken(user.id, user.email)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    }
  }

  async findOrCreateGoogleUser(googleId: string, email: string): Promise<AuthTokens> {
    let user = await this.prisma.user.findUnique({
      where: { googleId },
    })

    if (!user) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { googleId },
        })
      } else {
        user = await this.prisma.user.create({
          data: {
            email,
            googleId,
          },
        })
      }
    }

    return this.generateTokens(user.id, user.email)
  }

  async findOrCreateFacebookUser(
    facebookId: string,
    email: string,
  ): Promise<AuthTokens> {
    let user = await this.prisma.user.findUnique({
      where: { facebookId },
    })

    if (!user) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { facebookId },
        })
      } else {
        user = await this.prisma.user.create({
          data: {
            email,
            facebookId,
          },
        })
      }
    }

    return this.generateTokens(user.id, user.email)
  }
}
