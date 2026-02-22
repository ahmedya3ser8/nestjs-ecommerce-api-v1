import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "src/utils/enums";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
