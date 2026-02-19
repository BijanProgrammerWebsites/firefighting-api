import { IsUUID } from "class-validator";

export class MoveDto {
  @IsUUID()
  overId?: string;
}
