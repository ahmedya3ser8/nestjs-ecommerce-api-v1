import { IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Reset code must be 6 digits' })
  resetCode: string;
}
