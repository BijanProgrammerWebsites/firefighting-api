import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
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

  public async create(_: CreateAnswerDto): Promise<never> {
    throw new BadRequestException(
      "Answers can only be managed through inspections.",
    );
  }

  public async findAll(): Promise<ResponseDto<Answer[]>> {
    const answers = await this.answerRepo.find({
      relations: ["inspection", "question"],
    });

    return {
      message: "Answers found successfully.",
      result: answers,
    };
  }

  public async findOne(id: string): Promise<Answer> {
    const answer = await this.answerRepo.findOne({
      where: { id },
      relations: ["inspection", "question"],
    });

    if (!answer) {
      throw new NotFoundException("Answer not found.");
    }

    return answer;
  }

  public async update(_: string, __: UpdateAnswerDto): Promise<never> {
    throw new BadRequestException(
      "Answers can only be managed through inspections.",
    );
  }

  public async remove(_: string): Promise<never> {
    throw new BadRequestException(
      "Answers can only be managed through inspections.",
    );
  }
}
