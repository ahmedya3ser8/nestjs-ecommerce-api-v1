import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;

  @Column({ type: 'float' })
  rating: number;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
  
  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product: Product;
}
