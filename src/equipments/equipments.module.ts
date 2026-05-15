import { Module } from "@nestjs/common";
import { EquipmentsService } from "./equipments.service";
import { EquipmentsController } from "./equipments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Equipment } from "./entities/equipment.entity";
import { UnitsModule } from "../units/units.module";
import { Inspection } from "../inspections/entities/inspection.entity";
import { TemplatesModule } from "../templates/templates.module";
import { QueryModule } from "../query/query.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment, Inspection]),
    TemplatesModule,
    UnitsModule,
    QueryModule,
  ],
  controllers: [EquipmentsController],
  providers: [EquipmentsService],
  exports: [TypeOrmModule, EquipmentsService],
})
export class EquipmentsModule {}
