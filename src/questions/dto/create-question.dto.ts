import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";

export class CreateQuestionDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  text: string;
}
