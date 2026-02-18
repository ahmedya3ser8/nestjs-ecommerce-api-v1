import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import slugify from 'slugify';
import { Category } from "src/categories/entities/category.entity";

@Entity({ name: 'subCategories' })
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  slug: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.subCategories)
  category: Category;

  @BeforeInsert()
  @BeforeUpdate()
  setSlug() {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
  }
}
