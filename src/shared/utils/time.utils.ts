import { Inspection } from "../../inspections/entities/inspection.entity";

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function calculateNextInspectionDate(inspection: Inspection): Date {
  const lastInspectionAt = inspection.createdDate;
  const inspectionPeriod = inspection.equipment.template.inspectionPeriod;

  const nextInspectionAt = new Date(
    lastInspectionAt.getTime() + inspectionPeriod * MS_PER_DAY,
  );

  const startOfNextInspection = new Date(nextInspectionAt);
  startOfNextInspection.setHours(0, 0, 0, 0);

  return startOfNextInspection;
}

export function calculateDaysPassedSinceDeadline(
  inspection: Inspection,
): number {
  const nextInspectionDate = calculateNextInspectionDate(inspection);
  return calculateDiffDays(nextInspectionDate);
}

export function calculateDiffDays(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMilliseconds = date.getTime() - today.getTime();

  return Math.floor(diffMilliseconds / MS_PER_DAY);
}
