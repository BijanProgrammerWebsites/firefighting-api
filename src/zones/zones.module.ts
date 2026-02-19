import { Module } from "@nestjs/common";
import { ZonesService } from "./zones.service";
import { ZonesController } from "./zones.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Zone } from "./entities/zone.entity";
import { SitesModule } from "../sites/sites.module";

@Module({
  imports: [TypeOrmModule.forFeature([Zone]), SitesModule],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [TypeOrmModule],
})
export class ZonesModule {}
