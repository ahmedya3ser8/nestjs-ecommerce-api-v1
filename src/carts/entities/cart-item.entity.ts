import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Product } from "src/products/entities/product.entity";
import { Cart } from "./cart.entity";
import { Exclude } from "class-transformer";

@Entity({ name: 'cartItems' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;
  
  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @Exclude()
  cart: Cart;
}
