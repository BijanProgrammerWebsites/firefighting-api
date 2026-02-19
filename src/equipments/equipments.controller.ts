import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { EquipmentsService } from "./equipments.service";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("equipments")
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  public create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentsService.create(dto);
  }

  @Get()
  public findAll() {
    return this.equipmentsService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.equipmentsService.findOne(+id);
  }

  @Patch(":id")
  public update(@Param("id") id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentsService.update(+id, dto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.equipmentsService.remove(+id);
  }
}
