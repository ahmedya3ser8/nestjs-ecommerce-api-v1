import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty({ message: 'brand name is required' })
  @MinLength(3, { message: 'brand name is too short' })
  @MaxLength(30, { message: 'brand name is too long' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'brand description is too long' })
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
