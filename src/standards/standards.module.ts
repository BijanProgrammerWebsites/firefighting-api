import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StandardsService } from "./standards.service";
import { StandardsController } from "./standards.controller";
import { Standard } from "./entities/standard.entity";
import { Question } from "../questions/entities/question.entity";
import { Template } from "../templates/entities/template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Standard, Question, Template])],
  controllers: [StandardsController],
  providers: [StandardsService],
  exports: [TypeOrmModule],
})
export class StandardsModule {}
