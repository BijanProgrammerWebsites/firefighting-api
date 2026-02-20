import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StandardsService } from "./standards.service";
import { StandardsController } from "./standards.controller";
import { Standard } from "./entities/standard.entity";
import { Question } from "../questions/entities/question.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Standard, Question])],
  controllers: [StandardsController],
  providers: [StandardsService],
  exports: [TypeOrmModule],
})
export class StandardsModule {}
