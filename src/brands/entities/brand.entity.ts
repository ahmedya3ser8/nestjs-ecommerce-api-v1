import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Expose, Transform } from "class-transformer";
import slugify from 'slugify';

import { Product } from "src/products/entities/product.entity";

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

  @Expose()
  @Transform(({ value }) => value ? `${process.env.BASE_URL}/images/brands/${value}` : null)
  @Column({ nullable: true })
  image: string;

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
