import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateStandardDto } from "./dto/create-standard.dto";
import { UpdateStandardDto } from "./dto/update-standard.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Standard } from "./entities/standard.entity";
import { Repository } from "typeorm";
import { Question } from "../questions/entities/question.entity";
import { ResponseDto } from "../shared/dto/response.dto";

@Injectable()
export class StandardsService {
  public constructor(
    @InjectRepository(Standard)
    private readonly standardRepo: Repository<Standard>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  public async create(dto: CreateStandardDto): Promise<ResponseDto<string>> {
    const standard = await this.standardRepo.save({
      title: dto.title,
    });

    if (dto.questions?.length) {
      const questions = dto.questions.map(({ title, description }) =>
        this.questionRepo.create({ title, description, standard }),
      );
      await this.questionRepo.save(questions);
    }

    return {
      message: "Standard created successfully.",
      result: standard.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Standard[]>> {
    const standards = await this.standardRepo.find({
      relations: ["questions"],
      order: { title: "ASC" },
    });

    return {
      message: "Standards found successfully.",
      result: standards,
    };
  }

  public async findOne(id: string): Promise<Standard> {
    const standard = await this.standardRepo.findOne({
      where: { id },
      relations: ["questions"],
    });

    if (!standard) {
      throw new NotFoundException("Standard not found.");
    }

    return standard;
  }

  public async update(
    id: string,
    dto: UpdateStandardDto,
  ): Promise<ResponseDto> {
    const standard = await this.findOne(id);

    if (dto.title !== undefined) {
      standard.title = dto.title;
    }

    await this.standardRepo.save(standard);

    if (dto.questions) {
      const existingQuestions = await this.questionRepo.find({
        where: { standard: { id } as any },
      });

      if (existingQuestions.length) {
        await this.questionRepo.remove(existingQuestions);
      }

      if (dto.questions.length) {
        const questions = dto.questions.map(({ title, description }) =>
          this.questionRepo.create({ title, description, standard }),
        );
        await this.questionRepo.save(questions);
      }
    }

    return { message: "Standard updated successfully." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    const standard = await this.findOne(id);

    const existingQuestions = await this.questionRepo.find({
      where: { standard: { id } as any },
    });

    if (existingQuestions.length) {
      await this.questionRepo.remove(existingQuestions);
    }

    await this.standardRepo.remove(standard);

    return { message: "Standard removed successfully." };
  }
}
