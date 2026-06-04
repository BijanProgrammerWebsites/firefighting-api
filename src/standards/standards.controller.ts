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
import { StandardsService } from "./standards.service";
import { CreateStandardDto } from "./dto/create-standard.dto";
import { UpdateStandardDto } from "./dto/update-standard.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleEnum } from "../shared/enums/role.enum";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "../users/entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller("standards")
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Post()
  public create(@Body() dto: CreateStandardDto, @GetUser() user: User) {
    return this.standardsService.create(dto, user);
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
    @Body() dto: UpdateStandardDto,
    @GetUser() user: User,
  ) {
    return this.standardsService.update(id, dto, user);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.standardsService.remove(id);
  }
}
