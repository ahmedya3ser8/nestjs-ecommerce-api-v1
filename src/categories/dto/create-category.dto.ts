import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @MinLength(3, { message: 'Category name is too short' })
  @MaxLength(30, { message: 'Category name is too long' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'category description is too long' })
  description?: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
