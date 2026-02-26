import { CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

@Entity({ name: 'wishlists' })
@Index(['user', 'product'], { unique: true }) 
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  user: User;
  
  @ManyToOne(() => Product, (product) => product.wishlists, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;
}
