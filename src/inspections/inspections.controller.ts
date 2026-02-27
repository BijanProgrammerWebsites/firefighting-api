import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { InspectionsService } from "./inspections.service";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("inspections")
export class InspectionsController {
  constructor(private readonly inspectionService: InspectionsService) {}

  @Roles(Role.ADMIN, Role.INSPECTOR)
  @Post()
  public create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @Get()
  public findAll() {
    return this.inspectionService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.inspectionService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.INSPECTOR)
  @Patch(":id")
  public update(
    @Param("id") id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ) {
    return this.inspectionService.update(id, updateInspectionDto);
  }

  @Roles(Role.ADMIN, Role.INSPECTOR)
  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.inspectionService.remove(id);
  }
}
