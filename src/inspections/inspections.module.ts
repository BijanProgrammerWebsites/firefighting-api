import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InspectionsService } from "./inspections.service";
import { InspectionsController } from "./inspections.controller";
import { Inspection } from "./entities/inspection.entity";
import { Answer } from "../answers/entities/answer.entity";
import { Equipment } from "../equipments/entities/equipment.entity";
import { Question } from "../questions/entities/question.entity";
import { EquipmentsModule } from "../equipments/equipments.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Inspection, Answer, Equipment, Question]),
    EquipmentsModule,
  ],
  controllers: [InspectionsController],
  providers: [InspectionsService],
  exports: [TypeOrmModule],
})
export class InspectionsModule {}
