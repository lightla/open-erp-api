import { Test, TestingModule } from '@nestjs/testing'
import { UserDeviceResolver } from './user-device.resolver'
import { UserDeviceService } from './user-device.service'
describe('UserDeviceResolver', () => {
  let resolver: UserDeviceResolver
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDeviceResolver, UserDeviceService],
    }).compile()
    resolver = module.get<UserDeviceResolver>(UserDeviceResolver)
  })
  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
