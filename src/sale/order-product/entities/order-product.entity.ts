import { ProductEntity } from "../../product/entities/product.entity";

export class OrderProductEntity {
  id: string
  quantity: number
  unitPrice: number
  totalAmount: number
  orderId: string
  productId: string
  product?: ProductEntity
  createdAt: Date
  updatedAt: Date
}
