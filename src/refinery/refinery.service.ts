import { Injectable } from "@nestjs/common";
import { UpdateRefineryDto } from "./dto/update-refinery.dto";
import { ResponseDto } from "../shared/dto/response.dto";
import { Refinery } from "./entities/refinery.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RefineryService {
  public constructor(
    @InjectRepository(Refinery)
    private refineryRepo: Repository<Refinery>,
  ) {}

  public async findTheOnlyOne(): Promise<ResponseDto<Refinery>> {
    const [refinery] = await this.refineryRepo.find({
      relations: ["sites"],
    });

    return {
      message: "پالایشگاه با موفقیت دریافت شد.",
      result: refinery,
    };
  }

  public async findDetailed(): Promise<ResponseDto<Refinery>> {
    const [refinery] = await this.refineryRepo.find({
      relations: { sites: { zones: { units: true } } },
    });

    return {
      message: "جزئیات پالایشگاه با موفقیت دریافت شد.",
      result: refinery,
    };
  }

  public async updateTheOnlyOne(dto: UpdateRefineryDto): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepo.find();

    await this.refineryRepo.update({ id: refinery.id }, dto);

    return { message: "پالایشگاه با موفقیت به‌روزرسانی شد." };
  }

  public async updatePicture(picture: string): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepo.find();

    await this.refineryRepo.update({ id: refinery.id }, { picture });

    return { message: "تصویر پالایشگاه با موفقیت به‌روزرسانی شد." };
  }

  public async removePicture(): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepo.find();

    await this.refineryRepo.update({ id: refinery.id }, { picture: null });

    return { message: "تصویر پالایشگاه با موفقیت حذف شد." };
  }
}
