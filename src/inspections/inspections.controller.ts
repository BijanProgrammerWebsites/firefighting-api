import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { InspectionsService } from "./inspections.service";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleEnum } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("inspections")
export class InspectionsController {
  constructor(private readonly inspectionService: InspectionsService) {}

  @Roles(RoleEnum.ADMIN, RoleEnum.INSPECTOR)
  @Post()
  public create(@Body() dto: CreateInspectionDto) {
    return this.inspectionService.create(dto);
  }

  @Get()
  public findAll() {
    return this.inspectionService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.inspectionService.findOne(id);
  }
}
