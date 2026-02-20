import { Type } from "class-transformer";
import { 
  IsArray,
  IsBoolean, IsInt, IsNotEmpty, IsNumber, 
  IsOptional, IsString, Max, 
  MaxLength, Min, MinLength 
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'product title is required' })
  @MinLength(3, { message: 'product title is too short' })
  @MaxLength(100, { message: 'product title is too long' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  @MinLength(20, { message: 'product description is too short' })
  @MaxLength(2000, { message: 'product description is too long' })
  description: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty({ message: 'quantity is required' })
  quantity: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid decimal' })
  @IsNotEmpty({ message: 'quantity is required' })
  price: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'price after discount must be a valid decimal' })
  @IsOptional()
  priceAfterDiscount: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  colors: string[];

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  ratingAverage: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  ratingQuantity: number;
  
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sold: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  brandId: number;
  
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  subCategoryId: number;
}
