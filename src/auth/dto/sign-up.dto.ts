import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { Role } from "../../shared/enums/role.enum";

export class SignUpDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;
}
