import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Trim } from "../../shared/decorators/trim.decorator";
import { DefectSeverityEnum } from "../../shared/enums/defect-severity.enum";
import { EquipmentStatusEnum } from "../../shared/enums/equipment-status.enum";

export class CreateInspectionAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @Trim()
  @IsOptional()
  text: string;

  @IsString()
  @Trim()
  @IsOptional()
  picture?: string | null;

  @IsEnum(DefectSeverityEnum)
  @IsOptional()
  severity?: DefectSeverityEnum | null;
}

export class CreateInspectionDto {
  @IsUUID()
  equipmentId: string;

  @IsEnum(EquipmentStatusEnum)
  status: EquipmentStatusEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInspectionAnswerDto)
  answers: CreateInspectionAnswerDto[];
}
