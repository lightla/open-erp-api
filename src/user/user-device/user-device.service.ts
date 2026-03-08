import { Injectable } from '@nestjs/common'
import { CreateUserDeviceInput } from './dto/create-user-device.input'
import { UpdateUserDeviceInput } from './dto/update-user-device.input'
@Injectable()
export class UserDeviceService {
  create(createUserDeviceInput: CreateUserDeviceInput) {
    return 'This action adds a new userDevice'
  }

  findAll() {
    return 'This action returns all userDevice'
  }

  findOne(id: number) {
    return `This action returns a #${id} userDevice`
  }

  update(id: number, updateUserDeviceInput: UpdateUserDeviceInput) {
    return `This action updates a #${id} userDevice`
  }

  remove(id: number) {
    return `This action removes a #${id} userDevice`
  }
}
