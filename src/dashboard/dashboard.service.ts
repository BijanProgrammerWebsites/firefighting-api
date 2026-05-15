import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResponseDto } from "../shared/dto/response.dto";
import { Equipment } from "../equipments/entities/equipment.entity";
import { KpiType } from "./types/kpi.type";
import { QueryService } from "../query/query.service";
import { StatusEnum } from "../shared/enums/status.enum";
import { ScopeType } from "../shared/types/scope.type";

@Injectable()
export class DashboardService {
  public constructor(
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    private readonly queryService: QueryService,
  ) {}

  public async kpi(scope: ScopeType): Promise<ResponseDto<KpiType>> {
    const totalEquipments = await this.queryService.findTotalEquipments(scope);

    const buckets = await this.queryService.generateBuckets(scope);
    const todayRemainingInspections = buckets.today.length;
    const overdueInspections = buckets.overdue.length;

    const outOfServiceEquipments =
      await this.queryService.findEquipmentsByStatus(StatusEnum.ERROR, scope);

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
