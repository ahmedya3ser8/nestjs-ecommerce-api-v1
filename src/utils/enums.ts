export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed'
}

export enum PaymentMethodType {
  CASH = 'cash',
  CARD = 'card'
}

export enum OrderStatusType {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatusType {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}