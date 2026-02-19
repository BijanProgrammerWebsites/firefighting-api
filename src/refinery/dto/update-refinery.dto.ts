import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class UpdateRefineryDto {
  @IsOptional()
  @IsString()
  @Trim()
  @IsNotEmpty()
  title?: string;
}
