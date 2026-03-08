import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UserDeviceService } from './user-device.service'
import { CreateUserDeviceInput } from './dto/create-user-device.input'
import { UpdateUserDeviceInput } from './dto/update-user-device.input'
@Resolver('UserDevice')
export class UserDeviceResolver {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  @Mutation('createUserDevice')
  create(
    @Args('createUserDeviceInput') createUserDeviceInput: CreateUserDeviceInput,
  ) {
    return this.userDeviceService.create(createUserDeviceInput)
  }

  @Query('userDevice')
  findAll() {
    return this.userDeviceService.findAll()
  }

  @Query('userDevice')
  findOne(@Args('id') id: number) {
    return this.userDeviceService.findOne(id)
  }

  @Mutation('updateUserDevice')
  update(
    @Args('updateUserDeviceInput') updateUserDeviceInput: UpdateUserDeviceInput,
  ) {
    return this.userDeviceService.update(
      updateUserDeviceInput.id,
      updateUserDeviceInput,
    )
  }

  @Mutation('removeUserDevice')
  remove(@Args('id') id: number) {
    return this.userDeviceService.remove(id)
  }
}
