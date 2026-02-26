import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateZoneDto } from "./dto/create-zone.dto";
import { UpdateZoneDto } from "./dto/update-zone.dto";
import { MoveDto } from "../shared/dto/move.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Zone } from "./entities/zone.entity";
import { Repository } from "typeorm";
import { getMaxPosition, moveEntities } from "../shared/utils/position.utils";
import { ResponseDto } from "../shared/dto/response.dto";
import { assignDefinedValues } from "../shared/utils/object.utils";
import { SitesService } from "../sites/sites.service";

@Injectable()
export class ZonesService {
  public constructor(
    @InjectRepository(Zone)
    private zoneRepo: Repository<Zone>,
    private readonly sitesService: SitesService,
  ) {}

  public async create(dto: CreateZoneDto): Promise<ResponseDto<string>> {
    const site = await this.sitesService.findOne(dto.siteId);

    const maxPosition = await getMaxPosition(this.zoneRepo, "siteId", site.id);

    const createdZone = await this.zoneRepo.save({
      ...dto,
      position: maxPosition + 1,
      site,
    });

    return {
      message: "زون با موفقیت ایجاد شد.",
      result: createdZone.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Zone[]>> {
    const zones = await this.zoneRepo.find({ order: { position: "ASC" } });

    return {
      message: "زون‌ها با موفقیت دریافت شدند.",
      result: zones,
    };
  }

  public async findOne(id: string): Promise<Zone> {
    const zone = await this.zoneRepo.findOne({ where: { id } });

    if (!zone) {
      throw new NotFoundException("Zone not found.");
    }

    return zone;
  }

  public async update(id: string, dto: UpdateZoneDto): Promise<ResponseDto> {
    const zone = await this.findOne(id);

    const updatedZone = assignDefinedValues(zone, dto);
    await this.zoneRepo.save(updatedZone);

    return { message: "زون با موفقیت به‌روزرسانی شد." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    await this.zoneRepo.delete(id);

    return { message: "زون با موفقیت حذف شد." };
  }

  public async move(id: string, dto: MoveDto): Promise<ResponseDto> {
    const active = await this.findOne(id);

    const over = await this.zoneRepo.findOne({
      where: { id: dto.overId },
    });

    if (!over) {
      throw new NotFoundException("Over not found.");
    }

    const zones = await moveEntities(this.zoneRepo, active, over);
    await this.zoneRepo.save([active, over, ...zones]);

    return { message: "زون با موفقیت جابه‌جا شد." };
  }
}
