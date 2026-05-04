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
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleEnum } from "../shared/enums/role.enum";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "./entities/user.entity";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller("users")
export class UsersController {
  public constructor(private readonly userService: UsersService) {}

  @Post()
  public create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  public findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  public findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch(":id")
  public update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(":id")
  public remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  public me(@GetUser() user: User) {
    return this.userService.me(user);
  }
}
