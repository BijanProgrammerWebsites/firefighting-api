import { Equipment } from "../entities/equipment.entity";

export type BucketsDto = {
  overdue: Equipment[];
  today: Equipment[];
  thisWeek: Equipment[];
  nextWeek: Equipment[];
  later: Equipment[];
};
