import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateZoneDto {
  @IsUUID()
  siteId: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;
}
