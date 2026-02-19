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
import { UnitsService } from "./units.service";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("units")
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  public create(@Body() dto: CreateUnitDto) {
    return this.unitsService.create(dto);
  }

  @Get()
  public findAll() {
    return this.unitsService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.unitsService.findOne(+id);
  }

  @Patch(":id")
  public update(@Param("id") id: string, @Body() dto: UpdateUnitDto) {
    return this.unitsService.update(+id, dto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.unitsService.remove(+id);
  }
}
