import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { Status } from "../../shared/enums/status.enum";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateAnswerDto {
  @IsUUID()
  inspectionId: string;

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
