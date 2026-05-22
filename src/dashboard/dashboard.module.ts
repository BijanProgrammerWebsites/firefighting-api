import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Inspection } from "../inspections/entities/inspection.entity";
import { Answer } from "../answers/entities/answer.entity";
import { Equipment } from "../equipments/entities/equipment.entity";
import { Question } from "../questions/entities/question.entity";
import { EquipmentsModule } from "../equipments/equipments.module";
import { QueryModule } from "../query/query.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Inspection, Answer, Equipment, Question]),
    EquipmentsModule,
    QueryModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [TypeOrmModule],
})
export class DashboardModule {}
