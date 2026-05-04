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
import { TemplatesService } from "./templates.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleEnum } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller("templates")
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @Post()
  public create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  @Get()
  public findAll() {
    return this.templateService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.templateService.findOne(id);
  }

  @Patch(":id")
  public update(@Param("id") id: string, @Body() dto: UpdateTemplateDto) {
    return this.templateService.update(id, dto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.templateService.remove(id);
  }
}
