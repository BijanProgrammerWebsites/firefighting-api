import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import type { Request, Response } from "express";

import { User } from "../users/entities/user.entity";

import { GetUser } from "./decorators/get-user.decorator";

import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";

import { JwtPayloadType } from "./types/jwt-payload.type";

import { AuthService } from "./auth.service";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "../shared/enums/role.enum";

@Controller("auth")
export class AuthController {
  public constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post("sign-up")
  public signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post("sign-in")
  public signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(dto, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("sign-out")
  public signOut(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(user.id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get("verify")
  public verify() {
    return this.authService.verify();
  }

  @Get("refresh")
  public refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken: string | undefined = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found.");
    }

    try {
      const payload = this.jwtService.verify<JwtPayloadType>(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });

      const userId = payload.sub;

      if (!userId) {
        throw new UnauthorizedException("Invalid refresh token.");
      }

      return this.authService.refresh(userId, refreshToken, res);
    } catch {
      this.authService.clearCookies(res);
      throw new UnauthorizedException("Invalid or expired refresh token.");
    }
  }
}
