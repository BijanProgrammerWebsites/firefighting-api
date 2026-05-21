import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { DefectsService } from "./defects.service";
import { UpdateDefectDto } from "./dto/update-defect.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleEnum } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller("defects")
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Get()
  public findAll() {
    return this.defectsService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.defectsService.findOne(id);
  }

  @Patch(":id")
  public update(@Param("id") id: string, @Body() dto: UpdateDefectDto) {
    return this.defectsService.update(id, dto);
  }
}
