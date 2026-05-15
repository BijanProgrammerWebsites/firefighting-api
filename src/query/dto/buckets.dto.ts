import { Equipment } from "../../equipments/entities/equipment.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";

export type BucketItemDto = {
  equipment: Equipment;
  lastInspection: Inspection | null;
  nextInspectionAt: Date | null;
};

export type BucketsDto = {
  withoutHistory: BucketItemDto[];
  overdue: BucketItemDto[];
  today: BucketItemDto[];
  next7Days: BucketItemDto[];
  next30Days: BucketItemDto[];
};
