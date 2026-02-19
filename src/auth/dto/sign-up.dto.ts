import { IsString, MinLength } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class SignUpDto {
  @IsString()
  @Trim()
  @MinLength(1)
  username: string;

  @IsString()
  @Trim()
  @MinLength(1)
  password: string;
}
