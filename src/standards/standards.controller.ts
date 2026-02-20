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

@Controller("standard")
export class StandardsController {
  constructor(private readonly standardService: StandardsService) {}

  @Post()
  create(@Body() createStandardDto: CreateStandardDto) {
    return this.standardService.create(createStandardDto);
  }

  @Get()
  findAll() {
    return this.standardService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.standardService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateStandardDto: UpdateStandardDto,
  ) {
    return this.standardService.update(+id, updateStandardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.standardService.remove(+id);
  }
}
