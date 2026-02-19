import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateSiteDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;
}
