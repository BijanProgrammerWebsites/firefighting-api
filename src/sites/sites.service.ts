import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSiteDto } from "./dto/create-site.dto";
import { UpdateSiteDto } from "./dto/update-site.dto";
import { MoveDto } from "../shared/dto/move.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Site } from "./entities/site.entity";
import { Repository } from "typeorm";
import { getMaxPosition, moveEntities } from "../shared/utils/position.utils";
import { ResponseDto } from "../shared/dto/response.dto";
import { Refinery } from "../refinery/entities/refinery.entity";
import { assignDefinedValues } from "../shared/utils/object.utils";

@Injectable()
export class SitesService {
  public constructor(
    @InjectRepository(Site)
    private siteRepo: Repository<Site>,
    @InjectRepository(Refinery)
    private refineryRepo: Repository<Refinery>,
  ) {}

  public async create(dto: CreateSiteDto): Promise<ResponseDto<string>> {
    const [refinery] = await this.refineryRepo.find();

    const maxPosition = await getMaxPosition(
      this.siteRepo,
      "refineryId",
      refinery.id,
    );

    const createdSite = await this.siteRepo.save({
      ...dto,
      position: maxPosition + 1,
      refinery,
    });

    return {
      message: "سایت با موفقیت ایجاد شد.",
      result: createdSite.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Site[]>> {
    const sites = await this.siteRepo.find({ order: { position: "ASC" } });

    return {
      message: "سایت‌ها با موفقیت دریافت شدند.",
      result: sites,
    };
  }

  public async findOne(id: string): Promise<Site> {
    const site = await this.siteRepo.findOne({ where: { id } });

    if (!site) {
      throw new NotFoundException("Site not found.");
    }

    return site;
  }

  public async update(id: string, dto: UpdateSiteDto): Promise<ResponseDto> {
    const site = await this.findOne(id);

    const updatedSite = assignDefinedValues(site, dto);
    await this.siteRepo.save(updatedSite);

    return { message: "سایت با موفقیت به‌روزرسانی شد." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    await this.siteRepo.delete(id);

    return { message: "سایت با موفقیت حذف شد." };
  }

  public async move(id: string, dto: MoveDto): Promise<ResponseDto> {
    const active = await this.findOne(id);

    const over = await this.siteRepo.findOne({
      where: { id: dto.overId },
    });

    if (!over) {
      throw new NotFoundException("Over not found.");
    }

    const sites = await moveEntities(this.siteRepo, active, over);
    await this.siteRepo.save([active, over, ...sites]);

    return { message: "سایت با موفقیت جابه‌جا شد." };
  }
}
