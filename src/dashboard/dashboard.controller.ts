import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { DashboardService } from "./dashboard.service";

@UseGuards(JwtAuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("kpi")
  public kpi(
    @Query("siteId") siteId?: string,
    @Query("zoneId") zoneId?: string,
    @Query("unitId") unitId?: string,
  ) {
    return this.dashboardService.kpi({ siteId, zoneId, unitId });
  }

  @Get("overdue")
  public overdue(
    @Query("siteId") siteId?: string,
    @Query("zoneId") zoneId?: string,
    @Query("unitId") unitId?: string,
  ) {
    return this.dashboardService.overdue({ siteId, zoneId, unitId });
  }

  @Get("defects-by-severity")
  public defectsBySeverity(
    @Query("siteId") siteId?: string,
    @Query("zoneId") zoneId?: string,
    @Query("unitId") unitId?: string,
  ) {
    return this.dashboardService.defectsBySeverity({ siteId, zoneId, unitId });
  }

  @Get("defects-aging")
  public defectsAging(
    @Query("siteId") siteId?: string,
    @Query("zoneId") zoneId?: string,
    @Query("unitId") unitId?: string,
  ) {
    return this.dashboardService.defectsAging({ siteId, zoneId, unitId });
  }
}
