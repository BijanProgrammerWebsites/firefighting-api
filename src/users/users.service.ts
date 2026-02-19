import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";

import { ResponseDto } from "../shared/dto/response.dto";

import { UpdateDto } from "./dto/update.dto";

import { User } from "./user.entity";

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public info(
    user: User,
  ): ResponseDto<Omit<User, "password" | "refreshToken">> {
    return {
      message: "User fetched successfully.",
      result: {
        id: user.id,
        username: user.username,
      },
    };
  }

  public async update(user: User, dto: UpdateDto): Promise<ResponseDto> {
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    await this.userRepository.update({ id: user.id }, dto);

    return {
      message: "User updated successfully.",
    };
  }
}
