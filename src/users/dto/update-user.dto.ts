import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { RoleEnum } from "../../shared/enums/role.enum";

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}
