import { Module } from "@nestjs/common";
import { UnitsService } from "./units.service";
import { UnitsController } from "./units.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Unit } from "./entities/unit.entity";
import { ZonesModule } from "../zones/zones.module";

@Module({
  imports: [TypeOrmModule.forFeature([Unit]), ZonesModule],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [TypeOrmModule, UnitsService],
})
export class UnitsModule {}
