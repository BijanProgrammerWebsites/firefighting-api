import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AnswersService } from "./answers.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleEnum } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller("answers")
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Get()
  public findAll() {
    return this.answersService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.answersService.findOne(id);
  }
}
