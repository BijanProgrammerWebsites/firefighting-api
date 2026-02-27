import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  /** @example "admin" */
  @IsString()
  @IsNotEmpty()
  username: string;

  /** @example "1234" */
  @IsString()
  @IsNotEmpty()
  password: string;
}
