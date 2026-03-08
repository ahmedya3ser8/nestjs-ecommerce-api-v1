import { 
  BeforeInsert, 
  BeforeUpdate, 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import slugify from 'slugify';

import { Product } from "../../products/entities/product.entity";
import { ImageType } from "../../utils/types";

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
  
  @Column({ unique: true })
  slug: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  image: ImageType | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
  }
}
