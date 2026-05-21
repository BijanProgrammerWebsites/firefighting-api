import { Inspection } from "../../inspections/entities/inspection.entity";

export type OverdueItemType = {
  inspection: Inspection;
  daysPassedSinceDeadline: number;
};
