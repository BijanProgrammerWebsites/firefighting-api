import { PartialType } from "@nestjs/mapped-types";
import { CreateRefineryDto } from "./create-refinery.dto";

export class UpdateRefineryDto extends PartialType(CreateRefineryDto) {}
