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
import { AnswersService } from "./answers.service";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("answers")
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  public create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @Get()
  public findAll() {
    return this.answersService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.answersService.findOne(id);
  }

  @Patch(":id")
  public update(
    @Param("id") id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.answersService.update(id, updateAnswerDto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.answersService.remove(id);
  }
}
