import { IsOptional, IsString, MinLength } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class UpdateDto {
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
}
