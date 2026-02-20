import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { InspectionsService } from "./inspections.service";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";

@Controller("inspection")
export class InspectionsController {
  constructor(private readonly inspectionService: InspectionsService) {}

  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @Get()
  findAll() {
    return this.inspectionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.inspectionService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ) {
    return this.inspectionService.update(+id, updateInspectionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.inspectionService.remove(+id);
  }
}
