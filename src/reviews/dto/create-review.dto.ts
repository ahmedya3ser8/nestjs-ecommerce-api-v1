import { IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;
  
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
