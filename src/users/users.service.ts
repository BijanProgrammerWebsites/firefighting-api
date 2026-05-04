import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import * as bcrypt from "bcrypt";

import { ResponseDto } from "../shared/dto/response.dto";

import { UpdateUserDto } from "./dto/update-user.dto";

import { User } from "./entities/user.entity";
import { SafeUser } from "../shared/types/safe-user.type";
import { CreateUserDto } from "./dto/create-user.dto";
import { assignDefinedValues } from "../shared/utils/object.utils";

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  public async create(dto: CreateUserDto): Promise<ResponseDto<string>> {
    const { username, password } = dto;

    const foundUser = await this.userRepo.findOne({
      where: { username },
    });

    if (foundUser) {
      throw new ConflictException("نام کاربری قبلاً استفاده شده است.");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await this.userRepo.save({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: "کاربر با موفقیت ایجاد شد.",
      result: createdUser.id,
    };
  }

  public async findAll(): Promise<ResponseDto<SafeUser[]>> {
    const users = await this.userRepo.find({ order: { username: "ASC" } });

    return {
      message: "کاربران با موفقیت دریافت شدند.",
      result: users,
    };
  }

  public async findOne(id: string): Promise<ResponseDto<User>> {
    const user = await this.getUserOrFail(id);

    return {
      message: "کاربر با موفقیت دریافت شد.",
      result: user,
    };
  }

  public async update(id: string, dto: UpdateUserDto): Promise<ResponseDto> {
    const user = await this.getUserOrFail(id);
    const updatedUser = assignDefinedValues(user, dto);

    if (dto.password !== undefined) {
      const salt = await bcrypt.genSalt();
      updatedUser.password = await bcrypt.hash(dto.password, salt);
    }

    await this.userRepo.save(updatedUser);

    return { message: "کاربر با موفقیت به‌روزرسانی شد." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    await this.userRepo.delete(id);

    return { message: "کاربر با موفقیت حذف شد." };
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

  private async getUserOrFail(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("کاربر پیدا نشد.");
    }

    return user;
  }
}
