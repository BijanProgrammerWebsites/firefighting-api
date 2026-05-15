import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResponseDto } from "../shared/dto/response.dto";
import { Equipment } from "../equipments/entities/equipment.entity";
import { KpiType } from "./types/kpi.type";
import { QueryService } from "../query/query.service";
import { StatusEnum } from "../shared/enums/status.enum";

@Injectable()
export class DashboardService {
  public constructor(
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    private readonly queryService: QueryService,
  ) {}

  public async kpi(): Promise<ResponseDto<KpiType>> {
    const totalEquipments = await this.equipmentRepo.count();

    const buckets = await this.queryService.generateBuckets();
    const todayRemainingInspections = buckets.today.length;
    const overdueInspections = buckets.overdue.length;

    const outOfServiceEquipments =
      await this.queryService.findEquipmentsByStatus(StatusEnum.ERROR);

    return {
      message: "اطلاعات با موفقیت دریافت شد.",
      result: {
        totalEquipments,
        outOfServiceEquipments: outOfServiceEquipments.length,
        todayRemainingInspections,
        overdueInspections,
        totalDefects: -1,
        criticalDefects: -1,
      },
    };
  }
}
