import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateUnitDto {
  @IsUUID()
  zoneId: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;
}
