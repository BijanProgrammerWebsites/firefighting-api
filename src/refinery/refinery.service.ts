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
    const [refinery] = await this.refineryRepo.find();

    return {
      message: "Refinery found successfully.",
      result: refinery,
    };
  }

  public async updateTheOnlyOne(dto: UpdateRefineryDto): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepo.find();

    await this.refineryRepo.update({ id: refinery.id }, dto);

    return { message: "Refinery updated successfully." };
  }

  public async updatePicture(picture: string): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepo.find();

    await this.refineryRepo.update({ id: refinery.id }, { picture });

    return { message: "Refinery picture updated successfully." };
  }

  public async removePicture(): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepo.find();

    await this.refineryRepo.update({ id: refinery.id }, { picture: null });

    return { message: "Refinery picture removed successfully." };
  }
}
