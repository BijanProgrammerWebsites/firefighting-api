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
    private refineryRepository: Repository<Refinery>,
  ) {}

  async findTheOnlyOne(): Promise<ResponseDto<Refinery>> {
    const [refinery] = await this.refineryRepository.find();

    return {
      message: "Refinery found successfully.",
      result: refinery,
    };
  }

  async updateTheOnlyOne(dto: UpdateRefineryDto): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepository.find();

    await this.refineryRepository.update({ id: refinery.id }, dto);

    return { message: "Refinery updated successfully." };
  }

  async updatePicture(picture: string): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepository.find();

    await this.refineryRepository.update({ id: refinery.id }, { picture });

    return { message: "Refinery picture updated successfully." };
  }

  async removePicture(): Promise<ResponseDto> {
    const [refinery] = await this.refineryRepository.find();

    await this.refineryRepository.update(
      { id: refinery.id },
      { picture: null },
    );

    return { message: "Refinery picture removed successfully." };
  }
}
