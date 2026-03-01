import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAddressessDto {
  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalcode: string;

  @IsString()
  @IsNotEmpty()
  street: string;
  
  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;
}
