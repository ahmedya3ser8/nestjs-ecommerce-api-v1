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

  @IsInt()
  @IsNotEmpty({ message: 'quantity is required' })
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid decimal' })
  @IsNotEmpty({ message: 'quantity is required' })
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'price after discount must be a valid decimal' })
  @IsOptional()
  priceAfterDiscount: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  colors: string[];

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsNumber()
  @Min(1)
  @Max(5)
  ratingAverage: number;

  @IsInt()
  @IsOptional()
  ratingQuantity: number;
  
  @IsInt()
  @IsOptional()
  sold: number;

  @IsString()
  imageCover: string;
  
  @IsArray()
  @IsOptional()
  images: string[];

  @IsInt()
  brandId: number;
  
  @IsInt()
  subCategoryId: number;
}
