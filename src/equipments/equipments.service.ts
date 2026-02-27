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

@Injectable()
export class EquipmentsService {
  public constructor(
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    private readonly unitsService: UnitsService,
  ) {}

  public async create(dto: CreateEquipmentDto): Promise<ResponseDto<string>> {
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
    });

    return {
      message: "تجهیزات با موفقیت دریافت شدند.",
      result: equipments,
    };
  }

  public async buckets(): Promise<ResponseDto<BucketsDto>> {
    const qb = this.equipmentRepo
      .createQueryBuilder("equipment")
      .leftJoinAndSelect("equipment.template", "template")
      .leftJoin(
        (subQ) =>
          subQ
            .from(Inspection, "inspection")
            .select('inspection."equipmentId"', "equipmentId")
            .addSelect('MAX(inspection."createdDate")', "lastInspectionAt")
            .groupBy('inspection."equipmentId"'),
        "last_inspection",
        'last_inspection."equipmentId" = equipment.id',
      )
      .addSelect(
        `
        CASE
          WHEN last_inspection."lastInspectionAt" IS NULL THEN 'overdue'
          ELSE
            CASE
              WHEN (last_inspection."lastInspectionAt" + (template."inspectionPeriod" || ' days')::interval) < now()
                THEN 'overdue'
              WHEN date_trunc('day', last_inspection."lastInspectionAt" + (template."inspectionPeriod" || ' days')::interval)
                   = date_trunc('day', now())
                THEN 'today'
              WHEN (last_inspection."lastInspectionAt" + (template."inspectionPeriod" || ' days')::interval)
                   > now()
               AND (last_inspection."lastInspectionAt" + (template."inspectionPeriod" || ' days')::interval)
                   <= now() + interval '7 days'
                THEN 'thisWeek'
              WHEN (last_inspection."lastInspectionAt" + (template."inspectionPeriod" || ' days')::interval)
                   > now() + interval '7 days'
               AND (last_inspection."lastInspectionAt" + (template."inspectionPeriod" || ' days')::interval)
                   <= now() + interval '14 days'
                THEN 'nextWeek'
              ELSE 'later'
            END
        END
      `,
        "bucket",
      );

    const { raw, entities } = await qb.getRawAndEntities();

    const buckets: BucketsDto = {
      overdue: [],
      today: [],
      thisWeek: [],
      nextWeek: [],
      later: [],
    };

    raw.forEach((row, index) => {
      const bucket = (row as { bucket: string }).bucket;
      if (!buckets[bucket]) {
        buckets[bucket] = [];
      }
      buckets[bucket].push(entities[index]);
    });

    return {
      message: "داشبورد با موفقیت دریافت شد.",
      result: {
        overdue: buckets.overdue,
        today: buckets.today,
        thisWeek: buckets.thisWeek,
        nextWeek: buckets.nextWeek,
        later: buckets.later,
      },
    };
  }

  private async getEquipmentOrFail(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepo.findOne({ where: { id } });

    if (!equipment) {
      throw new NotFoundException("Equipment not found.");
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
      throw new NotFoundException("Over not found.");
    }

    const equipments = await moveEntities(this.equipmentRepo, active, over);
    await this.equipmentRepo.save([active, over, ...equipments]);

    return { message: "تجهیز با موفقیت جابه‌جا شد." };
  }
}
