import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";

import { GetUser } from "../auth/decorators/get-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { UpdateDto } from "./dto/update.dto";

import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller("user")
export class UsersController {
  public constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public info(@GetUser() user: User) {
    return this.userService.info(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update")
  public update(@GetUser() user: User, @Body() dto: UpdateDto) {
    return this.userService.update(user, dto);
  }
}
