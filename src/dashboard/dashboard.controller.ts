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
}
