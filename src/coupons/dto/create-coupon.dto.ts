import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

import { DiscountType } from "src/utils/enums";

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  code: string;
  
  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType: DiscountType;

  @IsNumber()
  @IsNotEmpty()
  discountValue: number;

  @IsNumber()
  @IsNotEmpty()
  usageLimit: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
