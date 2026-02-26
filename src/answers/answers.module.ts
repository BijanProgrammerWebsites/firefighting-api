import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnswersService } from "./answers.service";
import { AnswersController } from "./answers.controller";
import { Answer } from "./entities/answer.entity";
import { Question } from "../questions/entities/question.entity";
import { Inspection } from "../inspections/entities/inspection.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, Inspection])],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [TypeOrmModule],
})
export class AnswersModule {}
