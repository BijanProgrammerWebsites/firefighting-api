import { SelectQueryBuilder } from "typeorm";
import { ScopeType } from "../../shared/types/scope.type";

declare module "typeorm" {
  interface SelectQueryBuilder<Entity> {
    whereScope(
      scope?: ScopeType,
      equipmentAlias?: string,
    ): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.whereScope = function (
  scope?: ScopeType,
  equipmentAlias = "equipment",
) {
  if (!scope) {
    return this;
  }

  this.leftJoin(`${equipmentAlias}.unit`, "unit")
    .leftJoin("unit.zone", "zone")
    .leftJoin("zone.site", "site");

  if (scope.unitId) {
    return this.andWhere("unit.id = :unitId", {
      unitId: scope.unitId,
    });
  }

  if (scope.zoneId) {
    return this.andWhere("zone.id = :zoneId", {
      zoneId: scope.zoneId,
    });
  }

  if (scope.siteId) {
    return this.andWhere("site.id = :siteId", {
      siteId: scope.siteId,
    });
  }

  return this;
};
