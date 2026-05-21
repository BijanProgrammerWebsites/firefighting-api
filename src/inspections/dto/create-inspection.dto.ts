import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Trim } from "../../shared/decorators/trim.decorator";
import { DefectSeverityEnum } from "../../shared/enums/defect-severity.enum";

export class CreateInspectionAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInspectionAnswerDto)
  answers: CreateInspectionAnswerDto[];
}
