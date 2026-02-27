import { Equipment } from "../entities/equipment.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";

export type BucketItemDto = {
  equipment: Equipment;
  lastInspection: Inspection | null;
};

export type BucketsDto = {
  today: BucketItemDto[];
  next7Days: BucketItemDto[];
  next30Days: BucketItemDto[];
  overdue: BucketItemDto[];
};
