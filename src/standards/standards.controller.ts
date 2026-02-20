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
import { StandardsService } from "./standards.service";
import { CreateStandardDto } from "./dto/create-standard.dto";
import { UpdateStandardDto } from "./dto/update-standard.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("standards")
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Post()
  public create(@Body() createStandardDto: CreateStandardDto) {
    return this.standardsService.create(createStandardDto);
  }

  @Get()
  public findAll() {
    return this.standardsService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.standardsService.findOne(id);
  }

  @Patch(":id")
  public update(
    @Param("id") id: string,
    @Body() updateStandardDto: UpdateStandardDto,
  ) {
    return this.standardsService.update(id, updateStandardDto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.standardsService.remove(id);
  }
}
