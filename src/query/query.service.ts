import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equipment } from "../equipments/entities/equipment.entity";
import { In, Not, Repository } from "typeorm";
import { Inspection } from "../inspections/entities/inspection.entity";
import { BucketsDto } from "./dto/buckets.dto";
import { EquipmentStatusEnum } from "../shared/enums/equipment-status.enum";
import { ScopeType } from "../shared/types/scope.type";
import { generateScopeWhereClause } from "../shared/utils/scope.utils";
import { Defect } from "../defects/entities/defect.entity";
import { DefectStatusEnum } from "../shared/enums/defect-status.enum";
import { DefectSeverityEnum } from "../shared/enums/defect-severity.enum";
import {
  calculateDaysPassedSinceDeadline,
  calculateNextInspectionDate,
} from "../shared/utils/time.utils";
import { OverdueItemType } from "../dashboard/types/overdue-item.type";
import { DefectsBySeverityType } from "../dashboard/types/defects-by-severity.type";

@Injectable()
export class QueryService {
  public constructor(
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    @InjectRepository(Inspection)
    private inspectionRepo: Repository<Inspection>,
    @InjectRepository(Defect)
    private defectRepo: Repository<Defect>,
  ) {}

  public async findTotalEquipments(scope?: ScopeType): Promise<number> {
    return await this.equipmentRepo.count({
      where: generateScopeWhereClause(scope),
    });
  }

  public async findLatestInspections(scope?: ScopeType): Promise<Inspection[]> {
    const equipments = await this.equipmentRepo.find({
      where: generateScopeWhereClause(scope),
    });

    const equipmentIds = equipments.map((e) => e.id);

    return await this.inspectionRepo
      .createQueryBuilder("inspection")
      .leftJoinAndSelect("inspection.equipment", "equipment")
      .leftJoinAndSelect("inspection.answers", "answers")
      .leftJoinAndSelect("equipment.template", "template")
      .leftJoinAndSelect("equipment.unit", "unit")
      .leftJoinAndSelect("unit.zone", "zone")
      .leftJoinAndSelect("zone.site", "site")
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
  }

  public async generateBuckets(scope?: ScopeType): Promise<BucketsDto> {
    const latestInspections = await this.findLatestInspections(scope);

    const buckets: BucketsDto = {
      overdue: [],
      today: [],
      next7Days: [],
      next30Days: [],
    };

    for (const inspection of latestInspections) {
      let bucketKey: keyof BucketsDto = "overdue";

      const diffDays = calculateDaysPassedSinceDeadline(inspection);

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

      const nextInspectionAt = calculateNextInspectionDate(inspection);

      buckets[bucketKey].push({
        inspection,
        nextInspectionAt,
      });
    }

    return buckets;
  }

  public async generateOverdueItems(
    scope?: ScopeType,
  ): Promise<OverdueItemType[]> {
    const latestInspections = await this.findLatestInspections(scope);

    const items: OverdueItemType[] = [];

    for (const inspection of latestInspections) {
      const diffDays = calculateDaysPassedSinceDeadline(inspection);

      if (diffDays >= 0) {
        continue;
      }

      items.push({
        inspection,
        daysPassedSinceDeadline: -1 * diffDays,
      });
    }

    return items;
  }

  public async findEquipmentsByStatus(
    status: EquipmentStatusEnum,
    scope?: ScopeType,
  ): Promise<Equipment[]> {
    return await this.equipmentRepo.find({
      relations: ["template"],
      order: { position: "ASC" },
      where: [generateScopeWhereClause(scope), { status }],
    });
  }

  public async findTotalDefects(scope?: ScopeType): Promise<number> {
    const equipments = await this.equipmentRepo.find({
      where: generateScopeWhereClause(scope),
    });

    return this.defectRepo.count({
      where: {
        equipment: In(equipments.map((x) => x.id)),
        status: Not(DefectStatusEnum.CLOSED),
      },
    });
  }

  public async findDefectsBySeverity(
    severity: DefectSeverityEnum,
    scope?: ScopeType,
  ): Promise<Defect[]> {
    const equipments = await this.equipmentRepo.find({
      where: generateScopeWhereClause(scope),
    });

    return this.defectRepo.find({
      relations: ["equipment"],
      where: {
        equipment: In(equipments.map((x) => x.id)),
        status: Not(DefectStatusEnum.CLOSED),
        severity,
      },
    });
  }

  public async groupDefectsBySeverity(
    scope?: ScopeType,
  ): Promise<DefectsBySeverityType> {
    const equipments = await this.equipmentRepo.find({
      where: generateScopeWhereClause(scope),
    });

    const equipmentIds = equipments.map((e) => e.id);

    const result = await this.defectRepo
      .createQueryBuilder("defect")
      .select('defect."severity"')
      .addSelect('COUNT(defect."id")')
      .leftJoin("defect.equipment", "equipment")
      .where('defect."equipmentId" IN (:...equipmentIds)', { equipmentIds })
      .andWhere('defect."status" <> :status', {
        status: DefectStatusEnum.CLOSED,
      })
      .groupBy('defect."severity"')
      .getRawMany<{ severity: DefectSeverityEnum; count: number }>();

    return Object.fromEntries(
      result.map((item) => [item.severity, item.count]),
    ) as DefectsBySeverityType;
  }
}
