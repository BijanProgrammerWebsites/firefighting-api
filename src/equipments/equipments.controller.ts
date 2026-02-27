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
import { EquipmentsService } from "./equipments.service";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { MoveDto } from "../shared/dto/move.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleEnum } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("equipments")
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Roles(RoleEnum.ADMIN)
  @Post()
  public create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentsService.create(dto);
  }

  @Get()
  public findAll() {
    return this.equipmentsService.findAll();
  }

  @Get("buckets")
  public buckets() {
    return this.equipmentsService.buckets();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.equipmentsService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(":id")
  public update(@Param("id") id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentsService.update(id, dto);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.equipmentsService.remove(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Post(":id/move")
  public move(@Param("id") id: string, @Body() dto: MoveDto) {
    return this.equipmentsService.move(id, dto);
  }
}
