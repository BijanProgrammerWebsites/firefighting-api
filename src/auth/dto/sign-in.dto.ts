import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  /** @example "admin" */
  @IsString()
  @IsNotEmpty()
  username: string;

  /** @example "admin" */
  @IsString()
  @IsNotEmpty()
  password: string;
}
