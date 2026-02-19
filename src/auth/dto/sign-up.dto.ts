import { IsEnum, IsString, MinLength } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { Role } from "../../shared/enums/role.enum";

export class SignUpDto {
  @IsString()
  @Trim()
  @MinLength(1)
  username: string;

  @IsString()
  @Trim()
  @MinLength(1)
  password: string;

  @IsEnum(Role)
  role: Role;
}
