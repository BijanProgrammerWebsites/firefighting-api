import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

  public async create(): Promise<never> {
    throw new BadRequestException(
      "Questions can only be managed through standards.",
    );
  }

  public async findAll(): Promise<ResponseDto<Question[]>> {
    const questions = await this.questionRepo.find({ relations: ["standard"] });

    return {
      message: "سؤالات با موفقیت دریافت شدند.",
      result: questions,
    };
  }

  public async findOne(id: string): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ["standard"],
    });

    if (!question) {
      throw new NotFoundException("Question not found.");
    }

    return question;
  }

  public async update(): Promise<never> {
    throw new BadRequestException(
      "Questions can only be managed through standards.",
    );
  }

  public async remove(): Promise<never> {
    throw new BadRequestException(
      "Questions can only be managed through standards.",
    );
  }
}
