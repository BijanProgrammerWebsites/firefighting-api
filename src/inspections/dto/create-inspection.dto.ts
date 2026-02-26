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
import { Status } from "../../shared/enums/status.enum";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateInspectionAnswerDto {
  @IsUUID()
  questionId: string;

  @IsEnum(Status)
  status: Status;

  @IsString()
  @Trim()
  @IsNotEmpty()
  text: string;

  @IsString()
  @Trim()
  @IsOptional()
  picture?: string | null;
}

export class CreateInspectionDto {
  @IsUUID()
  equipmentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInspectionAnswerDto)
  answers: CreateInspectionAnswerDto[];
}
