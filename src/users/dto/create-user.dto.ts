import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { RoleEnum } from "../../shared/enums/role.enum";

export class CreateUserDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  password: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
