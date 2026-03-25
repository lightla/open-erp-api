import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    const adapter = new PrismaPg(
      new Pool({
        connectionString: configService.get<string>('DATABASE_URL'),
      }),
    )

    super({ adapter })
  }

  async onModuleInit() {
    await this.$connect()
  }
}