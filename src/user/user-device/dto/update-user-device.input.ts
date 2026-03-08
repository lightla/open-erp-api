import { CreateUserDeviceInput } from './create-user-device.input'
import { PartialType } from '@nestjs/mapped-types'
export class UpdateUserDeviceInput extends PartialType(CreateUserDeviceInput) {
  id: number
}
