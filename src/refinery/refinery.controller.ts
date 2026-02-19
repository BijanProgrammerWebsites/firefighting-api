import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RefineryService } from "./refinery.service";
import { CreateRefineryDto } from "./dto/create-refinery.dto";
import { UpdateRefineryDto } from "./dto/update-refinery.dto";

@Controller("refinery")
export class RefineryController {
  constructor(private readonly refineryService: RefineryService) {}

  @Post()
  create(@Body() createRefineryDto: CreateRefineryDto) {
    return this.refineryService.create(createRefineryDto);
  }

  @Get()
  findAll() {
    return this.refineryService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.refineryService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateRefineryDto: UpdateRefineryDto,
  ) {
    return this.refineryService.update(+id, updateRefineryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.refineryService.remove(+id);
  }
}
