import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import { Response } from "express";

import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";

import { ResponseDto } from "../shared/dto/response.dto";

import { User } from "../users/entities/user.entity";

import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";

import { JwtPayloadType } from "./types/jwt-payload.type";
import { SafeUser } from "../shared/types/safe-user.type";

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async signUp(dto: SignUpDto): Promise<ResponseDto> {
    const { username, password } = dto;

    const foundUser = await this.userRepo.findOne({
      where: { username },
    });

    if (foundUser) {
      throw new ConflictException("Username already taken.");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    try {
      await this.userRepo.save(user);

      return { message: "ثبت‌نام با موفقیت انجام شد." };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async signIn(
    dto: SignInDto,
    res: Response,
  ): Promise<ResponseDto<SafeUser>> {
    const { username, password } = dto;

    const foundUser = await this.userRepo.findOne({
      where: { username },
    });

    if (!foundUser) {
      throw new UnauthorizedException("Username not found.");
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Password is wrong.");
    }

    await this.generateTokensAndSetCookies(foundUser, res);

    const { password: _1, refreshToken: _2, ...safeUser } = foundUser;

    return {
      message: "ورود با موفقیت انجام شد.",
      result: safeUser,
    };
  }

  public async signOut(userId: string, res: Response): Promise<ResponseDto> {
    await this.userRepo.update(userId, { refreshToken: null });

    this.clearCookies(res);

    return { message: "خروج با موفقیت انجام شد." };
  }

  public verify(user: User): ResponseDto<SafeUser> {
    const { password: _1, refreshToken: _2, ...safeUser } = user;

    return {
      message: "احراز هویت انجام شد.",
      result: safeUser,
    };
  }

  public async refresh(
    userId: string,
    refreshToken: string,
    res: Response,
  ): Promise<ResponseDto> {
    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!foundUser || !foundUser.refreshToken) {
      throw new UnauthorizedException("Refresh token is invalid.");
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      foundUser.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException("Refresh token is invalid.");
    }

    const accessToken = this.generateAccessToken(foundUser);
    this.setAccessTokenCookie(res, accessToken);

    return { message: "توکن دسترسی با موفقیت به‌روزرسانی شد." };
  }

  public clearCookies(res: Response): void {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  private async generateTokensAndSetCookies(
    user: User,
    res: Response,
  ): Promise<void> {
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    await this.updateRefreshToken(user.id, newRefreshToken);

    this.setCookies(res, accessToken, newRefreshToken);
  }

  private generateAccessToken(user: User): string {
    const payload: JwtPayloadType = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User): string {
    const payload: JwtPayloadType = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRATION"),
    });
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const salt = await bcrypt.genSalt();

    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.userRepo.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    this.setAccessTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);
  }

  private setAccessTokenCookie(res: Response, accessToken: string): void {
    const expiration = new Date();

    expiration.setSeconds(
      expiration.getSeconds() +
        this.configService.get<number>("JWT_COOKIE_EXPIRATION_SECONDS")!,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      expires: expiration,
      sameSite: "none",
      path: "/",
    });
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const expiration = new Date();

    expiration.setSeconds(
      expiration.getSeconds() +
        this.configService.get<number>(
          "JWT_REFRESH_COOKIE_EXPIRATION_SECONDS",
        )!,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      expires: expiration,
      sameSite: "none",
      path: "/auth/refresh",
    });
  }
}
