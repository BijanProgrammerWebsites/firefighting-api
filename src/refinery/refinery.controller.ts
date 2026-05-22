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
import { RoleEnum } from "../shared/enums/role.enum";

@Controller("refinery")
export class RefineryController {
  constructor(private readonly refineryService: RefineryService) {}

  @Get()
  public findTheOnlyOne() {
    return this.refineryService.findTheOnlyOne();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/detailed")
  public findDetailed() {
    return this.refineryService.findDetailed();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch()
  public updateTheOnlyOne(@Body() dto: UpdateRefineryDto) {
    return this.refineryService.updateTheOnlyOne(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch("picture")
  @UseInterceptors(FileInterceptor("picture"))
  public async updatePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("هیچ فایلی آپلود نشده است.");
    }

    return this.refineryService.updatePicture(file.filename);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete("picture")
  public async removePicture() {
    return this.refineryService.removePicture();
  }
}
