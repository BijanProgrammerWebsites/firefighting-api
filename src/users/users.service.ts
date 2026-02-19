import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";

import { ResponseDto } from "../shared/dto/response.dto";

import { UpdateDto } from "./dto/update.dto";

import { User } from "./entities/user.entity";
import { SafeUser } from "../shared/types/safe-user.type";
import { Role } from "../shared/enums/role.enum";

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async findAllUsers(): Promise<ResponseDto<SafeUser[]>> {
    const users = await this.userRepository.find();

    return {
      message: "User fetched successfully.",
      result: users,
    };
  }

  public me(user: User): ResponseDto<SafeUser> {
    return {
      message: "User fetched successfully.",
      result: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  public async update(user: User, dto: UpdateDto): Promise<ResponseDto> {
    if (!(user.role === Role.ADMIN || user.id === dto.id)) {
      throw new UnauthorizedException("You cannot update this user.");
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    await this.userRepository.update({ id: dto.id }, dto);

    return { message: "User updated successfully." };
  }
}
