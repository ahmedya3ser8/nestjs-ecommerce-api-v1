import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

import { User } from "../../users/entities/user.entity";
import { OrderItem } from "./order-item.entity";

import { OrderStatusType, PaymentMethodType, PaymentStatusType } from "../../utils/enums";
import { Address } from "../../addressess/entities/addressess.entity";

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
  orderNumber: string;

  @Column({ 
    type: 'decimal', precision: 10, scale: 2, default: 0,
    transformer: { 
      to: (value: number) => value, 
      from: (value: string) => parseFloat(value) 
    } 
  })
  taxPrice: number;
  
  @Column({ 
    type: 'decimal', 
    precision: 10, scale: 2, default: 0,
    transformer: { 
      to: (value: number) => value, 
      from: (value: string) => parseFloat(value) 
    } 
  })
  shippingPrice: number;
  
  @Column({ 
    type: 'decimal', 
    precision: 10, scale: 2,
    transformer: { 
      to: (value: number) => value, 
      from: (value: string) => parseFloat(value) 
    } 
  })
  totalOrderPrice: number;
  
  @Column({ type: 'enum', enum: PaymentMethodType, default: PaymentMethodType.CASH })
  paymentMethodType: PaymentMethodType;
  
  @Column({ type: 'enum', enum: OrderStatusType, default: OrderStatusType.PROCESSING })
  orderStatus: OrderStatusType;
  
  @Column({ type: 'enum', enum: PaymentStatusType, default: PaymentStatusType.PENDING })
  paymentStatus: PaymentStatusType;
  
  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @ManyToOne(() => Address, { eager: true })
  shippingAddress: Address;
}
