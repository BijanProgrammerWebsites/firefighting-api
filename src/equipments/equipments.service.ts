import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { MoveDto } from "../shared/dto/move.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Equipment } from "./entities/equipment.entity";
import { Repository } from "typeorm";
import { getMaxPosition, moveEntities } from "../shared/utils/position.utils";
import { ResponseDto } from "../shared/dto/response.dto";
import { assignDefinedValues } from "../shared/utils/object.utils";
import { UnitsService } from "../units/units.service";
import { Inspection } from "../inspections/entities/inspection.entity";
import { BucketsDto } from "../query/dto/buckets.dto";
import { TemplatesService } from "../templates/templates.service";
import { QueryService } from "../query/query.service";

@Injectable()
export class EquipmentsService {
  public constructor(
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    @InjectRepository(Inspection)
    private inspectionRepo: Repository<Inspection>,
    private readonly templatesService: TemplatesService,
    private readonly unitsService: UnitsService,
    private readonly queryService: QueryService,
  ) {}

  public async create(dto: CreateEquipmentDto): Promise<ResponseDto<string>> {
    const templateResponse = await this.templatesService.findOne(
      dto.templateId,
    );

    if ("error" in templateResponse) {
      throw new InternalServerErrorException(templateResponse.error);
    }

    const { result: template } = templateResponse;

    const unitResponse = await this.unitsService.findOne(dto.unitId);

    if ("error" in unitResponse) {
      throw new InternalServerErrorException(unitResponse.error);
    }

    const { result: unit } = unitResponse;

    const maxPosition = await getMaxPosition(
      this.equipmentRepo,
      "unitId",
      unit.id,
    );

    const createdEquipment = await this.equipmentRepo.save({
      ...dto,
      position: maxPosition + 1,
      template,
      unit,
    });

    return {
      message: "تجهیز با موفقیت ایجاد شد.",
      result: createdEquipment.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Equipment[]>> {
    const equipments = await this.equipmentRepo.find({
      order: { position: "ASC" },
      relations: {
        template: true,
        unit: { zone: { site: true } },
      },
    });

    return {
      message: "تجهیزات با موفقیت دریافت شدند.",
      result: equipments,
    };
  }

  public async buckets(): Promise<ResponseDto<BucketsDto>> {
    const buckets = await this.queryService.generateBuckets();

    return {
      message: "داشبورد با موفقیت دریافت شد.",
      result: buckets,
    };
  }

  public async findOne(id: string): Promise<ResponseDto<Equipment>> {
    const equipment = await this.getEquipmentOrFail(id);

    return {
      message: "تجهیز با موفقیت دریافت شد.",
      result: equipment,
    };
  }

  public async update(
    id: string,
    dto: UpdateEquipmentDto,
  ): Promise<ResponseDto> {
    const equipment = await this.getEquipmentOrFail(id);
    const updatedEquipment = assignDefinedValues(equipment, dto);

    if (dto.templateId) {
      const templateResponse = await this.templatesService.findOne(
        dto.templateId,
      );

      if ("error" in templateResponse) {
        throw new InternalServerErrorException(templateResponse.error);
      }

      updatedEquipment.template = templateResponse.result;
    }

    if (dto.unitId) {
      const unitResponse = await this.unitsService.findOne(dto.unitId);

      if ("error" in unitResponse) {
        throw new InternalServerErrorException(unitResponse.error);
      }

      updatedEquipment.unit = unitResponse.result;
    }

    await this.equipmentRepo.save(updatedEquipment);

    return { message: "تجهیز با موفقیت به‌روزرسانی شد." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    await this.equipmentRepo.delete(id);

    return { message: "تجهیز با موفقیت حذف شد." };
  }

  public async move(id: string, dto: MoveDto): Promise<ResponseDto> {
    const active = await this.getEquipmentOrFail(id);

    const over = await this.equipmentRepo.findOne({
      where: { id: dto.overId },
    });

    if (!over) {
      throw new NotFoundException("مورد مقصد پیدا نشد.");
    }

    const equipments = await moveEntities(this.equipmentRepo, active, over);
    await this.equipmentRepo.save([active, over, ...equipments]);

    return { message: "تجهیز با موفقیت جابه‌جا شد." };
  }

  private async getEquipmentOrFail(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepo.findOne({
      where: { id },
      relations: {
        template: { standard: { questions: true } },
        unit: { zone: { site: true } },
      },
    });

    if (!equipment) {
      throw new NotFoundException("تجهیز پیدا نشد.");
    }

    return equipment;
  }
}
