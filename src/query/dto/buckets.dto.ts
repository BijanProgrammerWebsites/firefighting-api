import { Inspection } from "../../inspections/entities/inspection.entity";

export type BucketItemDto = {
  inspection: Inspection;
  nextInspectionAt: Date;
};

export type BucketsDto = {
  overdue: BucketItemDto[];
  today: BucketItemDto[];
  next7Days: BucketItemDto[];
  next30Days: BucketItemDto[];
};
