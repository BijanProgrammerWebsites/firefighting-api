import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Inspection } from "./entities/inspection.entity";
import { Repository } from "typeorm";
import { ResponseDto } from "../shared/dto/response.dto";
import { EquipmentsService } from "../equipments/equipments.service";
import { Answer } from "../answers/entities/answer.entity";
import { Question } from "../questions/entities/question.entity";

@Injectable()
export class InspectionsService {
  public constructor(
    @InjectRepository(Inspection)
    private readonly inspectionRepo: Repository<Inspection>,
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    private readonly equipmentsService: EquipmentsService,
  ) {}

  public async create(dto: CreateInspectionDto): Promise<ResponseDto<string>> {
    const equipmentResponse = await this.equipmentsService.findOne(
      dto.equipmentId,
    );

    if ("error" in equipmentResponse) {
      throw new InternalServerErrorException(equipmentResponse.error);
    }

    const { result: equipment } = equipmentResponse;

    const inspection = await this.inspectionRepo.save({
      equipment,
    });

    if (dto.answers?.length) {
      const answers: Answer[] = [];

      for (const answerDto of dto.answers) {
        const question = await this.questionRepo.findOne({
          where: { id: answerDto.questionId },
        });

        if (!question) {
          throw new NotFoundException("سؤال پیدا نشد.");
        }

        const answer = this.answerRepo.create({
          status: answerDto.status,
          text: answerDto.text,
          picture: answerDto.picture ?? null,
          inspection,
          question,
        });

        answers.push(answer);
      }

      await this.answerRepo.save(answers);
    }

    return {
      message: "بازرسی با موفقیت ایجاد شد.",
      result: inspection.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Inspection[]>> {
    const inspections = await this.inspectionRepo.find({
      relations: ["equipment", "answers", "answers.question"],
      order: { createdDate: "DESC" },
    });

    return {
      message: "بازرسی‌ها با موفقیت دریافت شدند.",
      result: inspections,
    };
  }

  private async getInspectionOrFail(id: string): Promise<Inspection> {
    const inspection = await this.inspectionRepo.findOne({
      where: { id },
      relations: ["equipment"],
    });

    if (!inspection) {
      throw new NotFoundException("بازرسی پیدا نشد.");
    }

    return inspection;
  }

  public async findOne(id: string): Promise<ResponseDto<Inspection>> {
    const inspection = await this.inspectionRepo.findOne({
      where: { id },
      relations: ["equipment", "answers", "answers.question"],
    });

    if (!inspection) {
      throw new NotFoundException("بازرسی پیدا نشد.");
    }

    return {
      message: "بازرسی با موفقیت دریافت شد.",
      result: inspection,
    };
  }

  public async update(
    id: string,
    dto: UpdateInspectionDto,
  ): Promise<ResponseDto> {
    const inspection = await this.getInspectionOrFail(id);

    if (dto.equipmentId) {
      const equipmentResponse = await this.equipmentsService.findOne(
        dto.equipmentId,
      );

      if ("error" in equipmentResponse) {
        throw new InternalServerErrorException(equipmentResponse.error);
      }

      const { result: equipment } = equipmentResponse;
      inspection.equipment = equipment;
    }

    if (dto.answers) {
      const existingAnswers = await this.answerRepo.find({
        where: { inspection: { id } as any },
      });

      if (existingAnswers.length) {
        await this.answerRepo.remove(existingAnswers);
      }

      if (dto.answers.length) {
        const answers: Answer[] = [];

        for (const answerDto of dto.answers) {
          const question = await this.questionRepo.findOne({
            where: { id: answerDto.questionId },
          });

          if (!question) {
            throw new NotFoundException("سؤال پیدا نشد.");
          }

          const answer = this.answerRepo.create({
            status: answerDto.status,
            text: answerDto.text,
            picture: answerDto.picture ?? null,
            inspection,
            question,
          });

          answers.push(answer);
        }

        await this.answerRepo.save(answers);
      }
    }

    await this.inspectionRepo.save(inspection);

    return { message: "بازرسی با موفقیت به‌روزرسانی شد." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    const inspection = await this.getInspectionOrFail(id);

    const existingAnswers = await this.answerRepo.find({
      where: { inspection: { id } as any },
    });

    if (existingAnswers.length) {
      await this.answerRepo.remove(existingAnswers);
    }

    await this.inspectionRepo.remove(inspection);

    return { message: "بازرسی با موفقیت حذف شد." };
  }
}
