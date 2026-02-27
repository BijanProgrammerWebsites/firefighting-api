import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateEquipmentDto {
  @IsUUID()
  templateId: string;

  @IsUUID()
  unitId: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;
}
