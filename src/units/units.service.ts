import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { MoveDto } from "../shared/dto/move.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Unit } from "./entities/unit.entity";
import { Repository } from "typeorm";
import { getMaxPosition, moveEntities } from "../shared/utils/position.utils";
import { ResponseDto } from "../shared/dto/response.dto";
import { assignDefinedValues } from "../shared/utils/object.utils";
import { ZonesService } from "../zones/zones.service";

@Injectable()
export class UnitsService {
  public constructor(
    @InjectRepository(Unit)
    private unitRepo: Repository<Unit>,
    private readonly zonesService: ZonesService,
  ) {}

  public async create(dto: CreateUnitDto): Promise<ResponseDto<string>> {
    const zone = await this.zonesService.findOne(dto.zoneId);

    const maxPosition = await getMaxPosition(this.unitRepo, "zoneId", zone.id);

    const createdUnit = await this.unitRepo.save({
      ...dto,
      position: maxPosition + 1,
      zone,
    });

    return {
      message: "یونیت با موفقیت ایجاد شد.",
      result: createdUnit.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Unit[]>> {
    const units = await this.unitRepo.find({ order: { position: "ASC" } });

    return {
      message: "یونیت‌ها با موفقیت دریافت شدند.",
      result: units,
    };
  }

  public async findOne(id: string): Promise<Unit> {
    const unit = await this.unitRepo.findOne({ where: { id } });

    if (!unit) {
      throw new NotFoundException("Unit not found.");
    }

    return unit;
  }

  public async update(id: string, dto: UpdateUnitDto): Promise<ResponseDto> {
    const unit = await this.findOne(id);

    const updatedUnit = assignDefinedValues(unit, dto);
    await this.unitRepo.save(updatedUnit);

    return { message: "یونیت با موفقیت به‌روزرسانی شد." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    await this.unitRepo.delete(id);

    return { message: "یونیت با موفقیت حذف شد." };
  }

  public async move(id: string, dto: MoveDto): Promise<ResponseDto> {
    const active = await this.findOne(id);

    const over = await this.unitRepo.findOne({
      where: { id: dto.overId },
    });

    if (!over) {
      throw new NotFoundException("Over not found.");
    }

    const units = await moveEntities(this.unitRepo, active, over);
    await this.unitRepo.save([active, over, ...units]);

    return { message: "یونیت با موفقیت جابه‌جا شد." };
  }
}
