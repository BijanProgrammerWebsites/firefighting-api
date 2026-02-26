import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Trim } from "../../shared/decorators/trim.decorator";

export class QuestionInputDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @IsString()
  @Trim()
  description: string;
}

export class CreateStandardDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionInputDto)
  @IsOptional()
  questions?: QuestionInputDto[];
}
