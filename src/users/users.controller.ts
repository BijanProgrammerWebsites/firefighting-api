import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";

import { GetUser } from "../auth/decorators/get-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { UpdateUserDto } from "./dto/update-user.dto";

import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("users")
export class UsersController {
  public constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  public findAllUsers() {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  public me(@GetUser() user: User) {
    return this.userService.me(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch("update")
  public update(@GetUser() user: User, @Body() dto: UpdateUserDto) {
    return this.userService.update(user, dto);
  }
}
