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
import { ZonesService } from "./zones.service";
import { CreateZoneDto } from "./dto/create-zone.dto";
import { UpdateZoneDto } from "./dto/update-zone.dto";
import { MoveDto } from "../shared/dto/move.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("zones")
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  public create(@Body() dto: CreateZoneDto) {
    return this.zonesService.create(dto);
  }

  @Get()
  public findAll() {
    return this.zonesService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.zonesService.findOne(id);
  }

  @Patch(":id")
  public update(@Param("id") id: string, @Body() dto: UpdateZoneDto) {
    return this.zonesService.update(id, dto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.zonesService.remove(id);
  }

  @Post(":id/move")
  public move(@Param("id") id: string, @Body() dto: MoveDto) {
    return this.zonesService.move(id, dto);
  }
}
