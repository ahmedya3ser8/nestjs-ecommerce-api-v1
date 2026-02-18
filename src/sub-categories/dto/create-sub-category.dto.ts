import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'subCategory name is required' })
  @MinLength(3, { message: 'subCategory name is too short' })
  @MaxLength(30, { message: 'subCategory name is too long' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'subCategory description is too long' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  categoryId: number;
}
