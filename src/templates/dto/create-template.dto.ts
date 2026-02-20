import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateTemplateDto {
  @IsUUID()
  standardId: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  description: string;
}
