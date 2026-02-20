import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionsService } from "./questions.service";
import { QuestionsController } from "./questions.controller";
import { Question } from "./entities/question.entity";
import { Standard } from "../standards/entities/standard.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Question, Standard])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [TypeOrmModule],
})
export class QuestionsModule {}
