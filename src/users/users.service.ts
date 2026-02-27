import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";

import { ResponseDto } from "../shared/dto/response.dto";

import { UpdateUserDto } from "./dto/update-user.dto";

import { User } from "./entities/user.entity";
import { SafeUser } from "../shared/types/safe-user.type";
import { Role } from "../shared/enums/role.enum";

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async findAllUsers(): Promise<ResponseDto<SafeUser[]>> {
    const users = await this.userRepo.find();

    return {
      message: "کاربران با موفقیت دریافت شدند.",
      result: users,
    };
  }

  public me(user: User): ResponseDto<SafeUser> {
    return {
      message: "کاربر با موفقیت دریافت شد.",
      result: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  public async update(user: User, dto: UpdateUserDto): Promise<ResponseDto> {
    if (!(user.role === Role.ADMIN || user.id === dto.id)) {
      throw new UnauthorizedException(
        "شما مجاز به به‌روزرسانی این کاربر نیستید.",
      );
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    await this.userRepo.update({ id: dto.id }, dto);

    return { message: "کاربر با موفقیت به‌روزرسانی شد." };
  }
}
