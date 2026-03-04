import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "src/users/entities/user.entity";
import { CartItem } from "./cart-item.entity";

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, scale: 2, default: 0, 
    transformer: { 
      to: (value: number) => value, 
      from: (value: string) => parseFloat(value) 
    } 
  })
  totalCartPrice: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, scale: 2, nullable: true,
    transformer: { 
      to: (value: number) => value, 
      from: (value: string) => parseFloat(value) 
    } 
  })
  totalPriceAfterDiscount: number | null;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.carts)
  user: User;
  
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true, eager: true })
  cartItems: CartItem[];
}
