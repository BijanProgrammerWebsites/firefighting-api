import { Module } from "@nestjs/common";
import { SitesService } from "./sites.service";
import { SitesController } from "./sites.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Site } from "./entities/site.entity";
import { RefineryModule } from "../refinery/refinery.module";

@Module({
  imports: [TypeOrmModule.forFeature([Site]), RefineryModule],
  controllers: [SitesController],
  providers: [SitesService],
  exports: [TypeOrmModule],
})
export class SitesModule {}
