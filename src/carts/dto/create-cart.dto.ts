import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
