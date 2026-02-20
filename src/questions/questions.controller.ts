import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create() {
    return this.questionsService.create();
  }

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(":id")
  update() {
    return this.questionsService.update();
  }

  @Delete(":id")
  remove() {
    return this.questionsService.remove();
  }
}
