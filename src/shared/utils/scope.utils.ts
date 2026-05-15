import { ScopeType } from "../types/scope.type";
import { Equipment } from "../../equipments/entities/equipment.entity";
import { FindOptionsWhere } from "typeorm";

export function generateScopeWhereClause(
  scope?: ScopeType,
): FindOptionsWhere<Equipment> {
  if (!scope) {
    return {};
  }

  if (scope.unitId) {
    return { unit: { id: scope.unitId } };
  }

  if (scope.zoneId) {
    return { unit: { zone: { id: scope.zoneId } } };
  }

  if (scope.siteId) {
    return { unit: { zone: { site: { id: scope.siteId } } } };
  }

  return {};
}
