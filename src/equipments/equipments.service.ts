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
import { BucketsDto } from "./dto/buckets.dto";
import { TemplatesService } from "../templates/templates.service";

@Injectable()
export class EquipmentsService {
  public constructor(
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    @InjectRepository(Inspection)
    private inspectionRepo: Repository<Inspection>,
    private readonly templatesService: TemplatesService,
    private readonly unitsService: UnitsService,
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
    const equipments = await this.equipmentRepo.find({
      relations: ["template"],
      order: { position: "ASC" },
    });

    if (!equipments.length) {
      return {
        message: "داشبورد با موفقیت دریافت شد.",
        result: {
          withoutHistory: [],
          overdue: [],
          today: [],
          next7Days: [],
          next30Days: [],
        },
      };
    }

    const equipmentIds = equipments.map((e) => e.id);

    const lastInspections = await this.inspectionRepo
      .createQueryBuilder("inspection")
      .leftJoinAndSelect("inspection.equipment", "equipment")
      .leftJoinAndSelect("inspection.answers", "answers")
      .innerJoin(
        (subQ) =>
          subQ
            .from(Inspection, "i")
            .select('i."equipmentId"', "equipmentId")
            .addSelect('MAX(i."createdDate")', "maxCreatedDate")
            .groupBy('i."equipmentId"'),
        "latest",
        'latest."equipmentId" = inspection."equipmentId" AND latest."maxCreatedDate" = inspection."createdDate"',
      )
      .where('inspection."equipmentId" IN (:...equipmentIds)', { equipmentIds })
      .getMany();

    const lastInspectionMap = new Map<string, Inspection>();
    for (const inspection of lastInspections) {
      if (inspection.equipment?.id) {
        lastInspectionMap.set(inspection.equipment.id, inspection);
      }
    }

    const buckets: BucketsDto = {
      withoutHistory: [],
      overdue: [],
      today: [],
      next7Days: [],
      next30Days: [],
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const msInDay = 24 * 60 * 60 * 1000;

    for (const equipment of equipments) {
      const lastInspection = lastInspectionMap.get(equipment.id) ?? null;

      if (!lastInspection) {
        buckets.withoutHistory.push({
          equipment,
          lastInspection: null,
          nextInspectionAt: null,
        });

        continue;
      }

      let bucketKey: keyof BucketsDto = "overdue";

      const lastInspectionAt = lastInspection.createdDate;
      const inspectionPeriod = equipment.template.inspectionPeriod;

      const nextInspectionAt = new Date(
        lastInspectionAt.getTime() + inspectionPeriod * msInDay,
      );

      const startOfNextInspection = new Date(nextInspectionAt);
      startOfNextInspection.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (startOfNextInspection.getTime() - startOfToday.getTime()) / msInDay,
      );

      if (diffDays < 0) {
        bucketKey = "overdue";
      } else if (diffDays === 0) {
        bucketKey = "today";
      } else if (diffDays > 0 && diffDays <= 7) {
        bucketKey = "next7Days";
      } else if (diffDays > 7 && diffDays <= 30) {
        bucketKey = "next30Days";
      } else {
        continue;
      }

      buckets[bucketKey].push({
        equipment,
        lastInspection,
        nextInspectionAt,
      });
    }

    return {
      message: "داشبورد با موفقیت دریافت شد.",
      result: buckets,
    };
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
}
