import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Answer } from "./entities/answer.entity";
import { Repository } from "typeorm";
import { ResponseDto } from "../shared/dto/response.dto";
import { Question } from "../questions/entities/question.entity";
import { Inspection } from "../inspections/entities/inspection.entity";

@Injectable()
export class AnswersService {
  public constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(Inspection)
    private readonly inspectionRepo: Repository<Inspection>,
  ) {}

  public async findAll(): Promise<ResponseDto<Answer[]>> {
    const answers = await this.answerRepo.find({
      relations: ["inspection", "question"],
    });

    return {
      message: "پاسخ‌ها با موفقیت دریافت شدند.",
      result: answers,
    };
  }

  public async findOne(id: string): Promise<ResponseDto<Answer>> {
    const answer = await this.answerRepo.findOne({
      where: { id },
      relations: ["inspection", "question"],
    });

    if (!answer) {
      throw new NotFoundException("پاسخ پیدا نشد.");
    }

    return {
      message: "پاسخ با موفقیت دریافت شد.",
      result: answer,
    };
  }
}
