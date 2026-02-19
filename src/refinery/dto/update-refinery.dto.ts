import { IsOptional, IsString, MinLength } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class UpdateRefineryDto {
  @IsOptional()
  @IsString()
  @Trim()
  @MinLength(1)
  name?: string;
}
