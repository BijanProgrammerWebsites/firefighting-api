import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateStandardDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  questions?: string[];
}
