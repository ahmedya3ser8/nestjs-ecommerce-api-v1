import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
