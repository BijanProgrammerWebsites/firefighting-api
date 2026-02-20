import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { StandardsService } from "./standards.service";
import { CreateStandardDto } from "./dto/create-standard.dto";
import { UpdateStandardDto } from "./dto/update-standard.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";
import { UseGuards } from "@nestjs/common";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("standards")
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Post()
  create(@Body() createStandardDto: CreateStandardDto) {
    return this.standardsService.create(createStandardDto);
  }

  @Get()
  findAll() {
    return this.standardsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.standardsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateStandardDto: UpdateStandardDto,
  ) {
    return this.standardsService.update(id, updateStandardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.standardsService.remove(id);
  }
}
