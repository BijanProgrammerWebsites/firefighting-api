import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { Role } from "../../shared/enums/role.enum";

export class UpdateDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @Trim()
  @MinLength(1)
  username?: string;

  @IsOptional()
  @IsString()
  @Trim()
  @MinLength(1)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
