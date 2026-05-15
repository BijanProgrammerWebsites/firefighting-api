import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equipment } from "../equipments/entities/equipment.entity";
import { Repository } from "typeorm";
import { Inspection } from "../inspections/entities/inspection.entity";
import { BucketsDto } from "../equipments/dto/buckets.dto";

@Injectable()
export class QueryService {
  public constructor(
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    @InjectRepository(Inspection)
    private inspectionRepo: Repository<Inspection>,
  ) {}

  public async generateBuckets(): Promise<BucketsDto> {
    const equipments = await this.equipmentRepo.find({
      relations: ["template"],
      order: { position: "ASC" },
    });

    if (!equipments.length) {
      return {
        withoutHistory: [],
        overdue: [],
        today: [],
        next7Days: [],
        next30Days: [],
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

    return buckets;
  }
}
