import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateDefectDto } from "./dto/update-defect.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Defect } from "./entities/defect.entity";
import { Repository } from "typeorm";
import { ResponseDto } from "../shared/dto/response.dto";
import { assignDefinedValues } from "../shared/utils/object.utils";

@Injectable()
export class DefectsService {
  public constructor(
    @InjectRepository(Defect)
    private defectRepo: Repository<Defect>,
  ) {}

  public async findAll(): Promise<ResponseDto<Defect[]>> {
    const defects = await this.defectRepo.find({
      relations: {
        equipment: { unit: { zone: { site: true } } },
        answer: { question: true },
      },
    });

    return {
      message: "نقص‌ها با موفقیت دریافت شدند.",
      result: defects,
    };
  }

  public async findOne(id: string): Promise<ResponseDto<Defect>> {
    const defect = await this.getDefectOrFail(id);

    return {
      message: "نقص با موفقیت دریافت شد.",
      result: defect,
    };
  }

  public async update(id: string, dto: UpdateDefectDto): Promise<ResponseDto> {
    const defect = await this.getDefectOrFail(id);

    const updatedDefect = assignDefinedValues(defect, dto);
    await this.defectRepo.save(updatedDefect);

    return { message: "نقص با موفقیت به‌روزرسانی شد." };
  }

  private async getDefectOrFail(id: string): Promise<Defect> {
    const defect = await this.defectRepo.findOne({
      where: { id },
      relations: {
        equipment: { unit: { zone: { site: true } } },
        answer: { question: true },
      },
    });

    if (!defect) {
      throw new NotFoundException("نقص پیدا نشد.");
    }

    return defect;
  }
}
