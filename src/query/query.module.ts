import { Module } from "@nestjs/common";
import { QueryService } from "./query.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Inspection } from "../inspections/entities/inspection.entity";
import { Equipment } from "../equipments/entities/equipment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Inspection, Equipment])],
  providers: [QueryService],
  exports: [TypeOrmModule, QueryService],
})
export class QueryModule {}
