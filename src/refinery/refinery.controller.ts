import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { RefineryService } from "./refinery.service";
import { UpdateRefineryDto } from "./dto/update-refinery.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("refinery")
export class RefineryController {
  constructor(private readonly refineryService: RefineryService) {}

  @Get()
  findTheOnlyOne() {
    return this.refineryService.findTheOnlyOne();
  }

  @Patch()
  updateTheOnlyOne(@Body() updateRefineryDto: UpdateRefineryDto) {
    return this.refineryService.updateTheOnlyOne(updateRefineryDto);
  }

  @Patch("picture")
  @UseInterceptors(FileInterceptor("picture"))
  async updatePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    return this.refineryService.updatePicture(file.path);
  }

  @Delete("picture")
  async removePicture() {
    return this.refineryService.removePicture();
  }
}
