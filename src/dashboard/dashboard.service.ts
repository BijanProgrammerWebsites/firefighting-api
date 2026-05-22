import { Injectable } from "@nestjs/common";
import { ResponseDto } from "../shared/dto/response.dto";
import { KpiType } from "./types/kpi.type";
import { QueryService } from "../query/query.service";
import { EquipmentStatusEnum } from "../shared/enums/equipment-status.enum";
import { ScopeType } from "../shared/types/scope.type";
import { DefectSeverityEnum } from "../shared/enums/defect-severity.enum";
import { OverdueItemType } from "./types/overdue-item.type";
import { DefectsBySeverityType } from "./types/defects-by-severity.type";
import { DefectsAgingType } from "./types/defects-aging.type";
import { EquipmentsByStatusType } from "./types/equipments-by-status.type";
import { Equipment } from "../equipments/entities/equipment.entity";

@Injectable()
export class DashboardService {
  public constructor(private readonly queryService: QueryService) {}

  public async kpi(scope: ScopeType): Promise<ResponseDto<KpiType>> {
    const totalEquipments = await this.queryService.findTotalEquipments(scope);

    const outOfServiceEquipments =
      await this.queryService.findEquipmentsByStatus(
        EquipmentStatusEnum.OUT_OF_SERVICE,
        scope,
      );

    const buckets = await this.queryService.generateBuckets(scope);
    const todayRemainingInspections = buckets.today.length;
    const overdueInspections = buckets.overdue.length;

    const totalDefects = await this.queryService.findTotalDefects(scope);

    const criticalDefects = await this.queryService.findDefectsBySeverity(
      DefectSeverityEnum.CRITICAL,
      scope,
    );

    return {
      message: "اطلاعات با موفقیت دریافت شد.",
      result: {
        totalEquipments,
        outOfServiceEquipments: outOfServiceEquipments.length,
        todayRemainingInspections,
        overdueInspections,
        totalDefects,
        criticalDefects: criticalDefects.length,
      },
    };
  }

  public async overdue(
    scope: ScopeType,
  ): Promise<ResponseDto<OverdueItemType[]>> {
    const overdueItems = await this.queryService.generateOverdueItems(scope);

    return {
      message: "اطلاعات با موفقیت دریافت شد.",
      result: overdueItems,
    };
  }

  public async defectsBySeverity(
    scope: ScopeType,
  ): Promise<ResponseDto<DefectsBySeverityType>> {
    const defectsBySeverity =
      await this.queryService.groupDefectsBySeverity(scope);

    return {
      message: "اطلاعات با موفقیت دریافت شد.",
      result: defectsBySeverity,
    };
  }

  public async defectsAging(
    scope: ScopeType,
  ): Promise<ResponseDto<DefectsAgingType>> {
    const averageDaysOpen =
      await this.queryService.calculateDefectsAverageDaysOpen(scope);

    const oldestDaysOpen =
      await this.queryService.calculateDefectsOldestDaysOpen(scope);

    return {
      message: "اطلاعات با موفقیت دریافت شد.",
      result: {
        averageDaysOpen,
        oldestDaysOpen,
      },
    };
  }

  public async equipmentsByStatus(
    scope: ScopeType,
  ): Promise<ResponseDto<EquipmentsByStatusType>> {
    const equipmentsByStatus =
      await this.queryService.groupEquipmentsByStatus(scope);

    return {
      message: "اطلاعات با موفقیت دریافت شد.",
      result: equipmentsByStatus,
    };
  }

  public async criticalEquipments(
    scope: ScopeType,
  ): Promise<ResponseDto<Equipment[]>> {
    const criticalEquipments =
      await this.queryService.findCriticalEquipments(scope);

    return {
      message: "اطلاعات با موفقیت دریافت شد.",
      result: criticalEquipments,
    };
  }
}
