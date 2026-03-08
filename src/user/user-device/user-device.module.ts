import { Module } from '@nestjs/common'
import { UserDeviceService } from './user-device.service'
import { UserDeviceResolver } from './user-device.resolver'
@Module({
  providers: [UserDeviceResolver, UserDeviceService],
})
export class UserDeviceModule {}
