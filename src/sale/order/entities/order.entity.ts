import { CustomerEntity } from "../../../customer/customer/entities/customer.entity";
import { OrderProductEntity } from "../../order-product/entities/order-product.entity";

export class OrderEntity {
  id: string
  customerName: string
  totalAmount: number
  status: string
  customerId?: string
  customer?: CustomerEntity
  products?: OrderProductEntity[]
  createdAt: Date
  updatedAt: Date
}
