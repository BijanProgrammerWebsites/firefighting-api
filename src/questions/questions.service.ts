import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "./entities/question.entity";
import { ResponseDto } from "../shared/dto/response.dto";

@Injectable()
export class QuestionsService {
  public constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  public async findAll(): Promise<ResponseDto<Question[]>> {
    const questions = await this.questionRepo.find({ relations: ["standard"] });

    return {
      message: "سؤالات با موفقیت دریافت شدند.",
      result: questions,
    };
  }

  private async getQuestionOrFail(id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ["standard"],
    });

    if (!question) {
      throw new NotFoundException("Question not found.");
    }

    return question;
  }

  public async findOne(id: string): Promise<ResponseDto<Question>> {
    const question = await this.getQuestionOrFail(id);

    return {
      message: "سؤال با موفقیت دریافت شد.",
      result: question,
    };
  }
}
